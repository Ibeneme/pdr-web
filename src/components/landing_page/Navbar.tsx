import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-black">
          PadimanRoute
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/faq"
            className="text-sm font-medium text-black hover:text-purple-600 transition-colors uppercase tracking-widest"
          >
            FAQ
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium text-black hover:text-purple-600 transition-colors uppercase tracking-widest"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-sm font-medium text-black hover:text-purple-600 transition-colors uppercase tracking-widest"
          >
            Terms
          </Link>
          <button className="bg-black text-white px-6 py-2.5 text-sm font-bold hover:bg-zinc-800 transition-colors">
            Get Started
          </button>
        </div>

        <button
          className="md:hidden p-2 text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-black/10 absolute w-full"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <Link
                to="/faq"
                className="text-black font-bold text-lg uppercase"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/privacy"
                className="text-black font-bold text-lg uppercase"
                onClick={() => setIsOpen(false)}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-black font-bold text-lg uppercase"
                onClick={() => setIsOpen(false)}
              >
                Terms
              </Link>
              <button className="w-full bg-black text-white py-4 font-bold">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
