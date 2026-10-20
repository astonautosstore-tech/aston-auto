"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/data/blog-articles";
import Container from "@/components/ui/Container";
import CarCtaBanner from "@/components/blog/CarCtaBanner";
import { storeApi } from "@/lib/supabase/client";

const CATEGORIES = [
  "All",
  "Expert Advice",
  "Buyer's Guide",
  "Financing",
  "Technology",
  "Safety Tips",
] as const;

export default function BlogClient() {
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    async function loadLiveArticles() {
      try {
        const live = await storeApi.getArticles();
        if (live && live.length > 0) {
          setArticles(live);
        }
      } catch (err) {
        console.warn("Failed to load live articles:", err);
      }
    }

    loadLiveArticles();

    const handleUpdate = () => {
      loadLiveArticles();
    };

    window.addEventListener("aston_articles_updated", handleUpdate);
    return () => window.removeEventListener("aston_articles_updated", handleUpdate);
  }, []);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const gridArticles = articles.filter((a) => a.slug !== featuredArticle?.slug);

  const filteredArticles = useMemo(() => {
    return gridArticles.filter((article) => {
      // Category match
      let matchCategory = true;
      if (selectedCategory !== "All") {
        matchCategory = article.category.toLowerCase().includes(selectedCategory.toLowerCase());
      }

      // Search query match
      let matchSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchSearch =
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.category.toLowerCase().includes(q);
      }

      return matchCategory && matchSearch;
    });
  }, [gridArticles, selectedCategory, searchQuery]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. EDITORIAL HEADER BANNER ─── */}
      <section className="bg-[#F9FAFB] border-b border-neutral-200 py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-neutral-800" />
              <span>Dealership Journal &amp; Market Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight mb-3">
              Automotive News &amp; Insights
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Explore market trends, supercar engineering analysis, pre-owned buyer guides, and ownership advice authored by our automotive specialists.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. FEATURED ARTICLE HERO CARD ─── */}
      {featuredArticle && (
        <section className="py-10 sm:py-14 bg-white border-b border-neutral-100">
          <Container>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-4">
              Featured Story
            </span>

            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F9FAFB] border border-neutral-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
            >
              {/* Photo */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-200">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md bg-neutral-950 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 group-hover:text-neutral-700 transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-950 group-hover:gap-3 transition-all">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ─── 3. CATEGORY TABS & SEARCH BAR ─── */}
      <section className="py-8 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F9FAFB] p-3 sm:p-4 rounded-xl border border-neutral-200">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs sm:text-sm font-semibold transition-all py-2 px-3.5 rounded-lg cursor-pointer ${
                      isActive
                        ? "bg-neutral-950 text-white shadow-sm"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-lg border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. ARTICLES 3-COLUMN GRID ─── */}
      <section className="py-8 sm:py-12">
        <Container>
          {displayedArticles.length === 0 ? (
            <div className="py-16 text-center bg-[#F9FAFB] rounded-2xl border border-dashed border-neutral-300 space-y-3">
              <p className="text-base font-semibold text-neutral-800">
                No articles matched your criteria.
              </p>
              <p className="text-xs text-neutral-500">
                Try selecting &ldquo;All&rdquo; or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-2 px-4 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/blog/${article.slug}`} className="block">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Headline */}
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors leading-snug line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-5">
                      {article.excerpt}
                    </p>

                    {/* Footer link */}
                    <div className="mt-auto pt-4 border-t border-neutral-100">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 group-hover:gap-2 transition-all"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredArticles.length && (
            <div className="text-center mt-12 sm:mt-16">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-8 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Load More Articles
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ─── 5. CAR CTA BANNER ─── */}
      <CarCtaBanner />
    </div>
  );
}
