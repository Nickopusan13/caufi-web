export const blogPosts = {
  "welcome-to-caufi": {
    title: "Welcome to Caufi: Where Style Meets Everyday Comfort",
    description:
      "Discover the story behind Caufi and why we're passionate about bringing you high-quality, affordable fashion.",
    author: "Caufi Team",
    date: "2025-12-15",
    category: "Brand Story",
    cover: "/blog/welcome-to-caufi.webp",
    contentKey: "welcome-to-caufi",
  },
} as const;

export type BlogSlug = keyof typeof blogPosts;
