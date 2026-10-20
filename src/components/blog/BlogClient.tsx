"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/data/blog-articles";
import { soundEngine } from "@/lib/sound";
import CarCtaBanner from "@/components/blog/CarCtaBanner";

const CATEGORIES = [
  "All",
  "Buying Tips",
  "Financing",
  "Technology",
  "Maintenance",
  "Leadership",
] as const;

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(4);

  const featuredArticle = BLOG_ARTICLES.find((a) => a.featured) || BLOG_ARTICLES[0];
  const gridArticles = BLOG_ARTICLES.filter((a) => a.slug !== featuredArticle.slug);

  const filteredArticles = gridArticles.filter((article) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Buying Tips") return article.category === "Buyer's Guide" || article.category === "Expert Advice";
    return article.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 sm:pt-36 pb-16 selection:bg-[#E10600] selection:text-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── 1. TOP HEADER SECTION ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-white/[0.08]">
          <div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.08]">
              Automotive <br />
              Insights &amp; Tips
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xs md:text-right leading-relaxed font-sans">
            Insights, stories, and trends from the world of high-end automobiles.
          </p>
        </div>

        {/* ─── 2. FEATURED SPLIT HERO CARD ─── */}
        <div className="mt-8 sm:mt-12">
          <Link
            href={`/blog/${featuredArticle.slug}`}
            onClick={() => soundEngine.playHoverTick()}
            className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-white/30 transition-all duration-500 shadow-2xl"
          >
            {/* Split Duo Visual Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 relative aspect-[16/10] sm:aspect-[21/9] w-full">
              {/* Left Panel */}
              <div className="relative h-full w-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </div>

              {/* Right Panel with subtle color harmony */}
              <div className="relative h-full w-full overflow-hidden hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                  alt="Drivetrain comparison"
                  fill
                  sizes="50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90 hue-rotate-15"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Badge Top Left */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-wider shadow-lg">
                  {featuredArticle.category}
                </span>
              </div>

              {/* Title & Date Bottom Left Overlay */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-xl z-20">
                <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white group-hover:text-[#E10600] transition-colors leading-tight mb-2">
                  {featuredArticle.title}
                </h2>
                <span className="font-mono text-xs text-[#8A8A8A]">
                  {featuredArticle.date}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* ─── 3. OUR LATEST NEWS & ARTICLE HEADER + CATEGORY TABS ─── */}
        <div className="mt-16 sm:mt-24 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white leading-tight">
                Our Latest <br />
                News &amp; Article
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEngine.playHoverTick();
                      setSelectedCategory(cat);
                    }}
                    className={`text-xs uppercase tracking-wider font-semibold transition-all py-1.5 px-3 rounded-md cursor-pointer ${
                      isActive
                        ? "text-white bg-white/10 border border-white/20"
                        : "text-[#777] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 4. 2x2 ARTICLE GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {displayedArticles.map((article, idx) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  onClick={() => soundEngine.playHoverTick()}
                  className="group relative block aspect-[16/11] sm:aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-white/30 transition-all duration-500 shadow-xl"
                >
                  {/* Full Cover Image */}
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark gradient for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

                  {/* Category Badge top-left */}
                  <div className="absolute top-5 left-5 z-20">
                    <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Title & Date bottom */}
                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <h3 className="font-display font-bold text-base sm:text-lg md:text-xl text-white group-hover:text-[#E10600] transition-colors leading-snug mb-1.5">
                      {article.title}
                    </h3>
                    <span className="font-mono text-xs text-[#8A8A8A]">
                      {article.date}
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredArticles.length && (
            <div className="text-center mt-12 sm:mt-16">
              <button
                onClick={() => {
                  soundEngine.playHoverTick();
                  setVisibleCount((prev) => prev + 2);
                }}
                className="inline-block px-7 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ─── 5. CAR CTA BANNER ─── */}
      <CarCtaBanner />
    </div>
  );
}
