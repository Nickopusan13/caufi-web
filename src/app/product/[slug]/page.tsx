import { getProductByIdentifier } from "@/api/product";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import ProductInfo from "@/components/product/ProductInfo";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductByIdentifier(slug);
  } catch (error) {
    console.log("Product not found:", slug, error);
    notFound();
  }
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <ProductInfo product={product} />
      </main>
      <Footer />
    </>
  );
}
