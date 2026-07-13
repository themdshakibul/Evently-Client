import type { Metadata } from "next";
import { PrivacyPage } from "./privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy - Evently",
};

export default function Privacy() {
  return <PrivacyPage />;
}
