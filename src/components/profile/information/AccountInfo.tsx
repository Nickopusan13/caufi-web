"use client";

import { InformationItem } from "./InformationItem";
import {
  FaMapMarkedAlt,
  FaCity,
  FaMap,
  FaMailBulk,
  FaRegFlag,
} from "react-icons/fa";
import {
  BiSolidUser,
  BiMaleFemale,
  BiHome,
  BiUserCircle,
} from "react-icons/bi";
import { TbMailFilled } from "react-icons/tb";
import { ImPhone } from "react-icons/im";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useGetCurrentUser, useUserLogout } from "@/hooks/useLogin";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCurrentOrder } from "@/hooks/userOrder";
import { useState } from "react";
import { OrderStatus } from "@/api/order";
import { format } from "date-fns";
import { FilterButton } from "../OrderEdit";
import Link from "next/link";
import Image from "next/image";
import ToasterProvider from "@/components/ToasterProvider";
import { AnimatePresence } from "framer-motion";
import { RiLockPasswordFill } from "react-icons/ri";
import { LuLanguages } from "react-icons/lu";
import { IoLogOutSharp } from "react-icons/io5";
import { OpenSettings, SettingsItem } from "../SettingsEdit";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Loader2 } from "lucide-react";

export const ProfileInfo = () => {
  const { data: user, isLoading, error } = useGetCurrentUser();
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center lg:text-start">
          Profile Information
        </h1>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/70">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-64" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <BiUserCircle className="w-20 h-20 text-zinc-300 dark:text-zinc-700" />
        <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
          Failed to load profile
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:scale-105 transition transform"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="text-center py-16">
        <BiUserCircle className="w-24 h-24 mx-auto text-zinc-200 dark:text-zinc-800 mb-4" />
        <p className="text-zinc-500">No profile data found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <h1 className="text-2xl font-bold text-center lg:text-start">
        Profile Information
      </h1>
      <div
        className="p-7 rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 
                      border border-zinc-200/70 dark:border-zinc-800/70 
                      shadow-xl hover:shadow-2xl transition-all duration-500 
                      backdrop-blur-sm"
      >
        <div className="grid gap-5">
          <InformationItem
            icon={BiSolidUser}
            title="Full Name"
            description={user.name || "—"}
            username={user.userName}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBg="bg-purple-100 dark:bg-purple-950/40"
          />
          <InformationItem
            icon={TbMailFilled}
            title="Email Address"
            description={user.email || "—"}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-100 dark:bg-emerald-950/40"
          />
          <InformationItem
            icon={ImPhone}
            title="Phone Number"
            description={user.phoneNumber || "—"}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-100 dark:bg-amber-950/40"
          />
          <InformationItem
            icon={LiaBirthdayCakeSolid}
            title="Birthday"
            description={
              user.birthday
                ? new Date(user.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"
            }
            iconColor="text-pink-600 dark:text-pink-400"
            iconBg="bg-pink-100 dark:bg-pink-950/40"
          />
          <InformationItem
            icon={BiMaleFemale}
            title="Gender"
            description={
              user.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : "—"
            }
            iconColor="text-indigo-600 dark:text-indigo-400"
            iconBg="bg-indigo-100 dark:bg-indigo-950/40"
          />
        </div>
      </div>
    </div>
  );
};

