"use client";

import { useState } from "react";
import { faqs } from "./faqs";
import { Search, Mail, Phone, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, Variants } from "framer-motion";
import ChatBot from "./ChatBot";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-linear-to-b from-zinc-400 to-zinc-700 text-black dark:from-zinc-700 dark:to-zinc-950 dark:text-white py-24"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl mb-10 text-zinc-800 dark:text-zinc-200"
          >
            Find answers quickly or get in touch with our team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="max-w-2xl mx-auto relative"
          >
            <input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 w-8 h-8" />
          </motion.div>
        </div>
      </motion.section>
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Popular Topics
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Mail,
                title: "Account & Billing",
                desc: "Manage your subscription, update payment info, or view invoices.",
              },
              {
                icon: Phone,
                title: "Shipping & Delivery",
                desc: "Track orders, change delivery address, or choose express shipping.",
              },
              {
                icon: MessageSquare,
                title: "Returns & Refunds",
                desc: "Start a return, check refund status, or review our policy.",
              },
            ].map((topic, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="bg-white dark:bg-zinc-800/50 p-8 rounded-2xl text-center border"
              >
                <motion.div variants={cardVariants}>
                  <topic.icon className="w-14 h-14 mx-auto mb-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold mb-3">{topic.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {topic.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.08 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-gray-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-5 text-lg font-medium hover:no-underline hover:bg-zinc-100 dark:hover:bg-zinc-700/50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-gray-700 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
      <section>
        <ChatBot />
      </section>
    </div>
  );
}
