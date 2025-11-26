"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function MenuBar() {
  return (
    <div className="flex">
      <Link href="/">Hello</Link>
      <Link href="/">Hello</Link>
      <Link href="/">Hello</Link>
      <Link href="/">Hello</Link>
      <Link href="/">Hello</Link>
    </div>
  );
}
