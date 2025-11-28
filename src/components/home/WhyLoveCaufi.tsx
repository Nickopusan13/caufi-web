"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Sparkles,
  Shield,
  ShoppingBag,
} from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "100% Authentic",
    desc: "Every piece is verified and guaranteed genuine — no fakes, ever.",
  },
  {
    icon: Sparkles,
    title: "Competitive Prices",
    desc: "Luxury doesn’t have to cost a fortune. We bring you the best deals.",
  },
  {
    icon: ShoppingBag,
    title: "Extensive Collection",
    desc: "150+ luxury & indie brands curated in one place — all drops, all vibes.",
  },
  {
    icon: Heart,
    title: "Seamless Experience",
    desc: "Shop like it’s 2025: fast, beautiful, and made just for you.",
  },
];

export default function WhyLoveCaufi() {
  return (
    <section className="w-full py-10 px-4 bg-linear-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            You’ll{" "}
            <span className="relative">
              love
              <span className="absolute -inset-1 bg-purple-500/30 blur-3xl -z-10" />
            </span>{" "}
            shopping at{" "}
            <span className="font-irish-grover text-purple-600 dark:text-purple-400 underline decoration-wavy">
              CAUFI
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Here’s why thousands already do.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              {/* Floating Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-2xl scale-0 group-hover:scale-150 transition-transform duration-700" />
                <item.icon className="relative w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto" />
              </div>

              <h3 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Tiny check on hover */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Optional subtle CTA at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Ready to fall in love?{" "}
            <span className="text-purple-600 dark:text-purple-400 underline cursor-pointer hover:no-underline">
              Start shopping →
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
