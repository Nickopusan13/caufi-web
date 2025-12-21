import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import Checkout from "@/components/checkout/Checkout";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <Checkout />
      </main>
      <Footer />
    </>
  );
}
