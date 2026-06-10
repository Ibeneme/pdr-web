import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

// Explicit status category unions for filtering alignment
type FilterStatus = "all" | "collected" | "pending";

export const CommissionsView: React.FC = () => {
  const dispatch = useDispatch<any>();

  // Extract commission states dynamically from your admin data slice reducer pipeline
  const { commissions, loading, error } = useSelector(
    (state: any) => state.adminData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const itemsPerPage = 10;

  // Log incoming real-time commission log arrays explicitly for debugging audits
  console.log(commissions, "commissions");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "commissions",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  // Generate an array of years available in the data array to fill the dropdown dynamically
  const availableYears = React.useMemo(() => {
    if (!commissions || !Array.isArray(commissions)) return [];
    const yearsSet = new Set<string>();
    commissions.forEach((comm: any) => {
      if (comm.createdAt) {
        const year = new Date(comm.createdAt).getFullYear().toString();
        if (year && year !== "NaN") yearsSet.add(year);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a)); // Newest years first
  }, [commissions]);

  // Client-side filtration stream processor mapping status, text query, month, and year variants
  const filteredCommissions = (commissions || []).filter((commission: any) => {
    // 1. Evaluate Status Filters
    if (activeFilter !== "all") {
      const statusNormalized = (commission.status || "").toLowerCase();
      if (statusNormalized !== activeFilter) return false;
    }

    // 2. Evaluate Text Search Filter (Matches withdrawal reference, fullName, or email)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const matchRef = (commission.withdrawalReference || "")
        .toLowerCase()
        .includes(query);
      const matchName = (commission.userId?.fullName || "")
        .toLowerCase()
        .includes(query);
      const matchEmail = (commission.userId?.email || "")
        .toLowerCase()
        .includes(query);

      if (!matchRef && !matchName && !matchEmail) return false;
    }

    // 3. Evaluate Month & Year Filters
    if (commission.createdAt) {
      const dateObj = new Date(commission.createdAt);

      if (selectedMonth !== "all") {
        // getMonth() returns 0-11 index; match it against string value mapping
        const monthIndex = dateObj.getMonth().toString();
        if (monthIndex !== selectedMonth) return false;
      }

      if (selectedYear !== "all") {
        const yearValue = dateObj.getFullYear().toString();
        if (yearValue !== selectedYear) return false;
      }
    } else if (selectedMonth !== "all" || selectedYear !== "all") {
      // Exclude documents missing date stamps if timestamp filter metrics are configured
      return false;
    }

    return true;
  });

  // Calculate total pages dynamically using the filtered array's length
  const totalPages = Math.ceil(filteredCommissions.length / itemsPerPage) || 1;

  // Safely handle filter changes and reset pagination indices to prevent empty index states
  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  // Currency utility formatting helper targeting Nigerian Naira marketplace items
  const formatCurrency = (amount: number) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Human-readable date parsing interface formatting helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section Layout */}
      <div className="flex flex-col gap-4 pb-5 border-b border-zinc-100 xl:flex-row xl:justify-between xl:items-end">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Admin Revenue &amp; Commission Ledger
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Audit platform operational revenues tracking 15% platform cuts
            logged automatically during user withdrawal settlements.
          </p>
        </div>

        {/* Global Toolbar Control Area containing Search, Select Inputs, and Status Filter Pills */}
        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 w-full xl:w-auto">
          {/* Search Input Control */}
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search reference or user details..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 placeholder-zinc-400 text-zinc-900 transition-all shadow-sm"
            />
          </div>

          {/* Month Dropdown Select */}
          <div className="w-full md:w-40">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-zinc-700 transition-all shadow-sm cursor-pointer"
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

          {/* Year Dropdown Select */}
          <div className="w-full md:w-32">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-zinc-700 transition-all shadow-sm cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Status Toggle Filters Switch Component */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start md:self-auto">
            {(["all", "collected", "pending"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${
                    activeFilter === status
                      ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Error Boundary Alerts */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Table Interface Component */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                <th className="px-6 py-4">Withdrawal Reference</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Total Payout</th>
                <th className="px-6 py-4">Commission (15%)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                      <span>
                        Syncing system platform earnings ledger streams...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredCommissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-zinc-400 italic"
                  >
                    No matching commission history records found for the current
                    search and timestamp metrics.
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((commission: any) => (
                  <tr
                    key={commission._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* Withdrawal Track Code References */}
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-zinc-900 text-xs tracking-wider uppercase bg-zinc-100 px-2 py-1 rounded w-max">
                        {commission.withdrawalReference || "N/A"}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-2">
                        Logged: {formatDate(commission.createdAt)}
                      </div>
                    </td>

                    {/* Populated User Document Context */}
                    <td className="px-6 py-4">
                      {commission.userId ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-zinc-800">
                            {commission.userId.fullName || "Unknown User"}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {commission.userId.email || "N/A"}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {commission.userId.phone || "N/A"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">
                          No linked user profile record
                        </span>
                      )}
                    </td>

                    {/* Core Payout Amount */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-600 font-medium font-mono">
                        {formatCurrency(commission.totalWithdrawnAmount)}
                      </div>
                    </td>

                    {/* Derived 15% Profits */}
                    <td className="px-6 py-4">
                      <div className="text-emerald-600 font-bold font-mono text-base">
                        {formatCurrency(commission.adminEarnings)}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        Fixed rate: {commission.commissionPercentage || 15}%
                      </div>
                    </td>

                    {/* Collection Audit Badges */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          commission.status === "collected"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            commission.status === "collected"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {commission.status || "Unknown"}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls Footer Component */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Showing Page{" "}
            <span className="font-semibold text-zinc-800">{currentPage}</span>{" "}
            of <span className="font-semibold text-zinc-800">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 border border-zinc-200 rounded-md bg-white text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={
                currentPage === totalPages ||
                loading ||
                filteredCommissions.length === 0
              }
              className="px-3 py-1.5 border border-zinc-200 rounded-md bg-white text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
