import { useState } from "react";
import { UsersView } from "./Views/UsersView";
import { AdminLayout } from "./Layout/AdminLayout";
import { DriversView } from "./Views/DriverApplicationsView";
import { ParcelRequestsView } from "./Views/ParcelRequestsView";
import { ParcelsView } from "./Views/ParcelsView";
import { RideOffersView } from "./Views/RideOffersView";
import { PaymentsView } from "./Views/PaymentsView";
import { WithdrawalsView } from "./Views/WithdrawalsView";
import { DashboardOverview } from "./Views/DashboardOverview";
import { CommissionsView } from "./Views/CommissionsView";

export const AdminDashboardRoot = () => {
  const [currentView, setView] = useState("overview");
  const renderViewContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <>
            <DashboardOverview />
          </>
        );

      case "users":
        return <UsersView />;

      case "driver-applications":
        return <DriversView />;

      case "parcel-requests":
        return <ParcelRequestsView />;

      case "parcels":
        return <ParcelsView />;

      case "ride-offers":
        return <RideOffersView />;

      case "negotiations":
        return (
          <div className="text-sm text-zinc-500">
            System price counters and escrow agreements view.
          </div>
        );

      case "payments":
        return <PaymentsView />;
      case "commissions":
        return <CommissionsView />;
      case "withdrawals":
        return <WithdrawalsView />;

      default:
        return (
          <div className="text-sm text-zinc-400 capitalize">
            {currentView.replace("-", " ")} module is connected successfully.
          </div>
        );
    }
  };

  return (
    <AdminLayout currentView={currentView} setView={setView}>
      {renderViewContent()}
    </AdminLayout>
  );
};
