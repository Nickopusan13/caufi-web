"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Package, Settings, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/api/user";

export default function ProfileButton({
  user,
  logout,
}: {
  user: UserProfile;
  logout: () => void;
}) {
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || "U";
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center gap-3 rounded-full px-3 py-2 hover:bg-accent/70 transition-colors">
          <Avatar className="h-9 w-9 ring-2 ring-background ring-offset-2 ring-offset-background">
            <AvatarImage
              src={user.profileImage || undefined}
              alt={user.name || user.email}
            />
            <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              {user.name ? user.name.split(" ")[0] : "User"}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "My Account"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile#my-profile" className="flex items-center gap-3">
            <User className="w-4 h-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/profile#order-history"
            className="flex items-center gap-3"
          >
            <Package className="w-4 h-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4" />
            Wishlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile#settings" className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive flex items-center gap-3"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
