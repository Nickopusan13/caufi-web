"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Tag } from "lucide-react";
import type { Variants } from "framer-motion";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogContentProps {
  title: string;
  description?: string;
  author: string;
  date: string;
  category: string;
  cover: string;
  readingTime: string;
  children: React.ReactNode;
}

export default function BlogContent({
  title,
  author,
  date,
  category,
  readingTime,
  children,
}: BlogContentProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 text-sm"
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <time dateTime={date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{readingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <span>{category}</span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="mb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="prose prose-lg dark:prose-invert max-w-none
                     prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                     prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl
                     prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-relaxed
                     prose-a:text-pink-600 dark:prose-a:text-pink-400 hover:prose-a:underline font-medium
                     prose-blockquote:border-l-4 prose-blockquote:border-pink-500 prose-blockquote:bg-pink-50/50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic
                     prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full prose-img:object-cover
                     prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6 prose-li:text-gray-700 dark:prose-li:text-gray-300
                     prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white"
        >
          {children}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <Link
            href="/blog"
            className="text-pink-600 dark:text-pink-400 font-medium hover:underline flex items-center gap-2 transition-all hover:gap-3"
          >
            ← Back to all posts
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
            Thanks for reading! Share if you loved it 💜
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
