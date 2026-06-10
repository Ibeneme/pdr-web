import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileText,
  Package,
  CreditCard,
  Car,
  Handshake,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Banknote,
  AlertTriangle,
  Percent, // --- IMPORTED PERCENT ICON FOR PLATFORM REVENUE ---
} from "lucide-react";
import type { AppDispatch } from "../../../api/store";
import { logout } from "../../../api/slices/auth";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: string) => void;
}

export const AdminLayout = ({
  children,
  currentView,
  setView,
}: LayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: ShieldCheck },
    { id: "users", label: "Users List", icon: Users },
    { id: "driver-applications", label: "Driver Requests", icon: Car },
    { id: "parcel-requests", label: "Send a Parcel Requests", icon: FileText },
    { id: "parcels", label: "Deliver a Parcel Requests", icon: Package },
    { id: "ride-offers", label: "Active Ride Offers", icon: Car },
    { id: "negotiations", label: "Negotiations", icon: Handshake },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "withdrawals", label: "Withdrawals Queue", icon: Banknote },
    { id: "commissions", label: "Platform Commissions", icon: Percent }, // --- ADDED LEDGER MENU ITEM ---
  ];

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false);
    dispatch(logout());
  };

  const handleNavClick = (id: string) => {
    setView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col md:flex-row text-black relative">
      {/* --- MOBILE HEADER TOP BAR --- */}
      <header className="md:hidden flex items-center justify-between bg-black text-white px-6 py-4 border-b border-zinc-800 z-50 sticky top-0">
        <h2 className="text-xl font-bold tracking-tighter">PadimanRoute</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 hover:bg-zinc-900 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 bg-black text-white h-screen sticky top-0 p-6 justify-between border-r border-zinc-800 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold text-sm">
              PR
            </div>
            <h2 className="text-xl font-bold tracking-tighter">PadimanRoute</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-black"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-1.5 h-1.5 bg-black rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-900/50 transition-colors mt-auto"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-black text-white p-6 flex flex-col justify-between z-40 md:hidden pt-24"
            >
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-white text-black font-bold"
                          : "text-zinc-400"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 mt-auto border-t border-zinc-800 pt-4"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- CONTENT WORKSPACE AREA --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl w-full mx-auto">
        <header className="mb-8 hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter capitalize">
                {currentView.replace("-", " ")}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Internal Ops System Platform Control parameters.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full text-xs font-semibold tracking-wide uppercase border border-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Root Node Active
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 min-h-[calc(100vh-12rem)] shadow-sm">
          {children}
        </div>
      </main>

      {/* --- CONFIRM SIGNOUT INTERACTIVE MODAL COMPONENT --- */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 text-left relative z-10 space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                    Confirm Secure Sign Out
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Are you sure you want to drop your active root node system
                    context credentials? You will have to authenticate again to
                    view secure analytics pipelines.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm rounded-xl transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Terminate Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
