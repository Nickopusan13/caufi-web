import Blog from "@/components/blog/Blog";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-30 lg:py-40">
        <Blog />
      </main>
      <Footer />
    </>
  );
}
