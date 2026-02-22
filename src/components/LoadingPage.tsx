"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function LoadingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.set(logoRef.current, { opacity: 0, y: 40, filter: "blur(8px)" });
      gsap.to(logoRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "expo.out",
        delay: 0.4,
      });
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: "expo.out",
        delay: 0.9,
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center md:gap-10">
        <h1
          ref={logoRef}
          className="text-7xl font-black tracking-[-0.04em] text-black dark:text-white md:text-9xl animate-pulse"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          CAUFI.
        </h1>

        <div
          ref={subtitleRef}
          className="flex flex-col items-center text-base font-light tracking-wide text-gray-900 dark:text-gray-300 md:text-lg"
        >
          <span className="mt-1 opacity-70">For full enjoyment in fashion</span>
        </div>
        <div className="mt-4 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white/40"
              style={{
                animation: `pulse 2.4s ${i * 0.3}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
