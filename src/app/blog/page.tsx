import type { Metadata } from "next";
import { BlogListPage } from "./blog-list-page";

export const metadata: Metadata = {
  title: "Blog - Evently",
  description: "Latest insights, tips, and guides for event organizers and attendees.",
};

export default function BlogList() {
  return <BlogListPage />;
}
