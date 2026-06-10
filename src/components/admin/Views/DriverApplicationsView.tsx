import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminData,
  updateDriverStatus,
} from "../../../api/slices/adminDataSlice";

export const DriversView: React.FC = () => {
  const dispatch = useDispatch<any>();

  const { driverApplications, loading, actionLoading, pagination, error } =
    useSelector((state: any) => state.adminData);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.warn(driverApplications, "driverApplications");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "driver-applications",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected" | "suspended"
  ) => {
    let rejectionReason = undefined;
    if (status === "rejected" || status === "suspended") {
      rejectionReason =
        prompt(`Enter reason for placing driver on "${status}" status:`) || "";
      if (!rejectionReason.trim()) return; // Cancel action if no reason given
    }

    dispatch(updateDriverStatus({ id, status, rejectionReason }));
  };

  const collectionPagination = pagination["driver-applications"] || {
    total: 0,
    page: 1,
    count: 0,
  };
  const totalPages = Math.ceil(collectionPagination.total / itemsPerPage) || 1;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Drivers Verification Registry
          </h2>
          <p className="text-sm text-zinc-500">
            Monitor active system operators, vehicle legal compliance, and
            account statuses.
          </p>
        </div>
        <div className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-md font-medium">
          Total Records: {collectionPagination.total}
        </div>
      </div>

      {/* Errors Alerts */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Table Interface */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                <th className="px-6 py-4">Driver Details</th>
                <th className="px-6 py-4">Vehicle Identity</th>
                <th className="px-6 py-4">License / Documents</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                      <span>Querying PadimanRoute secure ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : driverApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    No registered platform drivers found.
                  </td>
                </tr>
              ) : (
                driverApplications.map((driver: any) => (
                  <tr
                    key={driver._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {driver.user?.profileImage && (
                          <img
                            src={driver.user.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {driver.user?.fullName || "Unknown Operator"}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {driver.user?.email || "N/A"}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {driver.user?.phone || "No Contact"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle Details */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-800 font-medium">
                        {driver.carDetails?.model
                          ? `${driver.carDetails.model} (${
                              driver.carDetails.year || "N/A"
                            })`
                          : "N/A"}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Plate:{" "}
                        <span className="font-mono bg-zinc-100 px-1 rounded text-zinc-700">
                          {driver.carDetails?.licensePlate || "N/A"}
                        </span>
                      </div>
                      {/* Sub-rendered Images Array Processing */}
                      {driver.carImages && driver.carImages.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {driver.carImages.map((img: any) => (
                            <a
                              key={img._id}
                              href={img.url}
                              target="_blank"
                              rel="noreferrer"
                              title={img.description}
                            >
                              <img
                                src={img.url}
                                alt="Car"
                                className="w-8 h-8 rounded bg-zinc-100 object-cover border border-zinc-200 hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Documentation Tracking */}
                    <td className="px-6 py-4 text-xs space-y-1.5">
                      <div>
                        <span className="text-zinc-400">License No:</span>{" "}
                        <span className="font-mono text-zinc-700 block sm:inline font-semibold">
                          {driver.driversLicense?.licenseNumber || "Missing"}
                        </span>
                      </div>
                      {driver.driversLicense?.image && (
                        <a
                          href={driver.driversLicense.image}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                        >
                          View License Image &rarr;
                        </a>
                      )}
                    </td>

                    {/* Dynamic Badges */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          driver.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : driver.status === "suspended"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : driver.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-blue-700 border-blue-200" // Submitted / Pending color styles
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            driver.status === "approved"
                              ? "bg-emerald-500"
                              : driver.status === "suspended"
                              ? "bg-amber-500"
                              : driver.status === "rejected"
                              ? "bg-rose-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="capitalize">
                          {driver.status || "Pending Review"}
                        </span>
                      </span>
                      {driver.rejectionReason && (
                        <p
                          className="text-xs text-rose-600 mt-1 max-w-[180px] truncate"
                          title={driver.rejectionReason}
                        >
                          Reason: {driver.rejectionReason}
                        </p>
                      )}
                    </td>

                    {/* Row Administrative Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex justify-end gap-2"
                        data-disabled={actionLoading}
                      >
                        {driver.status !== "approved" && (
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleStatusChange(driver._id, "approved")
                            }
                            className="px-2.5 py-1.5 bg-zinc-950 text-white rounded-md text-xs font-medium hover:bg-zinc-800 transition shadow-sm disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {driver.status !== "suspended" &&
                          driver.status === "approved" && (
                            <button
                              disabled={actionLoading}
                              onClick={() =>
                                handleStatusChange(driver._id, "suspended")
                              }
                              className="px-2.5 py-1.5 bg-white text-amber-700 border border-amber-200 rounded-md text-xs font-medium hover:bg-amber-50 transition disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          )}
                        {driver.status !== "rejected" &&
                          driver.status !== "approved" && (
                            <button
                              disabled={actionLoading}
                              onClick={() =>
                                handleStatusChange(driver._id, "rejected")
                              }
                              className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 rounded-md text-xs font-medium hover:bg-rose-50 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Showing Page{" "}
            <span className="font-semibold text-zinc-800">
              {collectionPagination.page}
            </span>{" "}
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
              disabled={currentPage === totalPages || loading}
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
