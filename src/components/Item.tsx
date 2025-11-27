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

// NAVBAR
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

// FOOTER
export const footerSections = [
  {
    title: "Shop",
    links: ["Men", "Woman", "Promotions", "Collections", "New Arrival"],
  },
  {
    title: "Support",
    links: [
      "FAQ",
      "Shipping & Returns",
      "Track Order",
      "Customer Reviews",
      "Size Guide",
    ],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms & Conditions", "Payment Security"],
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
      "/icon/SHOPEE.png",
      "/icon/BLIBLI.png",
      "/icon/ZALORA.png",
      "/icon/TOKOPEDIA.png",
      "/icon/TIKTOKSHOP.png",
    ],
  },
  {
    title: "Payment Options",
    icon: [
      "/icon/BRI.png",
      "/icon/BCA.png",
      "/icon/DANA.png",
      "/icon/OVO.png",
      "/icon/SHOPEEPAY.png",
      "/icon/MANDIRI.png",
    ],
  },
  {
    title: "Shipping Options",
    icon: [
      "/icon/SICEPAT.png",
      "/icon/JNT.png",
      "/icon/JNE.png",
      "/icon/GOSEND.png",
      "/icon/ANTERAJA.png",
    ],
  },
];
