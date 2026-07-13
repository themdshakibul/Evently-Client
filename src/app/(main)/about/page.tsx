import type { Metadata } from "next";
import { AboutPage } from "./about-page";

export const metadata: Metadata = {
  title: "About - Evently",
  description: "Learn about Evently - your ultimate event hub for creating, discovering, and managing events.",
};

export default function About() {
  return <AboutPage />;
}
