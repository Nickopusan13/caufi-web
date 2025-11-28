import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import ImageScroller from "@/components/home/ImageScroller";
import Footer from "@/components/Footer";
import MenSection from "@/components/home/MenSec";
import WomanSec from "@/components/home/WomanSec";
import Quotes from "@/components/home/Quotes";

export const metadata: Metadata = {
  title: "Caufi",
  description: "Welcome to Caufi — Fashion for Everyone",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-24 bg-white/50 dark:bg-zinc-900 h-1000">
        <ImageScroller />
        <MenSection />
        <WomanSec />
        <Quotes />
      </main>
      <Footer />
    </>
  );
}
