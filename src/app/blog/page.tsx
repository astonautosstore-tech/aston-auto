import { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Automotive News, Insights & Buying Guides | Aston",
  description: "Insights, buying guides, and engineering trends from the world of luxury, exotic, and high-performance automobiles.",
};

export default function BlogPage() {
  return <BlogClient />;
}
