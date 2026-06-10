import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

// Explicit status category unions for filtering alignment
type FilterStatus = "all" | "success" | "pending" | "failed";

export const PaymentsView: React.FC = () => {
  const dispatch = useDispatch<any>();

  // Extract payment states dynamically from your admin data slice reducer pipeline
  const { payments, loading, error } = useSelector(
    (state: any) => state.adminData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Year and Month Calendar Date Filter Hooks
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const itemsPerPage = 10;

  // Log incoming real-time payment log arrays explicitly for debugging audits
  console.log(payments, "payments");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "payments",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  // Dynamically compile only available years present across payment records to build clean select dropdown sets
  const availableYears = useMemo(() => {
    if (!payments || !Array.isArray(payments)) return [];
    const yearsSet = new Set<string>();

    payments.forEach((payment: any) => {
      if (payment.createdAt) {
        const year = new Date(payment.createdAt).getFullYear().toString();
        if (year && year !== "NaN") {
          yearsSet.add(year);
        }
      }
    });

    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [payments]);

  // Client-side filtration stream processor mapping various payload status variants, dates and search queries
  const filteredPayments = (payments || []).filter((payment: any) => {
    // 1. Evaluate Status Filters
    if (activeFilter !== "all") {
      const statusNormalized = (payment.status || "").toLowerCase();

      if (activeFilter === "success") {
        if (!["success", "successful", "completed"].includes(statusNormalized))
          return false;
      } else if (activeFilter === "pending") {
        if (!["pending", "processing"].includes(statusNormalized)) return false;
      } else if (activeFilter === "failed") {
        if (
          !["failed", "cancelled", "reversed", "abandoned"].includes(
            statusNormalized
          )
        )
          return false;
      }
    }

    // 2. Evaluate Text Search Filter (Matches reference, service type, or negotiation ID)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const matchReference = (payment.reference || "")
        .toLowerCase()
        .includes(query);
      const matchService = (payment.serviceType || "")
        .toLowerCase()
        .includes(query);
      const matchNegotiationId = payment.negotiationId?._id
        ? payment.negotiationId._id.toLowerCase().includes(query)
        : false;

      if (!matchReference && !matchService && !matchNegotiationId) {
        return false;
      }
    }

    // 3. Evaluate Month & Year Time-Frame Filters
    if (payment.createdAt) {
      const paymentDate = new Date(payment.createdAt);

      if (selectedMonth !== "all") {
        const recordMonth = paymentDate.getMonth().toString(); // 0-indexed (0 = Jan)
        if (recordMonth !== selectedMonth) return false;
      }

      if (selectedYear !== "all") {
        const recordYear = paymentDate.getFullYear().toString();
        if (recordYear !== selectedYear) return false;
      }
    } else if (selectedMonth !== "all" || selectedYear !== "all") {
      // If a record doesn't have a date timestamp but timestamp filtering is active, skip it
      return false;
    }

    return true;
  });

  // Calculate total pages dynamically using the filtered array's length
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;

  // Safely handle filter changes and reset pagination indices to prevent empty index states
  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Safely handle search typing and reset pagination indices
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
      <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Financial Transactions &amp; Escrow Ledger
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Audit system financial transactions, payment references, service
            categories, and live gateway responses.
          </p>
        </div>
        
      <div className="flex flex-col gap-4 pb-5 border-b border-zinc-100 lg:flex-row lg:justify-between lg:items-end">
    

        {/* Search Input, Date Pickers, and Dynamic Status Toggle Filters Switch Component */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full lg:w-auto">
          {/* Dynamic Inputs Matrix Container */}
          <div className="flex flex-col sm:flex-row flex-1 items-stretch gap-2.5">
            {/* Search Input Field */}
            <div className="relative flex-1 sm:w-64">
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
                placeholder="Search ref, service, or negotiation..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 placeholder-zinc-400 text-zinc-900 transition-all shadow-sm"
              />
            </div>

            {/* Month Filter Selector Dropdown */}
            <div className="w-full sm:w-36">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 text-zinc-700 transition-all cursor-pointer shadow-sm"
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

            {/* Year Filter Selector Dropdown */}
            <div className="w-full sm:w-28">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 text-zinc-700 transition-all cursor-pointer shadow-sm"
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

          {/* Filters Toggle Group */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start xl:self-auto">
            {(["all", "success", "pending", "failed"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${
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
                <th className="px-6 py-4">Transaction Ref</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Negotiation Link</th>
                <th className="px-6 py-4">Amount Charged</th>
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
                        Syncing live transport financial ledger streams...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-zinc-400 italic"
                  >
                    No {activeFilter !== "all" ? activeFilter : ""} payment
                    history logs found matching this filtering criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: any) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* Unique Tracking Reference Codes */}
                    <td className="px-6 py-4">
                      <div
                        className="font-mono font-bold text-zinc-900 text-xs tracking-wider uppercase bg-zinc-100 px-2 py-1 rounded w-max"
                        title={payment._id}
                      >
                        {payment.reference || "N/A"}
                      </div>
                      {payment.paystackRawResponse && (
                        <div className="text-[11px] text-zinc-400 mt-2 flex flex-col gap-0.5">
                          <div>
                            ID: {payment.paystackRawResponse.id || "N/A"}
                          </div>
                          <div>
                            Mode:{" "}
                            <span className="uppercase text-zinc-600 font-medium">
                              {payment.paystackRawResponse.domain || "test"}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Service Category Map */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 capitalize">
                        {(payment.serviceType || "General Service").replace(
                          /_/g,
                          " "
                        )}
                      </span>
                      <div className="text-[11px] text-zinc-400 mt-1.5">
                        Processed: {formatDate(payment.createdAt)}
                      </div>
                    </td>

                    {/* Contextual Link or Customer Info */}
                    <td className="px-6 py-4 text-xs">
                      {payment.negotiationId ? (
                        <div className="space-y-1">
                          <div>
                            <span className="text-zinc-400">
                              Negotiation ID:
                            </span>{" "}
                            <span className="font-mono text-zinc-700 bg-zinc-50 px-1 border border-zinc-200 rounded">
                              {payment.negotiationId._id}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400">
                              Status Context:
                            </span>{" "}
                            <span className="capitalize font-medium text-zinc-600">
                              {payment.negotiationId.status || "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">
                          No linked negotiation metadata
                        </span>
                      )}
                    </td>

                    {/* Value Metrics */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-900 font-bold font-mono text-base">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>

                    {/* Settlement Lifecycle Status Badges */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          payment.status === "success" ||
                          payment.status === "successful" ||
                          payment.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : payment.status === "pending" ||
                              payment.status === "processing"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            payment.status === "success" ||
                            payment.status === "successful" ||
                            payment.status === "completed"
                              ? "bg-emerald-500"
                              : payment.status === "pending" ||
                                payment.status === "processing"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {payment.status || "Unknown State"}
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
                filteredPayments.length === 0
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
