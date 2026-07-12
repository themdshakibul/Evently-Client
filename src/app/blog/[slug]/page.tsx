import type { Metadata } from "next";
import { BlogDetailPage } from "./blog-detail-page";

export const metadata: Metadata = {
  title: "Blog Post - Evently",
};

export default function BlogDetail() {
  return <BlogDetailPage />;
}
