import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "POSI System - Sign In",
  description: "Sign In page for POSI System",
};

export default function SignIn() {
  return <SignInForm />;
}
