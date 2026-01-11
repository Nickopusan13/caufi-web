import { Suspense } from "react";
import ResetPasswordInput from "@/components/login/reset-password/ResetPasswordInput";
import LoadingPage from "@/components/LoadingPage";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ResetPasswordInput />
    </Suspense>
  );
}
