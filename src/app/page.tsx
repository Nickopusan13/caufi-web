import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import MenSection from "@/components/home/MenSec";
import WomanSec from "@/components/home/WomanSec";
import Quotes from "@/components/home/Quotes";
import BagSection from "@/components/home/BagSec";
import ShoesSection from "@/components/home/ShoesSec";
import WhyLoveCaufi from "@/components/home/WhyLoveCaufi";
import Trending from "@/components/home/Trending";
import ReviewSection from "@/components/home/ReviewSec";
import Promo from "@/components/home/Promo";
import ImageScrollerWrapper from "@/components/home/ImageScroller";

export const metadata: Metadata = {
  title: "Caufi",
  description: "Welco6me to Caufi — Fashion for Everyone",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-20 lg:py-24">
        <ImageScrollerWrapper />
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
