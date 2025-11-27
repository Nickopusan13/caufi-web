import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import { Love_Ya_Like_A_Sister, Poppins, Inter, Kalam } from "next/font/google";
import "./globals.css";
import { Lenis } from "lenis/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Caufi",
  description: "Welcome to Caufi — Fashion for Everyone",
};

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  subsets: ["latin"],
  variable: "--font-love",
  weight: ["400"],
  display: "swap",
});

const poppinsFont = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"],
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700"],
  display: "swap",
});

const kalamFont = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "300", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${loveYaLikeASister.variable} ${poppinsFont.variable} ${interFont.variable} ${kalamFont.variable} antialiased h-full`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Lenis root>{children}</Lenis>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
