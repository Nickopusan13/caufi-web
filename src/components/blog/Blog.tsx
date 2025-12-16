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

// Sample blog posts tailored for Caufi - an e-commerce brand
const blogPosts = [
  {
    id: 1,
    title: "Welcome to Caufi: Your New Favorite Fashion Destination",
    excerpt:
      "Discover the story behind Caufi and why we're passionate about bringing you high-quality, affordable fashion that fits your lifestyle.",
    author: "Caufi Team",
    date: "December 15, 2025",
    readTime: "5 min read",
    category: "Brand Story",
    featured: true,
  },
  {
    id: 2,
    title: "Top 10 Summer Essentials You Need in Your Wardrobe",
    excerpt:
      "From breezy dresses to stylish sandals, here's our curated list of must-have items to stay cool and fashionable this summer.",
    author: "Sarah - Style Editor",
    date: "December 10, 2025",
    readTime: "8 min read",
    category: "Style Guide",
  },
  {
    id: 3,
    title: "How to Style Our New Arrival Collection",
    excerpt:
      "Get inspired with 5 different ways to wear our latest drop. Perfect outfits for work, weekends, and everything in between.",
    author: "Mia - Fashion Stylist",
    date: "December 5, 2025",
    readTime: "10 min read",
    category: "How To",
  },
  {
    id: 4,
    title: "Customer Spotlight: Real Stories from Real Caufi Lovers",
    excerpt:
      "Hear from our amazing community about how Caufi pieces have become staples in their daily wardrobe.",
    author: "Caufi Community",
    date: "November 28, 2025",
    readTime: "7 min read",
    category: "Community",
  },
  {
    id: 5,
    title: "Sustainable Fashion: What We're Doing at Caufi",
    excerpt:
      "Learn about our commitment to eco-friendly materials, ethical production, and reducing our environmental impact.",
    author: "Caufi Team",
    date: "November 20, 2025",
    readTime: "12 min read",
    category: "Sustainability",
  },
  {
    id: 6,
    title: "Holiday Gift Guide 2025: Perfect Presents Under $50",
    excerpt:
      "Struggling to find the perfect gift? We've got you covered with thoughtful, stylish options for everyone on your list.",
    author: "Emma - Gift Expert",
    date: "November 15, 2025",
    readTime: "9 min read",
    category: "Gift Guide",
  },
];

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
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];
  const recentPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
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

        {/* Featured Post */}
        {featuredPost && (
          <motion.article variants={itemVariants} className="mb-20">
            <Link href={`/blog/${featuredPost.id}`}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white dark:bg-gray-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Featured Image Placeholder - Fashion themed */}
                  <div className="relative h-96 lg:h-full bg-linear-to-br from-pink-400 via-purple-400 to-indigo-500">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <Package className="h-24 w-24 mb-4 opacity-80" />
                      <p className="text-3xl font-bold opacity-90">
                        Welcome to Caufi
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
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
                        {featuredPost.readTime}
                      </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      {featuredPost.excerpt}
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

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <Link href={`/blog/${post.id}`}>
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-700 cursor-pointer h-full flex flex-col transition-all"
                >
                  {/* Post Image Placeholder */}
                  <div className="relative h-64 bg-linear-to-br from-purple-400 to-pink-400">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="h-20 w-20 text-white opacity-80" />
                    </div>
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
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <time className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </time>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <button className="bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-lg">
            Explore More Stories
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
