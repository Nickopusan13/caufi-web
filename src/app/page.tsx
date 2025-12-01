import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import ImageScroller from "@/components/home/ImageScroller";
import Footer from "@/components/Footer";
import MenSection from "@/components/home/MenSec";
import WomanSec from "@/components/home/WomanSec";
import Quotes from "@/components/home/Quotes";
import BagSection from "@/components/home/BagSec";
import ShoesSection from "@/components/home/ShoesSec";
import WhyLoveCaufi from "@/components/home/WhyLoveCaufi";
import Trending from "@/components/home/Trending";
import ReviewSection from "@/components/home/ReviewSec";
import Promo from "@/components/home/p";

export const metadata: Metadata = {
  title: "Caufi",
  description: "Welco6me to Caufi — Fashion for Everyone",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-24">
        <ImageScroller />
        <MenSection />
        <WomanSec />
        <Promo />
        <Quotes />
        <BagSection />
        <ShoesSection />
        <Trending />
        <WhyLoveCaufi />
        <ReviewSection />
      </main>
      <Footer />
    </>
  );
}
