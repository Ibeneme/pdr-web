
import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, Clock } from "lucide-react";

export const TrustSection = () => {
  const pillars = [
    {
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      title: "Verified Community",
      desc: "Every driver and passenger is vetted for safety and security.",
    },
    {
      icon: <Target size={24} strokeWidth={1.5} />,
      title: "Precision Matching",
      desc: "Our AI optimizes routes to ensure the fastest, most efficient travel.",
    },
    {
      icon: <Users size={24} strokeWidth={1.5} />,
      title: "Community First",
      desc: "Building a network that benefits the traveler, not just the platform.",
    },
    {
      icon: <Clock size={24} strokeWidth={1.5} />,
      title: "Always Available",
      desc: "Logistics that move at the speed of your life, 24/7.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-20">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black mb-6">
            Why Padiman
          </h2>
          <p className="text-5xl md:text-6xl font-bold text-black tracking-tighter max-w-2xl">
            Travel built on trust and efficiency.
          </p>
        </div>

        {/* Pillars Grid: Removed cards/borders for a cleaner, editorial look */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {pillars.map((pillar, i) => (
            <motion.div key={i} className="flex flex-col items-start">
              <div className="text-black mb-8 p-3 bg-zinc-100 rounded-full">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-4 tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
