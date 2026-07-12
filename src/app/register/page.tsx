import type { Metadata } from "next";
import { RegisterPage } from "./register-page";

export const metadata: Metadata = {
  title: "Register - Evently",
};

export default function Register() {
  return <RegisterPage />;
}
