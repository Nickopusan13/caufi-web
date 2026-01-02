import Footer from "@/components/Footer";
import LoadingPage from "@/components/LoadingPage";
import Navbar from "@/components/navbar/Navbar";
import MainShop from "@/components/shop/MainShop";
import { Suspense } from "react";

export default function ShopPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-24 lg:py-40">
        <MainShop />
      </main>
      <Footer />
    </Suspense>
  );
}
