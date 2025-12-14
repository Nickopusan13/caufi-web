import About from "@/components/about/About";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <About />
      </main>
      <Footer />
    </>
  );
}
