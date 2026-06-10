import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Package, Car, Zap } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const Hero = () => {
  return (
    <section className="bg-white min-h-screen pt-[120px] flex flex-col justify-center items-center py-12 px-6 lg:px-12">
      {/* Main Hero Container */}
      <div className="max-w-[1400px] w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-8 text-left">


          <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold text-slate-950 leading-[0.9] tracking-tighter">
            Travel <br />
            <span className="text-purple-600">Smarter.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-lg font-light leading-relaxed">
            Padiman Route bridges the gap between travelers and cost-effective
            logistics. Move smarter, earn faster, and join the network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-slate-950 text-white px-10 py-5 rounded-full font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-lg">
              Get Started <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-full font-bold hover:border-slate-300 transition-all text-lg">
              Request Ride
            </button>
          </div>
        </div>

        {/* Right: Immersive Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100"
        >
          <img
            src={heroImage}
            alt="Logistics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-white">
            <p className="text-xl font-bold mb-1">Earn while you drive</p>
            <p className="text-sm text-slate-200">
              Join thousands of drivers making money on their daily routes.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Feature Grid: Clean Uber Style */}
      <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
        {[
          { icon: <Car />, title: "Ride", text: "Book affordable, safe trips" },
          {
            icon: <Package />,
            title: "Deliver",
            text: "Reliable parcel delivery",
          },
          {
            icon: <MapPin />,
            title: "Route",
            text: "Optimized logistics planning",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-white text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-950 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-500 group-hover:text-slate-700 transition-colors">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
