import type { Metadata } from "next";
import { ContactPage } from "./contact-page";

export const metadata: Metadata = {
  title: "Contact - Evently",
  description: "Get in touch with the Evently team. We'd love to hear from you.",
};

export default function Contact() {
  return <ContactPage />;
}
