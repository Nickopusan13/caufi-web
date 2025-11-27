"use client";

import { useState } from "react";
import { footerSections, socials, optionsStores } from "./Item";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className=" dark:bg-zinc-900 transition-all duration-300">
      <div className="bg-[#928BB9] p-2 lg:p-5 drop-shadow-sm drop-shadow-black flex items-center justify-center dark:bg-[#383548] dark:drop-shadow-white transition-all duration-300 overflow-x-hidden">
        <div className="text-center">
          <h1 className="text-[18px] lg:text-[25px] w-full text-black font-bold dark:text-white">
            Subscribe to our newsletter Get updates on new products and
            discounts!!
          </h1>
          <form
            className="relative mt-2 lg:mt-3 flex justify-center gap-1 lg:gap-2 lg:px-5"
            action=""
          >
            <input
              className="bg-white text-black placeholder:text-black w-full h-12 lg:h-16 rounded-2xl lg:px-5 px-3 placeholder:opacity-40 text-[12px] lg:text-[15px] focus:outline-none"
              type="email"
              name="input-email"
              id="input-email"
              autoComplete="off"
              placeholder=""
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              className={`absolute text-black left-3 lg:left-10 transition-all duration-200 ${
                email
                  ? "top-1 lg:text-[12px] text-[10px] font-bold"
                  : "top-4 lg:top-5.5 lg:text-[15px] text-[12px] opacity-40"
              } pointer-events-none`}
              htmlFor="input-email"
            >
              Email Address
            </label>
            <motion.button
              type="submit"
              className="text-white rounded-2xl p-1 px-1 lg:px-5 h-12 lg:h-16 font-bold text-[13px] lg:text-[18px]"
              whileHover={{ backgroundColor: "#9F1239" }}
              style={{ backgroundColor: "#B75050" }}
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>
      <div className="bg-white h-full dark:bg-zinc-900 transition-all duration-300 text-black dark:text-white flex flex-col">
        <div className="flex flex-col lg:flex-row lg:justify-around lg:items-baseline items-center h-full py-4 lg:py-10 lg:gap-0 gap-6 justify-center">
          <div className="flex flex-col pl-2 text-center">
            <h1 className="font-bold mb-1 lg:mb-2 text-[15px] lg:text-[20px]">
              CAUFI.
            </h1>
            <div className="flex gap-2 lg:gap-3">
              {socials.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={item.link}
                    key={index}
                    whileHover={{ scale: 2 }}
                  >
                    <Icon className="hover:fill-blue-500" />
                  </motion.a>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 lg:gap-8 justify-center">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h1 className="mb-3 font-bold lg:text-base text-[15px]">
                  {section.title}
                </h1>
                {section.links.map((shop: string, idx: number) => (
                  <a
                    className="flex flex-col mb-1 lg:text-base text-[12px] hover:text-blue-500"
                    href="#"
                    key={idx}
                  >
                    {shop}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 max-w-100 pr-2">
            {optionsStores.map((section, index) => (
              <div
                className="border-b border-gray-400 pb-4 last:border-none"
                key={index}
              >
                <h1 className="font-bold mb-2 lg:text-base text-[15px]">
                  {section.title}
                </h1>
                <div className="flex flex-wrap gap-4">
                  {section.icon?.map((icon, idx) =>
                    section.title === "Payment Options" ||
                    section.title === "Shipping Options" ? (
                      <div key={idx} className="relative w-[50px] h-[25px]">
                        <Image
                          src={icon}
                          alt="payment-options"
                          className="object-contain"
                          fill
                        />
                      </div>
                    ) : (
                      <a href="#" key={idx}>
                        <div className="relative w-20 h-[25px]">
                          <Image
                            src={icon}
                            alt="shipping-options"
                            className="object-contain"
                            fill
                          />
                        </div>
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t p-5 dark:bg-zinc-800 border-gray-300 pt-4 text-center text-sm text-gray-500">
          © 2025 CAUFI. |{" "}
          <a href="/contact" className="underline hover:text-black">
            Contact
          </a>{" "}
          |{" "}
          <a href="/reviews" className="underline hover:text-black">
            Reviews
          </a>
        </div>
      </div>
    </footer>
  );
}
