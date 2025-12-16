import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import SupportPage from "@/components/support/SupportPage";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-26">
        <SupportPage />
      </main>
      <Footer />
    </>
  );
}
