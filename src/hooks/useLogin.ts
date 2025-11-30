import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserRegister,
  fetchUserLogin,
  fetchUserResetPasswordRequest,
  fetchUserResetPassword,
} from "@/api/user";
import toast from "react-hot-toast";
import type {
  UserLogin,
  UserRegister,
  UserProfileOut,
  UserToken,
} from "@/api/user";
import { useRouter } from "next/navigation";

export function useRegister() {
  return useMutation<UserProfileOut, Error, UserRegister>({
    mutationFn: fetchUserRegister,
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
    onSuccess: (data: UserProfileOut) => {
      toast.success(`Welcome, ${data.name.split(" ")[0]}!`);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<UserToken, Error, UserLogin>({
    mutationFn: fetchUserLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      queryClient.setQueryData(["access_token"], data.accessToken);
    },
  });
}

export function useForgotPasswordRequest() {
  return useMutation({
    mutationFn: fetchUserResetPasswordRequest,
    onSuccess: () => {
      toast.success("Password reset link sent! Check your email.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: fetchUserResetPassword,
    onSuccess: () => {
      toast.success("Done!!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
