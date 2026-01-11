import { Suspense } from "react";
import LoadingPage from "@/components/LoadingPage";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import BlogContentFetch from "@/components/blog/BlogContentFetch";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export default async function BlogPageSlug({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <Navbar />
      <main className="bg-linear-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-40">
        <Suspense fallback={<LoadingPage />}>
          <BlogContentFetch slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
