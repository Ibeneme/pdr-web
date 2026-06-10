import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Car,
  Package,
  TrendingUp,
  DollarSign,
  Layers,
  Handshake,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import type { AppDispatch, RootState } from "../../../api/store";
import { fetchDashboardStats } from "../../../api/slices/adminDataSlice";

export const DashboardOverview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, statsLoading, error } = useSelector(
    (state: RootState) => state.adminData
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (statsLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="animate-spin text-black" size={36} />
        <p className="text-sm font-medium tracking-wide">
          Compiling complex network aggregation matrices...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-rose-600 border border-dashed border-rose-200 rounded-2xl bg-rose-50/30 p-6">
        <AlertCircle size={32} className="mb-2" />
        <h3 className="font-bold text-base text-zinc-900">
          Failed to aggregate stats
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center">
          {error || "System data currently unreachable."}
        </p>
      </div>
    );
  }

  const { systemCounters, financialSummaries, charts } = stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
          System Analytics Overview
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Real-time business intelligence metrics, transactions balances, and
          workflow fulfillment parameters.
        </p>
      </div>

      {/* 2. Top Tier Core Metrics (Financial & Aggregated Balances) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-zinc-950 text-white rounded-2xl p-6 shadow-sm border border-zinc-900 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                Admin Commission Earned{" "}
              </span>
              <h2 className="text-3xl font-mono font-bold tracking-tight">
                {formatCurrency(financialSummaries.adminCommissionEarned)}
              </h2>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs text-zinc-400">
            <TrendingUp size={14} className="text-emerald-400" />
            <span>
              From{" "}
              <span className="text-zinc-200 font-semibold">
                {financialSummaries.totalPaymentsProcessed}
              </span>{" "}
              validated gateway collection captures
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                Driver Balances in Escrow
              </span>
              <h2 className="text-2xl font-mono font-bold text-zinc-900">
                {formatCurrency(financialSummaries.driverWalletBalancesEscrow)}
              </h2>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-600">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Pending Payout Queue:</span>
            <span className="font-mono font-bold text-amber-600">
              {formatCurrency(financialSummaries.pendingPayoutsInQueue)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                Settled Driver Payouts
              </span>
              <h2 className="text-2xl font-mono font-bold text-zinc-900">
                {formatCurrency(financialSummaries.successfulPayoutsSettled)}
              </h2>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-600">
              <ArrowUpRight size={20} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Invoiced Volume Overall:</span>
            <span className="font-mono font-medium text-zinc-800">
              {formatCurrency(financialSummaries.grossVolumeInvoiced)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Operational Performance Counter Grid Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Active Users",
            val: systemCounters.users,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Verified Drivers",
            val: systemCounters.activeDrivers,
            icon: Car,
            color: "text-indigo-600",
          },
          {
            label: "Pending Apps",
            val: systemCounters.pendingDriverApplications,
            icon: Layers,
            color: "text-amber-600",
            alert: systemCounters.pendingDriverApplications > 0,
          },
          {
            label: "Logistics Requests",
            val: systemCounters.parcelRequests,
            icon: Package,
            color: "text-teal-600",
          },
          {
            label: "Active In-Transit",
            val: systemCounters.activeShipmentsInTransit,
            icon: TrendingUp,
            color: "text-purple-600",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200/70 shadow-sm rounded-xl p-4 flex flex-col justify-between relative"
          >
            {c.alert && (
              <span className="absolute top-3 right-3 flex h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-100" />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                {c.label}
              </span>
              <c.icon size={16} className={c.color} />
            </div>
            <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-900 mt-2">
              {c.val}
            </h3>
          </div>
        ))}
      </div>

      {/* 4. Graphical Analytics Engine Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Visualization Box Block */}
        <div className="bg-white border border-zinc-200/80 shadow-sm rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Historical Revenue Trajectory
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Chronological daily liquid intake trends across active timelines.
            </p>
          </div>

          {/* Core CSS Scaled Vector Path Simulation Map */}
          <div className="h-44 w-full flex items-end justify-between pt-4 relative group">
            {charts.historicalThirtyDayRevenue.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 italic">
                Insufficient continuous time-series data to plot vector.
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-zinc-100 w-full h-0" />
                  <div className="border-b border-dashed border-zinc-100 w-full h-0" />
                  <div className="border-b border-dashed border-zinc-100 w-full h-0" />
                </div>

                {charts.historicalThirtyDayRevenue.map((item, idx) => {
                  const maxVal = Math.max(
                    ...charts.historicalThirtyDayRevenue.map((o) => o.revenue),
                    1
                  );
                  const calculatedPct = (item.revenue / maxVal) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 group/bar flex flex-col items-center h-full justify-end px-0.5 relative"
                    >
                      <div
                        style={{ height: `${Math.max(calculatedPct, 6)}%` }}
                        className="w-full bg-zinc-900 group-hover/bar:bg-zinc-700 transition-all rounded-t-[3px] shadow-sm relative"
                      >
                        {/* Interactive Floating Hover Popover Frame */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-950 text-white text-[10px] font-mono rounded-md px-2 py-1 opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          <p className="font-bold">
                            {formatCurrency(item.revenue)}
                          </p>
                          <p className="text-[9px] text-zinc-400">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold uppercase tracking-wider px-1 pt-2 border-t border-zinc-50">
            <span>30 Days Ago</span>
            <span>Current Realtime Interval Metrics</span>
          </div>
        </div>

        {/* Breakdown Share Matrix & Match Performance Box */}
        <div className="bg-white border border-zinc-200/80 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Negotiations Conversion Conversion
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Asks versus service offers matching success rate parameters.
              </p>
            </div>

            {/* Circular Percentage Dial Widget Context */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-zinc-50 ring-4 ring-zinc-100 border border-zinc-200">
                <div className="text-center space-y-0.5">
                  <h4 className="text-xl font-black text-zinc-950 tracking-tight font-mono">
                    {charts.negotiationComparisonMetrics.successRatePercentage}%
                  </h4>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block">
                    Match Rate
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-100">
            <div className="flex justify-between items-center text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Handshake size={14} className="text-zinc-400" />
                <span>Total Channels Handled:</span>
              </div>
              <span className="font-bold text-zinc-900 font-mono">
                {charts.negotiationComparisonMetrics.totalNegotiationsCount}
              </span>
            </div>

            {/* Status Segment Loops map */}
            <div className="flex flex-wrap gap-2 pt-1">
              {charts.negotiationComparisonMetrics.statusBreakdown.map(
                (item, key) => (
                  <span
                    key={key}
                    className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md border border-zinc-200/60 uppercase"
                  >
                    {item._id || "open"}: {item.count}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Lower Section: Parcel Logistics Distribution Breakdown Grid */}
      <div className="bg-white border border-zinc-200/80 shadow-sm rounded-2xl p-6">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">
            Shipment Logistics Funnel Analysis
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Distribution allocation density across variable consignment states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          {charts.parcelDistributionPieChart.length === 0 ? (
            <div className="col-span-4 text-center py-6 text-xs text-zinc-400 italic">
              No active logistics segments found.
            </div>
          ) : (
            charts.parcelDistributionPieChart.map((p, index) => {
              const totalItems = charts.parcelDistributionPieChart.reduce(
                (a, b) => a + b.count,
                0
              );
              const segmentPercentage =
                totalItems > 0
                  ? ((p.count / totalItems) * 100).toFixed(1)
                  : "0";

              return (
                <div
                  key={index}
                  className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 truncate mr-2">
                      {p.status}
                    </span>
                    <span className="text-xs font-mono font-black text-zinc-900 bg-white shadow-sm border px-2 py-0.5 rounded-md">
                      {p.count}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200/70 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${segmentPercentage}%` }}
                      className="bg-zinc-900 h-full rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 block text-right">
                    {segmentPercentage}% of framework weight
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
