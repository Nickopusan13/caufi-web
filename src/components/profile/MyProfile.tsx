"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import { AddressInfo, ProfileInfo } from "./information/AccountInfo";
import { useGetCurrentUser } from "@/hooks/useLogin";

const tabs = ["My Profile", "My Address", "Order History", "Settings"] as const;

export default function MyProfile() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("My Profile");
  const { data: user } = useGetCurrentUser();
  return (
    <div className="min-h-screen max-w-6xl mx-auto py-5">
      <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-zinc-900 backdrop-blur-2xl border border-white/30 dark:border-zinc-800/50 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-blue-400/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-600/10 dark:to-pink-600/10 pointer-events-none" />
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-2xl">
                  <Image
                    src="/assets/avatar.webp"
                    alt="Nicko"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                  <TbCameraPlus className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-black dark:text-white">
                  {user?.name}
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">
                  @{user?.userName}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {["Edit Profile", "Edit Address"].map((label) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="rounded-xl px-6 py-3 text-sm font-medium text-black dark:text-white shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="w-full max-w-3xl mx-auto lg:mx-0">
            <div className="bg-zinc-100/70 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl p-2 shadow-inner">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative px-5 py-4 rounded-xl text-sm font-medium transition-all"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className={`relative z-10 ${
                          isActive
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {tab}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 rounded-xl bg-zinc-400 dark:bg-zinc-600 shadow-md"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-12"
            >
              {activeTab === "My Profile" && <ProfileInfo />}
              {activeTab === "My Address" && <AddressInfo />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
