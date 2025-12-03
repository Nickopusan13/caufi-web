import ProductCart from "@/components/cart/ProductCart";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function Profile() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-24">
        <ProductCart />
      </main>
      <Footer />
    </>
  );
}
