"use client";

import { useContactCaufi } from "@/hooks/useLogin";
import { motion, Variants } from "framer-motion";
import { Send } from "lucide-react";
import { FaMailBulk, FaMapPin, FaPhoneAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import React, { useState } from "react";
import type { ContactCaufi } from "@/api/user";
import { FaMessage } from "react-icons/fa6";

export default function Contact() {
  const [formData, setFormData] = useState<ContactCaufi>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const mutation = useContactCaufi();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      },
    });
  };
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };
  const cardVariants: Variants = {
    hover: {
      y: -8,
      scale: 1.03,
      transition: { duration: 0.3 },
    },
  };
  const iconFloat: Variants = {
    hover: {
      y: [0, -6, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  return (
    <div>
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold dark:text-white mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {`We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.`}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800/90 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 lg:p-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Send us a message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["firstName", "lastName"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {field === "firstName" ? "First Name" : "Last Name"}
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id={field}
                        name={field} // Important for handleChange
                        value={formData[field as keyof ContactCaufi]} // Dynamic access
                        onChange={handleChange}
                        required
                        className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder={field === "firstName" ? "John" : "Doe"}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <FaMailBulk className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="How can we help you today?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <div className="relative">
                  <FaMessage className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="pl-11 w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={mutation.isPending}
                className={`w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                  mutation.isPending
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                <Send className="h-5 w-5" />
                {mutation.isPending ? "Sending..." : "Send Message"}
              </motion.button>
              {mutation.isError && (
                <div className="text-red-500 text-center font-medium">
                  {mutation.error?.message ||
                    "Failed to send message. Please try again."}
                </div>
              )}
            </form>
          </motion.div>
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Contact Information
              </h2>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800/90 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 flex items-start gap-6 group"
            >
              <motion.div
                variants={iconFloat}
                whileHover="hover"
                className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-2xl"
              >
                <FaMapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Address
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  123 Business Street
                  <br />
                  Suite 100
                  <br />
                  City, State 12345
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800/90 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 flex items-start gap-6 group"
            >
              <motion.div
                variants={iconFloat}
                whileHover="hover"
                className="bg-green-100 dark:bg-green-900/50 p-4 rounded-2xl"
              >
                <FaPhoneAlt className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Phone
                </h3>
                <Link
                  href="tel:+6285156229898"
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block font-medium"
                >
                  +62 851-5622-9898
                </Link>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Mon - Fri: 9AM - 6PM
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800/90 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 flex items-start gap-6 group"
            >
              <motion.div
                variants={iconFloat}
                whileHover="hover"
                className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-2xl"
              >
                <FaMailBulk className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Email
                </h3>
                <Link
                  href="mailto:nickowork13@gmail.com?subject=Website%20Contact%20Inquiry"
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block font-medium text-lg"
                >
                  nickowork13@gmail.com
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
