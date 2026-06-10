import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../../../api/slices/adminDataSlice";

export const RideOffersView: React.FC = () => {
  const dispatch = useDispatch<any>();

  // Extract shared state parameters directly from your admin Redux slice reducer architecture
  const { rideOffers, loading, pagination, error } = useSelector(
    (state: any) => state.adminData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Log incoming active driver marketplace offers matching your query specifications
  console.log(rideOffers, "rideOffers");

  useEffect(() => {
    dispatch(
      fetchAdminData({
        collection: "ride-offers",
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  const collectionPagination = pagination["ride-offers"] || {
    total: 0,
    page: 1,
    count: 0,
  };
  const totalPages = Math.ceil(collectionPagination.total / itemsPerPage) || 1;

  // Currency utility formatter helper for local platform pricing scales
  const formatCurrency = (amount: number) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calendar configuration parsing time helper
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Ride Matching Offers &amp; Seats Availability
          </h2>
          <p className="text-sm text-zinc-500">
            Audit intra-city driver route declarations, seat pricing
            distribution models, and platform load metrics.
          </p>
        </div>
        <div className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-md font-medium">
          Active Routes: {collectionPagination.total}
        </div>
      </div>

      {/* Errors Boundary Indicator Alerts */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Table Interface Layout Component */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                <th className="px-6 py-4">Driver Profile</th>
                <th className="px-6 py-4">Route Matrix</th>
                <th className="px-6 py-4">Departure Windows</th>
                <th className="px-6 py-4">Seat Allocation &amp; Fare</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                      <span>Syncing live transport routing tables...</span>
                    </div>
                  </td>
                </tr>
              ) : rideOffers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-400">
                    No active commuter ride offers found across the grid.
                  </td>
                </tr>
              ) : (
                rideOffers.map((offer: any) => (
                  <tr
                    key={offer._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    {/* Operating Driver Information Section */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {offer.driver?.profileImage ||
                        offer.user?.profileImage ? (
                          <img
                            src={
                              offer.driver?.profileImage ||
                              offer.user?.profileImage
                            }
                            alt="Driver Profile"
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                          />
                        ) : null}
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {offer.driver?.fullName ||
                              offer.user?.fullName ||
                              "Verified Driver"}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {offer.driver?.phone ||
                              offer.user?.phone ||
                              "No Registry Contact"}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {offer.driver?.email || offer.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Geographical Origin Transit Metrics */}
                    <td className="px-6 py-4 text-xs space-y-1 max-w-xs">
                      <div>
                        <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px] block">
                          Pickup Node
                        </span>
                        <span
                          className="text-zinc-800 font-medium text-sm line-clamp-1"
                          title={
                            offer.pickupPoint ||
                            offer.pickupAddress ||
                            offer.origin
                          }
                        >
                          {offer.pickupPoint ||
                            offer.pickupAddress ||
                            offer.origin ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-rose-600 font-semibold uppercase tracking-wider text-[10px] block">
                          Destination Dropoff
                        </span>
                        <span
                          className="text-zinc-800 font-medium text-sm line-clamp-1"
                          title={
                            offer.dropoffPoint ||
                            offer.destinationCity ||
                            offer.destination
                          }
                        >
                          {offer.dropoffPoint ||
                            offer.destinationCity ||
                            offer.destination ||
                            "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Operational Time Windows */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-800 font-semibold text-sm">
                        {offer.departureTime || "Flexible Departure"}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        Posted: {formatDate(offer.createdAt)}
                      </div>
                      {offer.notes && (
                        <p
                          className="text-xs text-zinc-500 italic mt-1.5 bg-zinc-50 p-1.5 rounded border border-zinc-100 max-w-[180px] line-clamp-2"
                          title={offer.notes}
                        >
                          ⚠️ "{offer.notes}"
                        </p>
                      )}
                    </td>

                    {/* Fleet seat inventory processing */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-900 font-bold font-mono text-sm">
                        {formatCurrency(
                          offer.estimatedFare ||
                            offer.pricePerSeat ||
                            offer.price ||
                            offer.fare
                        )}{" "}
                        <span className="text-[10px] font-normal text-zinc-400 font-sans">
                          / seat
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-xs text-zinc-600 font-medium">
                          Seats Open:{" "}
                          {offer.availableSeats ?? offer.remainingSeats ?? "0"}
                        </span>
                      </div>
                      {offer.negotiations && (
                        <div className="text-[11px] text-zinc-500 mt-1">
                          Negotiations:{" "}
                          <span className="font-semibold text-zinc-700">
                            {offer.negotiations.length} total
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Route State Status Telemetry Tracking */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          offer.status === "completed" ||
                          offer.status === "dispatched"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : offer.status === "active" ||
                              offer.status === "open" ||
                              offer.status === "pending"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : offer.status === "full" ||
                              offer.status === "booked"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            offer.status === "completed" ||
                            offer.status === "dispatched"
                              ? "bg-emerald-500"
                              : offer.status === "active" ||
                                offer.status === "open" ||
                                offer.status === "pending"
                              ? "bg-blue-500"
                              : offer.status === "full" ||
                                offer.status === "booked"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="capitalize text-[11px]">
                          {offer.status || "Open"}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer Control Component */}
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
