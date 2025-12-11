import { Suspense } from "react";
import ResetPasswordInput from "@/components/login/reset-password/ResetPasswordInput";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInput />
    </Suspense>
  );
}
