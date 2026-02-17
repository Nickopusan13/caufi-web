"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin, ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(SplitText, ScrambleTextPlugin, ScrollTrigger);

export default function About() {
  const title = useRef(null);
  const caufi = useRef(null);
  const firstSection = useRef(null);
  const firstSectionWords = useRef(null);
  const firstImage = useRef(null);
  const secondSection = useRef(null);
  const secondSectionWords = useRef(null);
  const secondImage = useRef(null);
  useGSAP(() => {
    const titleSplit = new SplitText(title.current, { type: "chars" });
    const tlFirst = gsap.timeline({
      delay: 0.2,
      scrollTrigger: {
        trigger: firstSection.current,
        start: "top 70%",
      },
    });
    const tlSecond = gsap.timeline({
      delay: 0.2,
      scrollTrigger: {
        trigger: secondSection.current,
        start: "top 70%",
      },
    });
    gsap.from(titleSplit.chars, {
      yPercent: 100,
      stagger: 0.015,
      ease: "power3.out",
      duration: 1.1,
    });
    gsap.to(caufi.current, {
      duration: 2,
      scrambleText: {
        text: "CAUFI.",
        revealDelay: 0.1,
      },
    });
    tlFirst
      .from(firstSectionWords.current, {
        yPercent: 20,
        stagger: 0.012,
        ease: "power2.inOut",
        duration: 1.2,
        opacity: 0,
      })
      .from(firstImage.current, {
        x: -200,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    tlSecond
      .from(secondSectionWords.current, {
        yPercent: 20,
        stagger: 0.012,
        ease: "power2.inOut",
        duration: 1.2,
        opacity: 0,
      })
      .from(secondImage.current, {
        x: 200,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col w-full justify-center items-center gap-10 lg:gap-15 min-h-dvh">
        <h1 ref={caufi} className="text-7xl lg:text-8xl font-bold" />
        <p
          ref={title}
          className="flex flex-col items-center justify-center text-lg lg:text-4xl text-center leading-tight"
        >
          <div className="overflow-hidden">Behind Daydream is a team</div>
          <div className="overflow-hidden">dedicated to rethinking how we</div>
          <div className="overflow-hidden">experience music</div>
        </p>
      </div>

      <div
        ref={firstSection}
        className="flex flex-col lg:flex-row mx-10 lg:mx-20 lg:my-20 gap-12 min-h-dvh "
      >
        <div
          ref={firstSectionWords}
          className="lg:w-1/2 w-full flex flex-col text-justify text-base lg:text-2xl leading-relaxed items-center justify-center"
        >
          <p className="text-justify">
            From the first sketches to the final build, we focus on
            craftsmanship and quality. Every material, every button, and every
            feature is carefully considered to create a seamless listening
            experience.
          </p>
          <br />
          <p>
            We believe in making tech that lasts, both in function and
            feeling—because great music deserves a great way to be heard.
          </p>
        </div>

        <div
          ref={firstImage}
          className="lg:w-1/2 w-full h-96 relative flex lg:items-center justify-center lg:justify-end"
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            className="absolute w-64 h-96 sm:w-80 sm:h-[480px] lg:w-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl -rotate-5 lg:-rotate-10 z-20"
          >
            <Image
              src="/assets/model.webp"
              alt="Model"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 639px) 256px, (max-width: 1023px) 320px, 384px"
            />
          </motion.div>
          <div className="absolute -rotate-10 lg:-rotate-15 w-64 h-96 rounded-2xl z-10 bg-zinc-200 dark:bg-white lg:w-96 lg:h-[600px]" />
          <div className="absolute -rotate-15 lg:-rotate-20 w-64 h-96 rounded-2xl z-10 bg-zinc-200 dark:bg-white lg:w-96 lg:h-[600px]" />
        </div>
      </div>

      <div
        ref={secondSection}
        className="flex flex-col lg:flex-row mx-10 lg:mx-20 my-20 gap-12 min-h-dvh"
      >
        <div
          ref={secondSectionWords}
          className="w-full lg:w-1/2 flex flex-col text-justify text-base lg:text-2xl leading-relaxed items-center justify-center px-4 lg:px-0 order-1 lg:order-2"
        >
          <p className="text-justify">
            From the first sketches to the final build, we focus on
            craftsmanship and quality. Every material, every button, and every
            feature is carefully considered to create a seamless listening
            experience.
          </p>
          <br />
          <p>
            We believe in making tech that lasts, both in function and
            feeling—because great music deserves a great way to be heard.
          </p>
        </div>
        <div
          ref={secondImage}
          className="w-full h-96 lg:w-1/2 relative flex justify-center lg:justify-start lg:items-center order-2 lg:order-1"
        >
          <div className="relative w-64 h-96 sm:w-80 sm:h-[480px] lg:w-96 lg:h-[600px] mx-auto lg:mx-0">
            <div className="absolute inset-0 -rotate-10 lg:-rotate-15 rounded-2xl z-10 bg-zinc-200 dark:bg-white" />
            <div className="absolute inset-0 -rotate-15 lg:-rotate-20 rounded-2xl z-10 bg-zinc-200 dark:bg-white" />
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl -rotate-5 lg:-rotate-10 z-20"
            >
              <Image
                src="/assets/model.webp"
                alt="Model"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 639px) 90vw, (max-width: 1023px) 75vw, 384px"
              />
            </motion.div>
          </div>
        </div>
      </div>
      <LastSection />
    </div>
  );
}

const LastSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!contentRef.current) return;
    gsap.set(contentRef.current, { opacity: 0 });
    gsap.to(contentRef.current, {
      opacity: 1,
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-dvh flex flex-col items-center justify-center"
    >
      <div
        ref={contentRef}
        className="flex flex-col gap-5 lg:gap-10 justify-center items-center text-center lg:px-0 px-5 max-w-7xl"
      >
        <h2 className="font-bold text-lg lg:text-6xl leading-normal lg:leading-tight">
          {`Passionate about music and design? We're building something special.
          Come be a part of it.`}
        </h2>
        <p className="text-sm lg:text-2xl">
          Daydream is an equal opportunity employer. We welcome all backgrounds,
          valuing diversity in music, ideas, and people.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95, y: -10 }}
        transition={{
          ease: "easeInOut",
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
        className="bg-zinc-200 dark:bg-zinc-800 py-5 px-20 rounded-4xl mt-20 cursor-pointer"
      >
        <span className="text-lg lg:text-3xl">SHOP HERE</span>
      </motion.button>
    </div>
  );
};
