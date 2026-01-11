import VerifyEmail from "@/components/login/verify-email/VerifyEmail";
import LoadingPage from "@/components/LoadingPage";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <VerifyEmail />
    </Suspense>
  );
}
