import BlogContent from "@/components/blog/BlogContent";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

export default async function BlogPageSlug() {
  return (
    <>
      <Navbar />
      <main className="bg-linear-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-40">
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
