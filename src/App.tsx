import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "./api/store"; // Adjust path to your actual store root layout

// Components
import Navbar from "./components/landing_page/Navbar";
import { Footer } from "./components/landing_page/Footer";
import ScrollToTop from "./ScrollToTop";

// Pages
import Home from "./components/pages/landing+page/Home";
import { TermsAndConditions } from "./components/pages/landing+page/TermsAndConditions";
import { PrivacyPolicy } from "./components/pages/landing+page/PrivacyPolicy";
import { FAQPage } from "./components/pages/landing+page/Faq";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboardRoot } from "./components/admin/AdminDashboardRoot";

// Simple Protected Route Wrapper for Admin Area Security
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* --- STANDALONE ADMIN ROUTING INFRASTRUCTURE --- */}
        {/* Login Page */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Dashboard Area */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboardRoot />
            </ProtectedAdminRoute>
          } 
        />

        {/* --- MAIN PUBLIC LANDING ROUTES (With Navbar and Footer) --- */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;