"use client";

import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import Image from "next/image";

const baseReviews = [
  {
    name: "Andri",
    comment: "The quality is insane. Never going back to regular stores.",
    rating: 5,
    avatar: "/assets/avatar.webp",
  },
  {
    name: "Sasha",
    comment: "Found my dream jacket here. Fast shipping and 100% authentic!",
    rating: 5,
    avatar: "/assets/avatar.webp",
  },
  {
    name: "Luna",
    comment: "Best indie drops I’ve seen. The curation is unreal.",
    rating: 5,
    avatar: "/assets/avatar.webp",
  },
  {
    name: "Kai",
    comment: "Finally a place that gets my style. Obsessed.",
    rating: 5,
    avatar: "/assets/avatar.webp",
  },
  {
    name: "Milo",
    comment: "Packaging was beautiful. Felt like a gift to myself.",
    rating: 5,
    avatar: "/assets/avatar.webp",
  },
];
const reviews = [...baseReviews, ...baseReviews];

export default function ReviewSection() {
  return (
    <section className="w-full py-5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            What everyone is saying about{" "}
            <span className="font-irish-grover text-purple-600 dark:text-purple-400 underline decoration-wavy">
              CAUFI
            </span>
          </h2>
          <div className="flex justify-center items-center gap-3 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-7 h-7 fill-yellow-500 text-yellow-500"
              />
            ))}
            <span className="text-xl font-bold">5.0 / 5.0</span>
          </div>
        </motion.div>
        <div className="relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              },
            }}
            className="flex gap-8"
          >
            {reviews.map((review, i) => (
              <div
                key={i}
                className="flex-none w-80 md:w-96 p-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-default"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-purple-500/30">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                    <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{review.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-100 italic leading-relaxed">
                  {`"${review.comment}"`}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Join 12,847+ happy customers
        </motion.p>
      </div>
    </section>
  );
}
