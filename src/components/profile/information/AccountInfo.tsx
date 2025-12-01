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
import { useGetCurrentUser } from "@/hooks/useLogin";
import { Skeleton } from "@/components/ui/skeleton";

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
            username={user.name}
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
                : "Prefer not to say"
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
