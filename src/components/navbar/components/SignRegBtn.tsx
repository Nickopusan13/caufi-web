"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function SignRegBtn() {
  return (
    <div className="flex gap-2">
      <Button>Sign In</Button>
      <Button>Register</Button>
    </div>
  );
}
