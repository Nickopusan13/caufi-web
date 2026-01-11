import { getProductByIdentifier } from "@/api/product";
import { notFound } from "next/navigation";
import ProductInfo from "./ProductInfo";

export default async function ProductInfoFetcher({ slug }: { slug: string }) {
  let product;
  try {
    product = await getProductByIdentifier(slug);
  } catch {
    notFound();
  }
  return <ProductInfo product={product} />;
}
