"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { menus, productItems } from "./Items";
import clsx from "clsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const MotionLink = motion(Link);

export default function MenuBar() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center justify-center gap-1">
        {menus.map((menu, index) => {
          const isActive =
            pathname === menu.href || pathname.startsWith(menu.href + "/");
          return (
            <NavigationMenuItem key={menu.title}>
              <MotionLink
                href={menu.href}
                className="group relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavigationMenuTrigger
                  className={clsx(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300",
                    "hover:text-primary focus:outline-none",
                    "data-[state=open]:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <motion.span
                    className="relative z-10 flex items-center gap-1.5"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {menu.title}
                  </motion.span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-primary/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          bounce: 0.3,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </NavigationMenuTrigger>
              </MotionLink>
              <NavigationMenuContent asChild>
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="min-w-[200px] rounded-lg border bg-popover p-4 shadow-lg"
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {menu.title}
                    </h4>
                    {productItems.map((item, idx) => {
                      return <p key={idx}>{item.items}</p>;
                    })}
                  </div>
                </motion.div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
