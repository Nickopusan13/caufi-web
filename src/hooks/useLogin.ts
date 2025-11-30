import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserRegister, fetchUserLogin } from "@/api/user";
import toast from "react-hot-toast";
import type {
  UserLogin,
  UserRegister,
  UserProfileOut,
  UserToken,
} from "@/api/user";

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
