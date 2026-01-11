import { getOneBlog } from "@/api/blog";
import { notFound } from "next/navigation";
import BlogContent from "./BlogContent";

export default async function BlogContentFetch({ slug }: { slug: string }) {
  let post;
  try {
    post = await getOneBlog(slug);
  } catch {
    notFound();
  }
  return <BlogContent post={post} />;
}
