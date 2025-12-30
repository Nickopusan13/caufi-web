"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
