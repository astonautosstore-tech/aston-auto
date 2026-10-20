import { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Automotive Insights & Tips | Aston Auto",
  description: "Insights, stories, and trends from the world of high-end automobiles, supercars, and automotive engineering.",
};

export default function BlogPage() {
  return <BlogClient />;
}
