export const blogPosts = {
  "welcome-to-caufi": {
    title: "Welcome to Caufi: Where Style Meets Everyday Comfort",
    description:
      "Discover the story behind Caufi and why we're passionate about bringing you high-quality, affordable fashion.",
    author: "Caufi Team",
    date: "2025-12-15",
    readingTime: "8 mins",
    category: "Brand Story",
    cover: "/blog/welcome-caufi/welcome-to-caufi.webp",
    contentKey: "welcome-to-caufi",
  },
  "top-trends-2026": {
    title:
      "Top Fashion Trends for 2026: Bold Colors, Playful Layers & Must-Have Accessories",
    description:
      "Get ahead of the curve with the hottest trends shaping 2026. From vibrant plum and pink hues to statement accessories and effortless layering – here's everything you need to refresh your wardrobe.",
    author: "Caufi Style Editor",
    date: "2025-12-16",
    readingTime: "6 mins",
    category: "Trends",
    cover: "/blog/trendy-outfit/Statement Accessories Take Center Stage.webp",
    contentKey: "top-trends-2026",
  },
} as const;

export type BlogSlug = keyof typeof blogPosts;
