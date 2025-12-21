"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FaCloudMoon, FaCloudSun } from "react-icons/fa6";

export default function AdminModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Label htmlFor="dark-mode">
        {isDark ? (
          <FaCloudMoon className="h-6 w-6" />
        ) : (
          <FaCloudSun className="h-6 w-6" />
        )}
      </Label>
    </div>
  );
}
