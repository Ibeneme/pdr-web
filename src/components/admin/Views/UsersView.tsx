import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  ShieldAlert,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
  Users,
  Car,
  //SteeringWheel, // Using SteeringWheel as a clean icon indicator for drivers
} from "lucide-react";
import type { AppDispatch, RootState } from "../../../api/store";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

// Categorized roles toggle interface schema
type ViewRole = "users" | "drivers";

export const UsersView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, pagination } = useSelector(
    (state: RootState) => state.adminData
  );

  // Pagination, Search, Role, and Timestamp filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRoleView, setActiveRoleView] = useState<ViewRole>("users");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const limit = 10;

  useEffect(() => {
    dispatch(fetchAdminData({ collection: "users", page: currentPage, limit }));
  }, [dispatch, currentPage]);

  // Derive dynamic account metric summary values directly out of your global pipeline state arrays
  const metrics = useMemo(() => {
    const rawList = users || [];
    const driversCount = rawList.filter((u: any) => u.isDriver === true).length;
    const standardUsersCount = rawList.length - driversCount;

    return {
      totalUsers: rawList.length,
      totalDrivers: driversCount,
      totalStandard: standardUsersCount,
    };
  }, [users]);

  // Dynamically compile available years present inside the user collection metadata timestamps
  const availableYears = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    const yearsSet = new Set<string>();
    users.forEach((user: any) => {
      if (user.createdAt) {
        const year = new Date(user.createdAt).getFullYear().toString();
        if (year && year !== "NaN") yearsSet.add(year);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [users]);

  // Client-side multi-layer stream filtration matrix matching text queries, roles, and temporal parameters
  const filteredUsers = (users || []).filter((user: any) => {
    // 1. Role Context Filtration Toggle (Standard User vs Verified Driver)
    if (activeRoleView === "drivers") {
      if (user.isDriver !== true) return false;
    } else {
      // "users" role shows everyone or just non-drivers depending on preference. Here it shows all standard entries.
      if (user.isDriver === true) return false;
    }

    // 2. Text Search fuzzy matching filters
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase().trim();
      const matchName = user.fullName?.toLowerCase().includes(query);
      const matchEmail = user.email?.toLowerCase().includes(query);
      const matchPhone = user.phone?.includes(query);

      if (!matchName && !matchEmail && !matchPhone) return false;
    }

    // 3. Month & Year Calendar Timeline filters
    if (user.createdAt) {
      const accountDate = new Date(user.createdAt);

      if (selectedMonth !== "all") {
        const recordMonth = accountDate.getMonth().toString();
        if (recordMonth !== selectedMonth) return false;
      }

      if (selectedYear !== "all") {
        const recordYear = accountDate.getFullYear().toString();
        if (recordYear !== selectedYear) return false;
      }
    } else if (selectedMonth !== "all" || selectedYear !== "all") {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil((pagination["users"]?.total || 0) / limit);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleRoleViewChange = (role: ViewRole) => {
    setActiveRoleView(role);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Metric Overview Analytics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Accounts Summary Card */}
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Registries
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 font-mono">
              {metrics.totalUsers}
            </h3>
          </div>
          <div className="p-3 bg-zinc-100 text-zinc-700 rounded-xl">
            <Users size={20} />
          </div>
        </div>

        {/* Standard User Segment Card */}
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Standard Customers
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 font-mono">
              {metrics.totalStandard}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck size={20} />
          </div>
        </div>

        {/* Verified Active Drivers Card */}
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Verified Drivers
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 font-mono">
              {metrics.totalDrivers}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Car size={20} />
          </div>
        </div>
      </div>

      {/* Top Operations Panel & Filtering Controls Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-end border-b border-zinc-100 pb-5">
        <div className="flex flex-col md:flex-row flex-1 gap-3 items-stretch">
          {/* Keyword Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search ${activeRoleView} by name, email, or phone number...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          {/* Month Dropdown Selector */}
          <div className="w-full md:w-40">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white text-zinc-700 transition-all cursor-pointer"
            >
              <option value="all">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>

          {/* Year Dropdown Selector */}
          <div className="w-full md:w-32">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white text-zinc-700 transition-all cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Segment Switch and Action Controls Row */}
        <div className="flex flex-wrap items-center gap-3 self-start xl:self-auto">
          {/* User vs Driver Core Dynamic Content View Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => handleRoleViewChange("users")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeRoleView === "users"
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Customers View
            </button>
            <button
              onClick={() => handleRoleViewChange("drivers")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeRoleView === "drivers"
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Drivers Only ({metrics.totalDrivers})
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            <SlidersHorizontal size={16} />
            Filter Status
          </button>
        </div>
      </div>

      {/* Loading Overlay State */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <Loader2 className="animate-spin text-black" size={32} />
          <p className="text-sm font-medium">
            Fetching secure account registries...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-200 rounded-xl">
          <p className="text-base font-semibold text-black mb-1">
            No matching registries found
          </p>
          <p className="text-sm text-zinc-400">
            Try adjusting your role switches, keyword configurations, or date
            ranges.
          </p>
        </div>
      ) : (
        <>
          {/* Main Accounts Inventory Grid/Table */}
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                <thead>
                  <tr className="text-zinc-500 font-medium">
                    <th scope="col" className="pb-4 font-semibold">
                      User Profile Identity
                    </th>
                    <th scope="col" className="pb-4 font-semibold">
                      Contact Matrices
                    </th>
                    <th scope="col" className="pb-4 font-semibold">
                      Location Context
                    </th>
                    <th scope="col" className="pb-4 font-semibold">
                      Platform Access Level
                    </th>
                    {/* <th scope="col" className="pb-4 font-semibold text-right">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 whitespace-nowrap">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-zinc-50/70 transition-colors group"
                    >
                      {/* Column 1: Identity Card */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-900 text-white font-bold rounded-full flex items-center justify-center uppercase text-sm ring-2 ring-zinc-100 overflow-hidden shrink-0">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.fullName?.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                              {user.fullName}
                              {user.isVerified && (
                                <UserCheck
                                  size={14}
                                  className="text-emerald-600"
                                />
                              )}
                            </div>
                            <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
                              {user.gender || "Not Specified"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Contact Details */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                            <Mail size={12} className="text-zinc-400" />{" "}
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-medium">
                            <Phone size={12} className="text-zinc-400" />{" "}
                            {user.phone}
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Address Fields */}
                      <td className="py-4 px-4">
                        <div className="max-w-[180px] truncate text-zinc-600 text-xs font-medium">
                          <div
                            className="flex items-center gap-1 mt-0.5"
                            title={user.address || "No Address Added"}
                          >
                            <MapPin
                              size={12}
                              className="text-zinc-400 shrink-0"
                            />
                            <span className="truncate">
                              {user.address || "No Address Provided"}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-semibold uppercase mt-0.5 ml-4">
                            {user.occupation || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Column 4: Operational Status Badge Matrix */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {user.isDriver ? (
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-600 text-white rounded shadow-sm">
                              Driver Active
                            </span>
                          ) : user.isDriverPending ? (
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded animate-pulse">
                              Driver Pending
                            </span>
                          ) : user.isDriverSuspended ? (
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 rounded flex items-center gap-1">
                              <ShieldAlert size={10} /> Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[11px] font-medium bg-zinc-100 text-zinc-600 rounded">
                              Standard User
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Action Triggers */}
                      {/* <td className="py-4 pl-4 text-right">
                        <button className="text-xs font-bold bg-zinc-100 text-zinc-800 hover:bg-black hover:text-white px-3 py-1.5 rounded-md transition-all">
                          Manage Account
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Footnote & Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 pt-5 mt-4 gap-4">
            <p className="text-xs font-medium text-zinc-500">
              Showing{" "}
              <span className="text-black font-semibold">
                {filteredUsers.length}
              </span>{" "}
              entries this page out of{" "}
              <span className="text-black font-semibold">
                {pagination["users"]?.total || 0}
              </span>{" "}
              system accounts.
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-bold px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-lg">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNextPage}
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
