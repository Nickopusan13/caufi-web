"use client";

import {
  FaFire,
  FaStar,
  FaBoxOpen,
  FaShoppingBag,
  FaUserAlt,
  FaSnowflake,
  FaClock,
  FaPenFancy,
  FaTshirt,
  FaDollarSign,
  FaGem,
  FaHeart,
  FaUndo,
  FaThumbsUp,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const recommendations = [
  { label: "Trending Now", icon: <FaFire /> },
  { label: "Must Have", icon: <FaStar /> },
  { label: "New Arrivals", icon: <FaBoxOpen /> },
  { label: "Best Sellers", icon: <FaShoppingBag /> },
  { label: "Style Picks for You", icon: <FaUserAlt /> },
  { label: "Seasonal Favorites", icon: <FaSnowflake /> },
  { label: "Just Dropped", icon: <FaClock /> },
  { label: "Editor’s Choice", icon: <FaPenFancy /> },
  { label: "Streetwear Highlights", icon: <FaTshirt /> },
  { label: "Under $50 Finds", icon: <FaDollarSign /> },
  { label: "Limited Edition", icon: <FaGem /> },
  { label: "Customer Favorites", icon: <FaHeart /> },
  { label: "Back in Stock", icon: <FaUndo /> },
  { label: "Top Rated", icon: <FaThumbsUp /> },
];

export const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/shop?category=Men&page=1" },
      { label: "Woman", href: "/shop?category=Woman&page=1" },
      { label: "Bag", href: "/shop?category=Bag&page=1" },
      { label: "Shoes", href: "/shop?category=Shoes&page=1" },
      { label: "New Arrival", href: "/shop?category=New Arrival&page=1" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/support" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Track Order", href: "/track-order" },
      { label: "Customer Reviews", href: "/reviews" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Payment Security", href: "/payment-security" },
    ],
  },
];

export const socials = [
  { icon: FaLinkedin, link: "#" },
  { icon: FaInstagram, link: "#" },
  { icon: FaTwitter, link: "#" },
  { icon: FaYoutube, link: "#" },
];

export const optionsStores = [
  {
    title: "Official Store",
    icon: [
      "/icon/SHOPEE.webp",
      "/icon/BLIBLI.webp",
      "/icon/ZALORA.webp",
      "/icon/TOKOPEDIA.webp",
      "/icon/TIKTOKSHOP.webp",
    ],
  },
  {
    title: "Payment Options",
    icon: [
      "/icon/BRI.webp",
      "/icon/BCA.webp",
      "/icon/DANA.webp",
      "/icon/OVO.webp",
      "/icon/SHOPEEPAY.webp",
      "/icon/MANDIRI.webp",
    ],
  },
  {
    title: "Shipping Options",
    icon: [
      "/icon/SICEPAT.webp",
      "/icon/JNT.webp",
      "/icon/JNE.webp",
      "/icon/GOSEND.webp",
      "/icon/ANTERAJA.webp",
    ],
  },
];
