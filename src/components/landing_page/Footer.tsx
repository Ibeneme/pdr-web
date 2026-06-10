import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            Padiman<span className="text-purple-500">Route</span>
          </Link>

          <nav className="flex flex-wrap gap-8">
            <Link
              to="/faq"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/privacy"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-6 text-zinc-600 text-xs">
          <p>© {new Date().getFullYear()} Padiman Route Technologies.</p>
        </div>
      </div>
    </footer>
  );
};
