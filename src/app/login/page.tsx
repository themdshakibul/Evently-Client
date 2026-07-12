import type { Metadata } from "next";
import { LoginPage } from "./login-page";

export const metadata: Metadata = {
  title: "Login - Evently",
};

export default function Login() {
  return <LoginPage />;
}
