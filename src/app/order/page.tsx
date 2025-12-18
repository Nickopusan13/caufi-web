import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import Order from "@/components/order/OrderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <Order />
      </main>
      <Footer />
    </>
  );
}
