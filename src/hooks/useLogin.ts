import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserRegister,
  fetchUserLogin,
  fetchUserResetPasswordRequest,
  fetchUserResetPassword,
  getUserById,
  getCurrentUser,
  userLogout,
  updateUserAddress,
  updateUserProfile,
  PlaceDetails,
  mapsGeocode,
  mapsAutocomplete,
  createUserAddress,
  mapsReverseGeocoding,
} from "@/api/user";
import toast from "react-hot-toast";
import type {
  UserLogin,
  UserRegister,
  UserProfileOut,
  UserToken,
  UserProfile,
  UserAddressUpdate,
  AutocompleteResponse,
  UserAddressOut,
  UserAddress,
  ReverseGeocodingResponse,
} from "@/api/user";
import { useRouter } from "next/navigation";

export function useRegister(onToggle: () => void) {
  return useMutation<UserProfileOut, Error, UserRegister>({
    mutationFn: fetchUserRegister,
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
    onSuccess: () => {
      toast.success("Registration Success, Please Login");
      if (onToggle) onToggle();
    },
  });
}

export function useCreateAddress() {
  return useMutation<UserAddressOut, Error, UserAddress>({
    mutationFn: createUserAddress,
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
    onSuccess: () => {
      toast.success("Address Created!!!");
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<UserToken, Error, UserLogin>({
    mutationFn: fetchUserLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
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
      toast.success("Done Reset Password!!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useGetUserById(userId: number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
}

export function useGetCurrentUser() {
  return useQuery<UserProfile>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}

export function useUserLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      toast.success("Logout Done!!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      toast.success("Update Done!!");
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: number;
      data: UserAddressUpdate;
    }) => updateUserAddress(addressId, data),
    onSuccess: () => {
      toast.success("Address updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update address");
    },
  });
}

export function usePlaceDetails(placeId: string) {
  return useQuery<PlaceDetails>({
    queryKey: ["placeDetails", placeId],
    queryFn: () => mapsGeocode(placeId),
    enabled: !!placeId,
  });
}

export function usePlaceAutocomplete(input: string) {
  return useQuery<AutocompleteResponse>({
    queryKey: ["placeAutocomplete", input],
    queryFn: () => mapsAutocomplete(input),
    enabled: !!input,
  });
}

export function useReverseGeocoding(lat: number | null, lng: number | null) {
  const enabled = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
  return useQuery<ReverseGeocodingResponse>({
    queryKey: ["reverseGeocoding", lat, lng],
    queryFn: () => mapsReverseGeocoding(lat!, lng!), // non-null assertion safe because of `enabled`
    enabled,
  });
}
