import LoginRegisterChange from "@/components/login/LoginRegisterChange";
import LoginSection from "@/components/login/LoginSec";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login & Register",
  description: "Welcome to CAUFI.",
};

export default function LoginPage() {
  return (
    <>
      <LoginSection />
    </>
  );
}
