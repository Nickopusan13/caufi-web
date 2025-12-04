"use client";

import { InformationItem } from "./InformationItem";
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
import { AnimatePresence, motion } from "framer-motion";
import { RiLockPasswordFill } from "react-icons/ri";
import { LuLanguages } from "react-icons/lu";
import { IoLogOutSharp } from "react-icons/io5";
import { OpenSettings, SettingsItem } from "../SettingsEdit";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ViewDetailsAddress } from "../components/ViewDetailsAddress";
import { UserAddressOut } from "@/api/user";

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
  const [selectedAddress, setSelectedAddress] = useState<UserAddressOut | null>(
    null
  );
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64 mx-auto lg:mx-0" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <BiHome className="w-20 h-20 text-zinc-300 dark:text-zinc-700" />
        </motion.div>
        <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400 mt-6">
          Oops! Failed to load addresses
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }
  if (!user?.addresses || user.addresses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-24 text-center px-6"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <BiHome className="w-24 h-24 text-zinc-200 dark:text-zinc-800" />
        </motion.div>
        <h3 className="text-2xl font-bold mt-8 text-zinc-800 dark:text-zinc-200">
          No address yet
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-sm">
          Add your first shipping address to make checkout faster and easier
        </p>
      </motion.div>
    );
  }
  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center lg:text-start bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        My Shipping Address{user.addresses.length > 1 ? "es" : ""}
      </motion.h1>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {user.addresses.map((addr, index) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{
                y: -12,
                transition: { duration: 0.3 },
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="group"
            >
              <Card
                className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/90 
                         backdrop-blur-xl border border-white/20 dark:border-zinc-800/50
                         shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
                         transition-all duration-500"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  layoutId={`glow-${addr.id}`}
                />

                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-linear-to-r from-indigo-500 to-purple-500 text-white border-0"
                    >
                      {addr.addressLabel || "Home"}
                    </Badge>
                    {addr.isSelected && (
                      <motion.div
                        layoutId="default-badge"
                        className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        Default
                      </motion.div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    {addr.recipientName}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {addr.phoneNumber}
                  </p>

                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-4 leading-relaxed line-clamp-3">
                    {addr.fullAddress}
                  </p>
                  <Button
                    onClick={() => setSelectedAddress(addr)}
                    variant="outline"
                    className="mt-5 w-full group-hover:border-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {selectedAddress && (
          <ViewDetailsAddress
            address={selectedAddress}
            open={true}
            onOpenChange={(open) => {
              if (!open) setSelectedAddress(null);
            }}
          />
        )}
      </motion.div>
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
                <span className="font-medium">{order.address.fullAddress}</span>
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
