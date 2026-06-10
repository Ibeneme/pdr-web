import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

export const ParcelRequestsView: React.FC = () => {
  const dispatch = useDispatch<any>();

  // Extract parcel requests state parameters dynamically from your admin Redux slice reducer pipeline
  const { parcelRequests, loading, pagination, error } = useSelector(
    (state: any) => state.adminData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Log incoming real-time marketplace array log traces explicitly
  console.log(parcelRequests, "parcelRequests");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "parcel-requests",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  const collectionPagination = pagination["parcel-requests"] || {
    total: 0,
    page: 1,
    count: 0,
  };
  const totalPages = Math.ceil(collectionPagination.total / itemsPerPage) || 1;

  // Currency formatting layout helper for Nigerian Naira platform items
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section Layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Parcel Marketplace Postings
          </h2>
          <p className="text-sm text-zinc-500">
            Audit ongoing delivery requests, cargo descriptions, and client
            platform escrow listings.
          </p>
        </div>
        <div className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-md font-medium">
          Total Shipments: {collectionPagination.total}
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
                <th className="px-6 py-4">Sender Profile</th>
                <th className="px-6 py-4">Route Info</th>
                <th className="px-6 py-4">Item Handling Matrix</th>
                <th className="px-6 py-4">Target Price Range</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                      <span>Querying PadimanRoute logistics stream...</span>
                    </div>
                  </td>
                </tr>
              ) : parcelRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    No active parcel market requests found.
                  </td>
                </tr>
              ) : (
                parcelRequests.map((request: any) => (
                  <tr
                    key={request._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* User Sender Information */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {request.user?.profileImage && (
                          <img
                            src={request.user.profileImage}
                            alt="Sender Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {request.user?.fullName || "Unknown Client"}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {request.user?.email || "N/A"}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {request.user?.phone || "No Contact"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Route Transit Information */}
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div>
                        <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px] block">
                          Pickup From
                        </span>
                        <span className="text-zinc-800 font-medium text-sm">
                          {request.pickupAddress || "N/A"}
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-rose-600 font-semibold uppercase tracking-wider text-[10px] block">
                          Destination
                        </span>
                        <span className="text-zinc-800 font-medium text-sm">
                          {request.destinationCity || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Handling Properties Evaluation */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {request.properties?.isPerishable && (
                          <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            🍅 Perishable Cargo
                          </span>
                        )}
                        {request.properties?.isFragile && (
                          <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
                            📦 Fragile Parcel
                          </span>
                        )}
                        {!request.properties?.isPerishable &&
                          !request.properties?.isFragile && (
                            <span className="text-zinc-500 text-xs italic">
                              Standard Handling
                            </span>
                          )}
                        {request.availabilityWindow && (
                          <span className="text-[11px] text-zinc-400 block mt-1">
                            Window: {request.availabilityWindow.from} -{" "}
                            {request.availabilityWindow.to}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Pricing Range Configuration */}
                    <td className="px-6 py-4">
                      {request.priceRange ? (
                        <div className="text-zinc-900 font-bold font-mono text-sm">
                          {formatCurrency(request.priceRange.min)} -{" "}
                          {formatCurrency(request.priceRange.max)}
                        </div>
                      ) : (
                        <div className="text-zinc-500 font-mono text-xs">
                          Unspecified
                        </div>
                      )}
                      <div className="text-[11px] text-zinc-400 mt-1">
                        Posted: {formatDate(request.createdAt)}
                      </div>
                    </td>

                    {/* Status Tracking Badges */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          request.status === "completed" ||
                          request.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : request.status === "pending" ||
                              request.status === "negotiating"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : request.status === "cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            request.status === "completed" ||
                            request.status === "delivered"
                              ? "bg-emerald-500"
                              : request.status === "pending" ||
                                request.status === "negotiating"
                              ? "bg-blue-500"
                              : request.status === "cancelled"
                              ? "bg-rose-500"
                              : "bg-zinc-400"
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {request.status || "Active"}
                        </span>
                      </span>
                      {request.negotiations &&
                        request.negotiations.length > 0 && (
                          <span className="block text-[11px] text-zinc-400 mt-1">
                            Offers Count: {request.negotiations.length}
                          </span>
                        )}
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
