"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
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
      let matchCategory = true;
      if (selectedCategory !== "All") {
        matchCategory = article.category.toLowerCase().includes(selectedCategory.toLowerCase());
      }

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
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-24 pb-20">
      {/* ─── 1. EDITORIAL HEADER BANNER ─── */}
      <section className="border-b border-[#E8E8E8] pb-12 sm:pb-16">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
              Journal &amp; Dispatches
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0A0A] mb-4">
              Automotive Insights
            </h1>
            <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
              Perspectives on engineering, luxury car acquisition, pre-owned due diligence, and market analysis.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. FEATURED ARTICLE ─── */}
      {featuredArticle && (
        <section className="py-12 sm:py-16 border-b border-[#E8E8E8]">
          <Container>
            <div className="mb-4">
              <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block">
                Featured Article
              </span>
            </div>

            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-6 sm:p-8 hover:border-[#0A0A0A]/30 transition-colors"
            >
              {/* Photo */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#FAFAFA]">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#0A0A0A]/80 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" strokeWidth={1.5} />
                    {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#6B6B6B]" strokeWidth={1.5} />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-medium text-[#0A0A0A] leading-tight group-hover:underline">
                  {featuredArticle.title}
                </h2>

                <p className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[#0A0A0A]">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ─── 3. CATEGORY TABS & SEARCH BAR ─── */}
      <section className="py-8">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8]">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-medium transition-colors py-2 px-3.5 rounded-lg cursor-pointer ${
                      isActive
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-white text-[#6B6B6B] hover:text-[#0A0A0A] border border-[#E8E8E8]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6B6B]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. ARTICLES 3-COLUMN GRID ─── */}
      <section className="py-6 sm:py-10">
        <Container>
          {displayedArticles.length === 0 ? (
            <div className="py-16 text-center bg-[#FAFAFA] rounded-xl border border-dashed border-[#E8E8E8] space-y-3">
              <p className="text-sm font-medium text-[#0A0A0A]">
                No articles found matching your criteria.
              </p>
              <p className="text-xs text-[#6B6B6B]">
                Try adjusting your search terms or selecting &ldquo;All&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-2 px-4 py-2 bg-[#0A0A0A] text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col bg-white rounded-xl border border-[#E8E8E8] overflow-hidden hover:border-[#0A0A0A]/30 transition-colors"
                >
                  <Link href={`/blog/${article.slug}`} className="block">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAFA]">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded bg-[#0A0A0A]/80 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#6B6B6B]" strokeWidth={1.5} />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6B6B6B]" strokeWidth={1.5} />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Headline */}
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-base font-medium text-[#0A0A0A] group-hover:underline leading-snug line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-3 mb-5">
                      {article.excerpt}
                    </p>

                    {/* Footer link */}
                    <div className="mt-auto pt-4 border-t border-[#E8E8E8]">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A0A0A] group-hover:gap-2 transition-all"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
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
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-6 py-3 rounded-lg bg-[#0A0A0A] hover:opacity-90 text-white font-medium text-xs tracking-wide transition-opacity cursor-pointer"
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
