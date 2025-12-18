import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import Sizeguide from "@/components/size-guide/SizeGuide";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function SizeGuidePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <Sizeguide />
      </main>
      <Footer />
    </>
  );
}
