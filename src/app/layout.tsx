import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import { Love_Ya_Like_A_Sister, Poppins, Inter, Kalam } from "next/font/google";
import "./globals.css";

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
        className={`${loveYaLikeASister.variable} ${poppinsFont.variable} ${interFont.variable} antialiased h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
