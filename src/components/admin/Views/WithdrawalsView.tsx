import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  Banknote,
  CheckCircle,
  XCircle,
  FileText,
  User,
  AlertTriangle,
} from "lucide-react";
import type { AppDispatch, RootState } from "../../../api/store";
import {
  fetchAdminData,
  updateWithdrawalStatus,
} from "../../../api/slices/adminDataSlice";

export const WithdrawalsView = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Connect cleanly into your existing Redux slice state schemas
  const { withdrawals, loading, pagination } = useSelector(
    (state: RootState) => state.adminData
  );

  // Pagination, Action states, Search & Date Filter hooks
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const limit = 10;

  // Custom Modal State Management Matrix
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    id: string;
    status: "success" | "failed";
    title: string;
    description: string;
  } | null>(null);

  // Status message notice alert overlay state
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    dispatch(
      fetchAdminData({ collection: "withdrawals", page: currentPage, limit })
    );
  }, [dispatch, currentPage]);

  // Extract years from collection timeline parameters dynamically to build picker lists without maintenance issues
  const availableYears = useMemo(() => {
    if (!withdrawals || !Array.isArray(withdrawals)) return [];
    const yearsSet = new Set<string>();
    withdrawals.forEach((item: any) => {
      if (item.createdAt) {
        const year = new Date(item.createdAt).getFullYear().toString();
        if (year && year !== "NaN") yearsSet.add(year);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [withdrawals]);

  // Client-side filtration stream processor checking matching strings and timeline options
  const filteredWithdrawals = (withdrawals || []).filter((item) => {
    // 1. Text Search matching parameters
    if (searchTerm.trim() !== "") {
      const textQuery = searchTerm.toLowerCase().trim();
      const matchName = item.user?.fullName?.toLowerCase().includes(textQuery);
      const matchRef = item.reference?.toLowerCase().includes(textQuery);
      const matchBankName = item.bankDetails?.bankName
        ?.toLowerCase()
        .includes(textQuery);
      const matchAccNum = item.bankDetails?.accountNumber?.includes(textQuery);

      if (!matchName && !matchRef && !matchBankName && !matchAccNum) {
        return false;
      }
    }

    // 2. Calendar Timeline matching parameters
    if (item.createdAt) {
      const recordDate = new Date(item.createdAt);

      if (selectedMonth !== "all") {
        const recordMonth = recordDate.getMonth().toString();
        if (recordMonth !== selectedMonth) return false;
      }

      if (selectedYear !== "all") {
        const recordYear = recordDate.getFullYear().toString();
        if (recordYear !== selectedYear) return false;
      }
    } else if (selectedMonth !== "all" || selectedYear !== "all") {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil((pagination["withdrawals"]?.total || 0) / limit);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Triggers custom UI confirmation state modal rather than invoking window context threats
  const initiateStatusChange = (id: string, status: "success" | "failed") => {
    setModalConfig({
      id,
      status,
      title:
        status === "success"
          ? "Approve Payout Request"
          : "Reject & Refund Request",
      description:
        status === "success"
          ? "Are you absolute certain you wish to mark this bank settlement item as completed and send payout out to driver router parameters?"
          : "Are you sure you want to flag down this request? Rejecting this withdrawal automatically reverses ledger balance values straight back onto driver's user account balance wallet frame instantly.",
    });
    setModalOpen(true);
  };

  // Confirmed pipeline execution payload dispatch wrapper
  const handleConfirmedUpdateStatus = async () => {
    if (!modalConfig) return;
    const { id, status } = modalConfig;

    setModalOpen(false); // Shut down modal dialog context box instantly
    setActionLoadingId(id);

    try {
      const resultAction = await dispatch(
        updateWithdrawalStatus({ id, status })
      );

      if (updateWithdrawalStatus.fulfilled.match(resultAction)) {
        showToast("success", `Withdrawal successfully updated to ${status}.`);
        dispatch(
          fetchAdminData({
            collection: "withdrawals",
            page: currentPage,
            limit,
          })
        );
      } else {
        const errorMessage = resultAction.payload as string;
        showToast(
          "error",
          errorMessage || "Failed to process state update workflow."
        );
      }
    } catch (err: any) {
      showToast("error", "An unexpected network exception occurred.");
    } finally {
      setActionLoadingId(null);
      setModalConfig(null);
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 relative">
      {/* Dynamic Inline Status Toast Feedback Notice Bar */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold shadow-lg transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Operations Panel containing Text Input, Month Selector, and Year Selector */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center border-b border-zinc-100 pb-5">
        <div className="flex flex-col md:flex-row flex-1 gap-3 items-stretch">
          {/* Text Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, reference code, or bank details..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          {/* Month Select Picker Dropdown */}
          <div className="w-full md:w-44">
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

          {/* Year Select Picker Dropdown */}
          <div className="w-full md:w-36">
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

        <div className="flex items-center gap-2 self-end xl:self-auto">
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
            Fetching active disbursement pipelines...
          </p>
        </div>
      ) : filteredWithdrawals.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-200 rounded-xl">
          <p className="text-base font-semibold text-black mb-1">
            No withdrawal applications found
          </p>
          <p className="text-sm text-zinc-400">
            Try adjusting your query metrics or verify balance ledgers.
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
                      Bank Destination Route
                    </th>
                    <th scope="col" className="pb-4 font-semibold">
                      Reference &amp; Tracking
                    </th>
                    <th scope="col" className="pb-4 font-semibold">
                      Payout Value
                    </th>
                    <th scope="col" className="pb-4 font-semibold text-right">
                      Status &amp; Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 whitespace-nowrap">
                  {filteredWithdrawals.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-zinc-50/70 transition-colors group"
                    >
                      {/* Column 1: Driver Profile Card */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-900 text-white font-bold rounded-full flex items-center justify-center uppercase text-sm ring-2 ring-zinc-100 overflow-hidden shrink-0">
                            {item.user?.profileImage ? (
                              <img
                                src={item.user.profileImage}
                                alt={item.user?.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900">
                              {item.user?.fullName || "Deleted / Unknown User"}
                            </div>
                            <div className="text-xs text-zinc-400 font-medium mt-0.5">
                              {item.user?.phone || "No contact line"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Settlement Bank Parameters */}
                      <td className="py-4 px-4">
                        {item.bankDetails ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-zinc-900 font-mono text-xs font-bold tracking-wide">
                              <Banknote
                                size={12}
                                className="text-zinc-400 shrink-0"
                              />
                              {item.bankDetails.accountNumber}
                            </div>
                            <div className="text-xs text-zinc-600 font-semibold uppercase tracking-wider pl-4">
                              {item.bankDetails.bankName}
                            </div>
                            <div className="text-[11px] text-zinc-400 italic pl-4">
                              Name: {item.bankDetails.accountName || "N/A"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-xs">
                            No target routing params
                          </span>
                        )}
                      </td>

                      {/* Column 3: Reference & Internal Logging Timeline */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-600 font-mono text-xs font-medium">
                            <FileText size={12} className="text-zinc-400" />
                            {item.reference ||
                              `ID: ...${item._id?.substring(
                                item._id.length - 8
                              )}`}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 4: Value Scales */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-zinc-950 text-sm">
                          {formatCurrency(item.amount)}
                        </span>
                      </td>

                      {/* Column 5: Operational Badge Matrix & Interactive Actions */}
                      <td className="py-4 pl-4 text-right">
                        {item.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={actionLoadingId !== null}
                              onClick={() =>
                                initiateStatusChange(item._id, "success")
                              }
                              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md shadow-sm transition-all disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              disabled={actionLoadingId !== null}
                              onClick={() =>
                                initiateStatusChange(item._id, "failed")
                              }
                              className="text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-all disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border uppercase ${
                                item.status === "success"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {item.status === "success" ? (
                                <CheckCircle
                                  size={12}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <XCircle size={12} className="text-rose-600" />
                              )}
                              {item.status}
                            </span>
                          </div>
                        )}
                      </td>
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
                {filteredWithdrawals.length}
              </span>{" "}
              entries this page out of{" "}
              <span className="text-black font-semibold">
                {pagination["withdrawals"]?.total || 0}
              </span>{" "}
              payout requests.
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

      {/* Custom Tailwinds Dynamic State Confirmation Modal Backdrop */}
      {modalOpen && modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl border border-zinc-100 shadow-xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  modalConfig.status === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  {modalConfig.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  {modalConfig.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setModalConfig(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedUpdateStatus}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all ${
                  modalConfig.status === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
