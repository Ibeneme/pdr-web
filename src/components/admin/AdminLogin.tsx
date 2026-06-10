import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // 1. Added hook import
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { sendOtp, verifyOtp } from "../../api/slices/auth";
import { type AppDispatch, type RootState } from "../../api/store";

export const AdminLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // 2. Initialized navigate token
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(sendOtp(email));
    if (sendOtp.fulfilled.match(result)) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({ email, otp }));

    // 3. Match action payload to redirect if verify token succeeds
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/admin/dashboard", { replace: true });
    }
  };

  const handleResend = () => {
    dispatch(sendOtp(email));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Brand Side */}
      <div className="hidden md:flex flex-1 bg-black text-white p-16 flex-col justify-between">
        <h2 className="text-3xl font-bold tracking-tighter">PadimanRoute</h2>
        <div>
          <h1 className="text-5xl font-bold tracking-tighter mb-6">
            Admin <br />
            Portal
          </h1>
          <p className="text-zinc-400 max-w-sm">
            Secure, encrypted access for internal logistics operations.
          </p>
        </div>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} Padiman Route Inc.
        </p>
      </div>

      {/* Login Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8 w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <Mail className="text-black" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Access Portal</h2>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <input
                    required
                    type="email"
                    placeholder="admin@padimanroute.com"
                    className="w-full p-4 bg-zinc-100 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    disabled={loading}
                    className="w-full bg-black text-white py-4 font-bold rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        Send Code <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8 w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                  <Lock className="text-black" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verification</h2>
                <p className="text-zinc-500 mb-8 text-sm">
                  Code sent to <strong>{email}</strong>.
                </p>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input
                    required
                    type="text"
                    maxLength={6}
                    placeholder="000 000"
                    className="w-full p-4 bg-zinc-100 rounded-lg text-center text-xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-black"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    disabled={loading}
                    className="w-full bg-black text-white py-4 font-bold rounded-lg hover:bg-zinc-800"
                  >
                    {loading ? "Verifying..." : "Verify & Access"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-black font-medium text-sm"
                  >
                    <RefreshCw size={14} /> Resend code
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
