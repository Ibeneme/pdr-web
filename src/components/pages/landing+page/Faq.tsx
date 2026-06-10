import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left hover:opacity-60 transition-opacity"
      >
        <span className="text-xl font-semibold tracking-tight text-black">
          {question}
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-zinc-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQPage = () => {
  const faqs = [
    {
      question: "How does Padiman Route work?",
      answer:
        "Padiman Route connects travelers and people needing to send parcels. Drivers post their routes, and users can match with them for convenient, cost-effective delivery.",
    },
    {
      question: "Is it safe to send parcels through the platform?",
      answer:
        "Safety is our priority. Every member of our community undergoes a vetting process. We also provide real-time tracking to ensure transparency from pickup to delivery.",
    },
    {
      question: "How are prices determined?",
      answer:
        "Pricing is transparent and based on route distance and parcel size. You'll see the total cost before you confirm your request, with no hidden fees.",
    },
    {
      question: "Can I track my journey or parcel?",
      answer:
        "Yes, once a match is confirmed, you get access to our live tracking dashboard which shows the route progress in real-time.",
    },
  ];

  return (
    <main className="py-24 bg-white text-black">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Support
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-zinc-500">
            Everything you need to know about moving with Padiman Route.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mb-16">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Support CTA */}
        <div className="bg-zinc-50 p-10 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-zinc-600 mb-6">
            Our support team is always ready to help you.
          </p>
          <a
            href="mailto:hello@padimanroute.com"
            className="inline-block bg-black text-white px-8 py-4 font-bold hover:bg-zinc-800 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
};
