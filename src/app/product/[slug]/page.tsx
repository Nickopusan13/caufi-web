import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import LoadingPage from "@/components/LoadingPage";
import { Suspense } from "react";
import ProductInfoFetcher from "@/components/product/ProductInfoFetch";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-40">
        <Suspense fallback={<LoadingPage />}>
          <ProductInfoFetcher slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
