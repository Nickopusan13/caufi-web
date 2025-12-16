"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Package,
  ShoppingBag,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Variants } from "framer-motion";
import { blogPosts, type BlogSlug } from "@/lib/blogData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hover: {
    y: -12,
    scale: 1.03,
    transition: { duration: 0.4 },
  },
};

export default function Blog() {
  const postsArray = Object.entries(blogPosts) as [
    BlogSlug,
    (typeof blogPosts)[BlogSlug]
  ][];
  const featuredPost = postsArray[0]?.[1];
  const featuredSlug = postsArray[0]?.[0];
  const recentPosts = postsArray.slice(1).map(([, post]) => post);
  const recentSlugs = postsArray.slice(1).map(([slug]) => slug);
  if (postsArray.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">No blog posts yet. Stay tuned!</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <div className="flex justify-center mb-6">
            <div className="bg-linear-to-r from-pink-500 to-purple-600 p-4 rounded-full">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Caufi Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Fashion tips, style inspiration, behind-the-scenes stories, and
            everything you need to elevate your wardrobe.
          </p>
        </motion.div>
        {featuredPost && featuredSlug && (
          <motion.article variants={itemVariants} className="mb-20">
            <Link href={`/blog/${featuredSlug}`}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white dark:bg-gray-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-96 lg:h-full overflow-hidden">
                    {featuredPost.cover ? (
                      <Image
                        src={featuredPost.cover}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-pink-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center text-white">
                        <Package className="h-24 w-24 mb-4 opacity-80" />
                        <p className="text-3xl font-bold opacity-90">
                          Welcome to Caufi
                        </p>
                        <div className="flex gap-2 mt-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-8 w-8 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-10 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-full font-medium text-lg">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {featuredPost.readingTime}
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400 font-semibold text-lg">
                      <span>Start Reading</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.article>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.length > 0 ? (
            recentPosts.map((post, index) => {
              const slug = recentSlugs[index];
              return (
                <motion.article
                  key={slug}
                  variants={itemVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Link href={`/blog/${slug}`}>
                    <motion.div
                      variants={cardVariants}
                      className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-700 cursor-pointer h-full flex flex-col transition-all"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {post.cover ? (
                          <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <ShoppingBag className="h-20 w-20 text-white opacity-80" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <time className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.date}
                            </time>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readingTime}
                            </span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              More stories coming soon!
            </div>
          )}
        </div>
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <button className="bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-lg">
            Explore More Stories
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
