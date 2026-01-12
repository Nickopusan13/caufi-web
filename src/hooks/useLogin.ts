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
  createVerifyEmail,
  fetchContactCaufi,
  addUploadImages,
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
  ContactCaufi,
} from "@/api/user";
import { useRouter } from "next/navigation";

export function useRegister(onToggle: () => void) {
  return useMutation<UserProfileOut, Error, UserRegister>({
    mutationFn: fetchUserRegister,
    onError: () => {
      toast.error("Registration failed");
    },
    onSuccess: () => {
      toast.success("Registration Success, Please Login");
      if (onToggle) onToggle();
    },
  });
}

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => createVerifyEmail(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCreateAddress() {
  return useMutation<UserAddressOut, Error, UserAddress>({
    mutationFn: createUserAddress,
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

export function useAddImageProfile() {
  return useMutation<UserProfileOut, Error, { file: File }>({
    mutationFn: ({ file }) => addUploadImages(file),
  });
}

export function useContactCaufi() {
  return useMutation<{ message: string }, Error, ContactCaufi>({
    mutationFn: fetchContactCaufi,
    onSuccess: () => {
      toast.success("Email send");
    },
    onError: () => {
      toast.error("Error sending email");
    },
  });
}

export function useForgotPasswordRequest() {
  return useMutation({
    mutationFn: fetchUserResetPasswordRequest,
    onSuccess: () => {
      toast.success("Password reset link sent! Check your email.");
    },
    onError: () => {
      toast.error("Error, please try again.");
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: fetchUserResetPassword,
    onSuccess: () => {
      router.push("/login");
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
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}

export function useUserLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
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
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
    queryFn: () => mapsReverseGeocoding(lat!, lng!),
    enabled,
  });
}
