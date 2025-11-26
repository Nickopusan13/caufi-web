import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Caufi",
  description: "Welcome to Caufi — Fashion for Everyone",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-zinc-900"></main>
    </>
  );
}
