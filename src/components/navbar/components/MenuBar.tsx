"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const navigationMenus = [
  { title: "Home", href: "/" },
  {
    title: "Products",
    href: "/shop",
    items: [
      {
        title: "All Products",
        href: "/shop",
        description: "Shop everything",
      },
      {
        title: "Men",
        href: "/shop?category=Men&page=1",
        description: "Just landed",
      },
      {
        title: "Women",
        href: "/shop?category=Women&page=1",
        description: "Most loved",
      },
      { title: "Sale", href: "/products/sale", description: "Up to 70% off" },
    ],
  },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
  { title: "Support", href: "/support" },
];

export default function MenuBar() {
  const pathname = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-1 p-2">
        {navigationMenus.map((menu) => {
          const isActive =
            pathname === menu.href || pathname.startsWith(`${menu.href}/`);
          return (
            <NavigationMenuItem key={menu.title}>
              {menu.items ? (
                <NavigationMenuTrigger
                  className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground",
                    "hover:text-foreground hover:bg-accent/50 data-[state=open]:bg-accent/80"
                  )}
                >
                  {menu.title}
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={menu.href}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-md transition-colors block",
                      isActive
                        ? "text-foreground bg-accent/70"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {menu.title}
                  </Link>
                </NavigationMenuLink>
              )}
              {isActive && !menu.items && (
                <motion.div
                  layoutId="navbar-active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {menu.items && (
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-96 lg:grid-cols-2">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const MenuBarMobile = () => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute left-0 right-0 top-full bg-background border-b shadow-lg overflow-hidden"
    >
      <ul className="flex flex-col p-4">
        {navigationMenus.map((menu) => {
          const isActive =
            pathname === menu.href || pathname.startsWith(`${menu.href}/`);
          return (
            <li key={menu.title}>
              {menu.items ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(menu.title)}
                    className={clsx(
                      "w-full text-left py-2 px-4 text-sm font-medium rounded-md transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                      "hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {menu.title}
                    <span className="ml-2">
                      {openSubmenus[menu.title] ? "-" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openSubmenus[menu.title] && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        {menu.items.map((item) => {
                          const isSubActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  "block py-2 px-4 text-sm rounded-md transition-colors",
                                  isSubActive
                                    ? "text-foreground bg-accent/70"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                )}
                              >
                                {item.title}
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={menu.href}
                  className={clsx(
                    "block py-2 px-4 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-foreground bg-accent/70"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {menu.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};
