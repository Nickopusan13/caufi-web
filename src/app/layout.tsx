import type { Metadata } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import { Love_Ya_Like_A_Sister, Poppins, Inter, Kalam } from "next/font/google";
import "./globals.css";
import { Lenis } from "lenis/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "leaflet/dist/leaflet.css";
import { cookies } from "next/headers";
import { AuthProvider } from "@/lib/useAuth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  const isLoggedIn = !!token;
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-thin">
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
            <Lenis root>
              <AuthProvider isLoggedIn={isLoggedIn}>{children}</AuthProvider>
            </Lenis>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
