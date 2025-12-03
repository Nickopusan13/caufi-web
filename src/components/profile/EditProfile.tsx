"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetCurrentUser, useUpdateUserProfile } from "@/hooks/useLogin";

type Gender = "male" | "female" | "other";

export const EditProfile = ({ onClose }: { onClose: () => void }) => {
  const { data: user, isPending: loadingUser } = useGetCurrentUser();
  const mutation = useUpdateUserProfile();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<Gender>("other");
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setGender((user.gender as Gender) ?? "other");
      setBirthday(user.birthday ? new Date(user.birthday) : undefined);
    }
  }, [user]);
  const isDirty =
    name !== (user?.name ?? "") ||
    phoneNumber !== (user?.phoneNumber ?? "") ||
    gender !== ((user?.gender as Gender) ?? "other") ||
    (birthday?.toISOString().split("T")[0] ?? null) !==
      (user?.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : null);
  const handleClose = useCallback(() => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) {
      return;
    }
    onClose();
  }, [isDirty, onClose]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        gender,
        birthday: birthday ? birthday.toISOString().split("T")[0] : undefined,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };
  const handleGenderChange = (value: string) => {
    setGender(value as Gender);
  };
  if (loadingUser) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl py-10"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-5 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <DialogTitle className="text-3xl font-bold bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Update your personal information
              </p>
            </motion.div>
          </DialogHeader>
          <div className="px-5 space-y-7 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto space-y-2"
            >
              <Label className="text-base font-semibold">Full Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-14 text-lg text-center rounded-2xl font-medium"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-5"
            >
              <Label className="text-base font-semibold block text-center">
                Gender
              </Label>
              <RadioGroup value={gender} onValueChange={handleGenderChange}>
                <div className="flex justify-center gap-10">
                  {(["male", "female", "other"] as const).map((g, idx) => (
                    <motion.div
                      key={g}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <RadioGroupItem value={g} id={g} />
                      <Label
                        htmlFor={g}
                        className="cursor-pointer text-lg capitalize"
                      >
                        {g}
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-md mx-auto space-y-2"
            >
              <Label className="text-base font-semibold">Phone Number *</Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0873 6229 164"
                className="h-14 text-center text-lg font-medium rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-md mx-auto"
            >
              <Label className="text-base font-semibold">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-14 justify-start text-left font-normal mt-3 rounded-2xl text-base",
                      !birthday && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-blue-500" />
                    {birthday
                      ? format(birthday, "PPP")
                      : "Select your birthday"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-2xl shadow-xl"
                  align="center"
                >
                  <Calendar
                    mode="single"
                    selected={birthday}
                    onSelect={setBirthday}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-5 pt-8"
            >
              <Button
                type="submit"
                disabled={mutation.isPending || !isDirty}
                className="flex-1 h-14 text-lg font-bold rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-14 text-lg font-medium rounded-2xl border-2"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
