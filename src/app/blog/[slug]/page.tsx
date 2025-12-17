import BlogContent from "@/components/blog/BlogContent";
import { blogPosts, type BlogSlug } from "@/lib/blogData";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import MDXContent from "@/components/blog/types/ContentMap";

export default async function BlogPageSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = slug.replace(/\/+$/, "");
  console.log("slug =", JSON.stringify(slug));
  console.log("available =", Object.keys(blogPosts));
  const post = blogPosts[cleanSlug as BlogSlug];
  return (
    <>
      <Navbar />
      <main className="bg-linear-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-40">
        <BlogContent {...post}>
          <MDXContent />
        </BlogContent>
      </main>
      <Footer />
    </>
  );
}
