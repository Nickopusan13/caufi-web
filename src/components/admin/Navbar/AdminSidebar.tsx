"use client";

import { motion, Variants } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users, LayoutDashboard, Search } from "lucide-react"; // Added Search icon
import AdminModeToggle from "./AdminModeToggle";

const sidebarVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
};

const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export default function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-2 p-4"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <AdminModeToggle />
        </motion.div>
      </SidebarHeader>
      <SidebarContent>
        <motion.nav
          className="flex flex-col gap-2 p-4"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              className="justify-start gap-2 w-full"
              asChild
            >
              <motion.button whileHover={buttonHover}>
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </motion.button>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              className="justify-start gap-2 w-full"
              asChild
            >
              <motion.button whileHover={buttonHover}>
                <Users className="h-5 w-5" />
                Users
              </motion.button>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              className="justify-start gap-2 w-full"
              asChild
            >
              <motion.button whileHover={buttonHover}>
                <Search className="h-5 w-5" />
                Search
              </motion.button>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              className="justify-start gap-2 w-full"
              asChild
            >
              <motion.button whileHover={buttonHover}>
                <Settings className="h-5 w-5" />
                Settings
              </motion.button>
            </Button>
          </motion.div>
        </motion.nav>
      </SidebarContent>
      <SidebarFooter>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-2 p-4 border-t"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">
              admin@example.com
            </span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="h-5 w-5" />
          </Button>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