export const AddressInfo = () => {
  const { data: user, isLoading, error } = useGetCurrentUser();
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center lg:text-start">
          Shipping Address
        </h1>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/70"
            >
              <Skeleton className="h-6 w-32 mb-3" />
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-56" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <BiHome className="w-16 h-16 text-zinc-400" />
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Failed to load address
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!user?.addresses || user.addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BiHome className="w-20 h-20 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
        <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
          No address added yet
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          Add your first shipping address to continue shopping
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-2xl font-bold text-center lg:text-start">
        Shipping Address{user.addresses.length > 1 ? "es" : ""}
      </h1>

      <div className="grid gap-6">
        {user.addresses.map((addr, index) => (
          <div
            key={addr.id || index}
            className="p-6 rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 
                       border border-zinc-200/70 dark:border-zinc-800/70 shadow-lg hover:shadow-xl 
                       transition-all duration-300 backdrop-blur-sm"
          >
            <div className="grid gap-4">
              <InformationItem
                icon={FaMapMarkedAlt}
                title="Street Address"
                description={addr.addressLine1 || addr.addressLine1 || "—"}
                iconColor="text-rose-600 dark:text-rose-400"
                iconBg="bg-rose-100 dark:bg-rose-950/40"
              />
              <InformationItem
                icon={FaCity}
                title="City"
                description={addr.city || "—"}
                iconColor="text-teal-600 dark:text-teal-400"
                iconBg="bg-teal-100 dark:bg-teal-950/40"
              />
              <InformationItem
                icon={FaMap}
                title="State / Province"
                description={addr.state || "—"}
                iconColor="text-amber-600 dark:text-amber-400"
                iconBg="bg-amber-100 dark:bg-amber-950/40"
              />
              <InformationItem
                icon={FaMailBulk}
                title="Postal Code"
                description={addr.postalCode || "—"}
                iconColor="text-purple-600 dark:text-purple-400"
                iconBg="bg-purple-100 dark:bg-purple-950/40"
              />
              <InformationItem
                icon={FaRegFlag}
                title="Country"
                description={addr.country || "—"}
                iconColor="text-indigo-600 dark:text-indigo-400"
                iconBg="bg-indigo-100 dark:bg-indigo-950/40"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OrderInfo = () => {
  const { data: orders = [], isLoading, error } = useGetCurrentOrder();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">(
    "all"
  );

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700 max-h-200">
      <h1 className="text-2xl font-bold text-center lg:text-start">
        Order History
      </h1>

      <FilterButton
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-600">
          Failed to load orders. Please try again later.
        </div>
      )}
      {!isLoading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">
            {selectedFilter === "all"
              ? "You haven't placed any orders yet."
              : `No ${selectedFilter} orders found.`}
          </p>
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                    ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.status}
                </span>
                <time className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </time>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-semibold">Order #{order.id}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="p-5 bg-gray-50">
              {order.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.productId}`}
                  className="flex gap-4 items-center hover:bg-white p-3 -m-3 rounded-lg transition-colors"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      quality={100}
                      width={100}
                      height={100}
                      className="object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16 0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × $
                      {Number(item.priceAtPurchase).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.quantity * Number(item.priceAtPurchase)).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Delivered to:{" "}
                <span className="font-medium">
                  {order.address.addressLine1}, {order.address.city}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Settings = () => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "language" | "logout" | "delete" | null;
  }>({
    isOpen: false,
    type: null,
  });
  const openDialog = (type: "language" | "logout" | "delete") => {
    setDialog({ isOpen: true, type });
  };
  const closeDialog = () => {
    setDialog({ isOpen: false, type: null });
  };
  const { mutate: logout, isPending } = useUserLogout();
  return (
    <>
      <ToasterProvider />
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-2xl font-bold text-center lg:text-start">
          Settings
        </h1>
        <div
          className="p-7 rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 
                      border border-zinc-200/70 dark:border-zinc-800/70 
                      shadow-xl hover:shadow-2xl transition-all duration-500 
                      backdrop-blur-sm"
        >
          <div className="grid gap-4">
            <InformationItem
              icon={RiLockPasswordFill}
              title="Password"
              description="Change your password"
              href="/change-password"
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-100 dark:bg-blue-950/40"
            />
            <SettingsItem
              icon={LuLanguages}
              title="Language"
              description="Change app language"
              onClick={() => openDialog("language")}
              iconColor="text-purple-600 dark:text-purple-400"
              iconBg="bg-purple-100 dark:bg-purple-950/40"
            />
            <SettingsItem
              icon={IoLogOutSharp}
              title="Logout"
              description="Sign out from this device"
              onClick={() => openDialog("logout")}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-100 dark:bg-red-950/40"
            />
            <SettingsItem
              icon={MdOutlineDeleteForever}
              title="Delete Account"
              description="Permanently delete your account"
              onClick={() => openDialog("delete")}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-100 dark:bg-red-950/40"
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {dialog.isOpen && (
          <>
            {dialog.type === "language" && (
              <OpenSettings
                open={dialog.isOpen}
                onOpenChange={closeDialog}
                title="Change Language"
                type="language"
              />
            )}

            {dialog.type === "logout" && (
              <OpenSettings
                open={dialog.isOpen}
                onOpenChange={closeDialog}
                title="Want to logout?"
                type="confirmation"
                onConfirm={() => {
                  logout();
                }}
              />
            )}

            {dialog.type === "delete" && (
              <OpenSettings
                open={dialog.isOpen}
                onOpenChange={closeDialog}
                title="Delete your account?"
                type="confirmation"
                onConfirm={() => {
                  // handleDeleteAccount();
                  closeDialog();
                }}
              />
            )}
          </>
        )}
        {isPending && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
