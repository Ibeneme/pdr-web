import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  CreditCard,
  Sparkles,
} from "lucide-react";

export const ImpactSection = () => {
  return (
    <section className="py-24 bg-black text-white selection:bg-purple-600">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-10"
          >
            Redefining <br />
            <span className="text-purple-500">How we move.</span>
          </motion.h2>

          <p className="text-xl text-zinc-400 max-w-md leading-relaxed mb-12 font-light">
            We turn empty space into opportunity. Padiman Route is the
            hyper-efficient network for modern transit, connecting you to what
            matters most.
          </p>

          <div className="flex gap-6 items-center">
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-full text-lg font-semibold transition-transform hover:scale-105 active:scale-95">
              Join the network
            </button>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center font-bold text-xs"
                >
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              Join 10k+ <br /> active users
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <div className="border-l border-zinc-800 pl-10">
            <div className="text-[120px] font-bold leading-none tracking-tighter">
              10k+
            </div>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm font-bold mt-4">
              Active Community Members
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-zinc-900">
            {[
              { icon: <ShieldCheck />, label: "Verified Safety" },
              { icon: <Globe />, label: "Global Coverage" },
              { icon: <Zap />, label: "Instant Matching" },
              { icon: <CreditCard />, label: "Secure Payments" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-400">
                <span className="text-purple-500">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Post your trip",
      desc: "Share your route details and available cargo/passenger space effortlessly.",
      tag: "For Drivers",
    },
    {
      num: "02",
      title: "Smart Matching",
      desc: "Our AI algorithm instantly pairs you with the perfect rider or parcel delivery request.",
      tag: "For Everyone",
    },
    {
      num: "03",
      title: "Earn & Track",
      desc: "Get paid automatically upon delivery while tracking your journey in real-time.",
      tag: "Fintech Ready",
    },
  ];

  return (
    <section className="py-24 bg-black text-white border-t border-zinc-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-purple-500">
            The Workflow
          </h2>
          <p className="text-zinc-500 max-w-sm text-right font-light">
            Built for efficiency. Designed for the modern commuter. Experience
            seamless travel management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border border-zinc-900 hover:border-purple-500/50 bg-zinc-950 transition-all"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="text-5xl font-black text-zinc-800 group-hover:text-purple-500 transition-colors">
                  {step.num}
                </div>
                <span className="text-[10px] uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full text-zinc-400">
                  {step.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed mb-8">{step.desc}</p>
              <div className="flex items-center gap-2 text-purple-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <Sparkles size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
