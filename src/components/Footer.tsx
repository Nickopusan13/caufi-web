"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronRight, FaEnvelope, FaRocket } from "react-icons/fa";
import { footerSections, socials, optionsStores } from "./Item";

export default function Footer() {
  const [email, setEmail] = useState("");
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <footer className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <div className="bg-linear-to-br from-purple-600 via-pink-600 to-rose-600 py-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-6"
          >
            <FaRocket className="w-6 h-6 text-white" />
            <span className="text-white font-bold">Exclusive Drops Only</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Don’t Miss the Next Drop
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Be the first to know about limited releases, restocks, and secret
            sales.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-4"
          >
            <div className="relative flex-1 group">
              <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-6 pr-6 py-5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/40 focus:border-transparent transition-all text-lg font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-purple-600 font-black rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Join the List
              <FaChevronRight className="w-5 h-5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12"
        >
          <motion.div
            variants={item}
            className="col-span-2 md:col-span-3 lg:col-span-1"
          >
            <h1 className="text-5xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              CAUFI.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Premium streetwear curated for those who lead, not follow. Limited
              drops. Zero compromises.
            </p>
            <div className="flex gap-5">
              {socials.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.3, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          {footerSections.map((section, i) => (
            <motion.div key={i} variants={item}>
              <h3 className="font-bold text-lg mb-6 text-zinc-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <motion.li key={idx} whileHover={{ x: 8 }} className="group">
                    <a
                      href="#"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
          <motion.div variants={item} className="col-span-2 lg:col-span-1">
            <div className="space-y-10">
              {optionsStores.map((store, i) => (
                <div key={i}>
                  <h3 className="font-bold text-lg mb-5 text-zinc-900 dark:text-white">
                    {store.title}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {store.icon?.map((icon, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.15, y: -4 }}
                        className="bg-white dark:bg-zinc-900/80 rounded-2xl w-full p-1 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="relative w-full aspect-3/2">
                          <Image
                            src={icon}
                            alt={store.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © 2025{" "}
            <span className="font-bold text-purple-600 dark:text-purple-400">
              CAUFI
            </span>
            . All rights reserved. | Crafted with{" "}
            <span className="text-red-500">♥</span> in Indonesia
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
