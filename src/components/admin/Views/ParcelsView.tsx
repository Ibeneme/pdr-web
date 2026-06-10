import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

export const ParcelsView: React.FC = () => {
  const dispatch = useDispatch<any>();

  // Extract active tracking parcels states directly from your admin data reducer
  const { parcels, loading, pagination, error } = useSelector(
    (state: any) => state.adminData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Log incoming active delivery transit arrays explicitly for inspection
  console.log(parcels, "parcels");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "parcels",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  const collectionPagination = pagination["parcels"] || {
    total: 0,
    page: 1,
    count: 0,
  };
  const totalPages = Math.ceil(collectionPagination.total / itemsPerPage) || 1;

  // Formatting currency helper for Nigerian Naira platform fields
  const formatCurrency = (amount: number) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Human readable calendar timestamp parser
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Active Package Courier Transits
          </h2>
          <p className="text-sm text-zinc-500">
            Monitor real-time system delivery shipments, tracking identifiers,
            assigned drivers, and logistics operations.
          </p>
        </div>
        <div className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-md font-medium">
          Total Shipments: {collectionPagination.total}
        </div>
      </div>

      {/* Errors Alerts */}
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
                <th className="px-6 py-4">Tracking Code & Cargo</th>
                <th className="px-6 py-4">Sender (Client)</th>
                <th className="px-6 py-4">Assigned Operator</th>
                <th className="px-6 py-4">Financial Metrics</th>
                <th className="px-6 py-4">Transit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                      <span>Syncing live logistics tracking indexes...</span>
                    </div>
                  </td>
                </tr>
              ) : parcels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    No active packages found in courier transit right now.
                  </td>
                </tr>
              ) : (
                parcels.map((parcel: any) => (
                  <tr
                    key={parcel._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* Unique Tracking Reference and item specs */}
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-zinc-900 text-xs tracking-wider uppercase bg-zinc-100 px-2 py-1 rounded w-max">
                        {parcel.trackingNumber ||
                          parcel.trackingId ||
                          parcel._id?.substring(0, 8)}
                      </div>
                      <div className="font-medium text-zinc-800 text-sm mt-2 capitalize">
                        {parcel.itemName ||
                          parcel.parcelRequest?.itemName ||
                          "General Goods"}
                      </div>
                      {parcel.parcelRequest?.properties && (
                        <div className="flex gap-1 mt-1">
                          {parcel.parcelRequest.properties.isPerishable && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 rounded">
                              Perishable
                            </span>
                          )}
                          {parcel.parcelRequest.properties.isFragile && (
                            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-1.5 rounded">
                              Fragile
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Sender Profile Block */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">
                        {parcel.sender?.fullName ||
                          parcel.user?.fullName ||
                          parcel.parcelRequest?.user?.fullName ||
                          "Unknown Customer"}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {parcel.sender?.phone ||
                          parcel.user?.phone ||
                          parcel.parcelRequest?.user?.phone ||
                          "No Phone Contact"}
                      </div>
                      <div className="text-[11px] text-zinc-400 block mt-1">
                        From:{" "}
                        <span className="text-zinc-600">
                          {parcel.pickupAddress ||
                            parcel.parcelRequest?.pickupAddress ||
                            "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Appointed Active Logistics Driver */}
                    <td className="px-6 py-4">
                      {parcel.driver || parcel.assignedDriver ? (
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {parcel.driver?.fullName ||
                              parcel.assignedDriver?.user?.fullName ||
                              "Assigned Driver"}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            Reg:{" "}
                            <span className="font-mono bg-zinc-50 px-1 border border-zinc-100 text-zinc-600 rounded">
                              {parcel.driver?.carDetails?.licensePlate || "N/A"}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 block mt-1">
                            To:{" "}
                            <span className="text-zinc-600">
                              {parcel.destinationCity ||
                                parcel.parcelRequest?.destinationCity ||
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 italic bg-zinc-50 px-2 py-1 rounded border border-dashed border-zinc-200">
                          Awaiting Operator Assignment
                        </span>
                      )}
                    </td>

                    {/* Settlement and creation timestamps */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-900 font-bold font-mono">
                        {formatCurrency(
                          parcel.price ||
                            parcel.finalPrice ||
                            parcel.parcelRequest?.priceRange?.min
                        )}
                      </div>
                      <div
                        className="text-[11px] text-zinc-400 mt-1"
                        title="Dispatched Timestamp"
                      >
                        Dispatched:{" "}
                        {formatDate(parcel.createdAt || parcel.dispatchedAt)}
                      </div>
                    </td>

                    {/* Shipping Pipeline Milestones Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          parcel.status === "delivered" ||
                          parcel.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : parcel.status === "in-transit" ||
                              parcel.status === "transit" ||
                              parcel.status === "picked-up"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : parcel.status === "cancelled" ||
                              parcel.status === "failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-blue-700 border-blue-200" // active package initialization states
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            parcel.status === "delivered" ||
                            parcel.status === "completed"
                              ? "bg-emerald-500"
                              : parcel.status === "in-transit" ||
                                parcel.status === "transit" ||
                                parcel.status === "picked-up"
                              ? "bg-amber-500"
                              : parcel.status === "cancelled"
                              ? "bg-rose-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {parcel.status?.replace("-", " ") || "Dispatched"}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Control Footer Component */}
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
