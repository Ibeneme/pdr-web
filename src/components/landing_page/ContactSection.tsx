import React from "react";
import { ArrowRight } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header Section: Large, bold, minimal */}
        <div className="mb-24">
          <p className="text-purple-500 font-medium mb-6 tracking-tight">
            CONTACT
          </p>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
            Let's build the <br />
            <span className="text-zinc-500">future together.</span>
          </h2>
        </div>

        {/* Contact Grid: High-contrast, clean lines */}
        {/* <div className="grid md:grid-cols-2 gap-24 border-t border-zinc-800 pt-16">
          <div className="group">
            <div className="flex items-center gap-4 mb-6">
              <Mail className="text-white" size={32} />
              <h3 className="text-2xl font-semibold">General Inquiries</h3>
            </div>
            <a
              href="mailto:hello@padimanroute.com"
              className="text-3xl md:text-4xl font-light hover:text-purple-500 transition-colors underline decoration-zinc-800 underline-offset-8"
            >
              hello@padimanroute.com
            </a>
          </div>

          <div className="group">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-white" size={32} />
              <h3 className="text-2xl font-semibold">Our Location</h3>
            </div>
            <p className="text-3xl md:text-4xl font-light text-zinc-400">
              Port Harcourt, <br />
              Nigeria
            </p>
          </div>
        </div> */}

        {/* CTA: Minimal, button-focused */}
        <div className="mt-24">
          <button className="group flex items-center gap-4 text-xl font-bold bg-white text-black px-10 py-6 hover:bg-purple-600 hover:text-white transition-all duration-300">
            Start a conversation
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
