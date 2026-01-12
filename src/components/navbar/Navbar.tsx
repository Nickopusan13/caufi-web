"use client";

import Link from "next/link";
import { Input } from "../ui/input";
import MenuBar, { MenuBarMobile } from "./components/MenuBar";
import ModeToggle from "./components/ModeToggle";
import { FaSearch } from "react-icons/fa";
import { useLenis } from "lenis/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProfileButton from "./components/ProfileButton";
import SignRegBtn from "./components/SignRegBtn";
import { useGetCurrentUser, useUserLogout } from "@/hooks/useLogin";
import { Skeleton } from "../ui/skeleton";
import { TiThMenuOutline } from "react-icons/ti";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { data: user, isLoading } = useGetCurrentUser();
  const { mutate: logout } = useUserLogout();
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(false);
  useLenis(({ scroll, direction }) => {
    if (direction === 1 && scroll > 100) {
      setHide(true);
    } else if (direction === -1) {
      setHide(false);
    }
  });
  const [openMenuBar, setOpenMenuBar] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <header />;
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out",
        hide ? "-translate-y-full" : "translate-y-0",
        "bg-background/70 backdrop-blur-xl border-b border-border/10"
      )}
    >
      <div className="absolute inset-0 bg-background backdrop-blur-xl" />
      <nav className="relative flex items-center justify-around py-5 max-w-7xl mx-auto w-full px-2 lg:px-0">
        <div className="flex items-center gap-8 md:flex-1 justify-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-black tracking-tighter bg-linear-to-r from-black to-black/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent drop-shadow-lg">
              CAUFI.
            </h1>
          </Link>
          <div className="relative max-w-lg w-full hidden md:block">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-11 pr-5 py-6 rounded-2xl bg-background/60 backdrop-blur-md border border-border/50 
               placeholder:text-muted-foreground/70
               focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50
               transition-all duration-300 hover:bg-background/80"
            />
          </div>
          <div className="hidden lg:block">
            <MenuBar />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-10 w-32 rounded-full" />
          ) : user ? (
            <ProfileButton logout={logout} user={user} />
          ) : (
            <SignRegBtn />
          )}
          <div className="lg:block hidden">
            <ModeToggle />
          </div>
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {openMenuBar ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpenMenuBar(false)}
                  className="cursor-pointer inline-block"
                >
                  <MdClose className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpenMenuBar(true)}
                  className="cursor-pointer inline-block"
                >
                  <TiThMenuOutline className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
      <AnimatePresence>{openMenuBar && <MenuBarMobile />}</AnimatePresence>
    </header>
  );
}
