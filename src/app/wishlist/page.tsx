import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import Wishlist from "@/components/wishlist/Wishlist";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <Wishlist />
      </main>
      <Footer />
    </>
  );
}
