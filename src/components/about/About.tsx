"use client";

import { motion } from "framer-motion";
import { Store, Package, Truck, Shield } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Store className="w-8 h-8" />,
      title: "Premium Quality",
      description:
        "We carefully curate every product to ensure the highest standards of quality and craftsmanship.",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Fast & Secure Packaging",
      description:
        "Every order is packed with care and shipped securely to arrive in perfect condition.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Worldwide Shipping",
      description:
        "We deliver to over 100 countries with reliable partners and tracking on every order.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Buyer Protection",
      description:
        "Shop with confidence knowing your purchase is protected with our satisfaction guarantee.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-purple-900 via-indigo-950 to-black py-24 md:py-32">
        {/* Subtle grain overlay for premium feel */}
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

        {/* Animated background accents */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-purple-200 to-pink-200">
              About Us
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto opacity-90 leading-relaxed">
              {`We're passionate about bringing you{" "}`}
              <span className="font-semibold text-purple-300">
                {`exceptional products`}
              </span>{" "}
              that elevate your everyday life — designed with precision,
              delivered with care.
            </p>

            {/* Optional subtle underline glow */}
            <div className="mt-10 flex justify-center">
              <div className="h-1 w-32 bg-linear-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2023, we started with a simple mission: to make
                premium, well-designed products accessible to everyone.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {`Today, we've grown into a trusted online destination serving
                thousands of happy customers worldwide. We believe great
                products shouldn't come with unnecessary markups — quality and
                affordability can go hand in hand.`}
              </p>
            </div>
            <div className="bg-linear-to-br from-indigo-100 to-purple-100 rounded-3xl p-12 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl font-bold text-indigo-600 mb-2">
                  10K+
                </div>
                <p className="text-xl text-gray-700">Happy Customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values / Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We stand behind every product we sell with unwavering commitment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Thousands of Satisfied Customers
            </h2>
            <p className="text-xl opacity-90">
              Experience the difference quality and care can make.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
