import { Suspense } from "react";
import ResetPasswordInput from "@/components/login/reset-password/ResetPasswordInput";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInput />
    </Suspense>
  );
}
