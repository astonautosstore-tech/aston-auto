"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogArticle, BLOG_ARTICLES } from "@/lib/data/blog-articles";
import { soundEngine } from "@/lib/sound";
import CarCtaBanner from "@/components/blog/CarCtaBanner";

interface BlogDetailClientProps {
  article: BlogArticle;
}

export default function BlogDetailClient({ article }: BlogDetailClientProps) {
  // Related articles (exclude current)
  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <article className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-20 sm:pt-24">
      {/* ─── 1. FULL-WIDTH HERO COVER IMAGE ─── */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[620px] overflow-hidden bg-[#0A0A0A]">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none" />
      </div>

      {/* ─── 2. ARTICLE CONTENT CONTAINER ─── */}
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 relative z-10">
        
        {/* Meta Row: Badge & Date */}
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-wider shadow-lg">
            {article.category}
          </span>
          <span className="font-mono text-xs text-[#8A8A8A]">
            {article.date}
          </span>
        </div>

        {/* Article Main Headline */}
        <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-white leading-[1.2] tracking-tight mb-12 sm:mb-16">
          {article.title}
        </h1>

        {/* Editorial Sections */}
        <div className="space-y-10 sm:space-y-12 pb-16 sm:pb-24 border-b border-white/[0.08]">
          {article.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                {section.heading}
              </h2>

              {section.paragraph && (
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-[1.75] font-sans">
                  {section.paragraph}
                </p>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-3.5 pt-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start text-sm sm:text-base text-[#B0B0B0] leading-[1.7]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 mt-2.5 mr-3 flex-shrink-0" />
                      <span>
                        <strong className="text-white font-semibold">
                          {bullet.label}:
                        </strong>{" "}
                        {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ─── 3. MORE ARTICLES SECTION ─── */}
        <div className="mt-16 sm:mt-20">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              More Articles
            </h2>

            <Link
              href="/blog"
              onClick={() => soundEngine.playHoverTick()}
              className="px-5 py-2.5 rounded-sm border border-white/20 hover:border-white text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-white/5 cursor-pointer"
            >
              View All Articles
            </Link>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                onClick={() => soundEngine.playHoverTick()}
                className="group relative block aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-white/30 transition-all duration-500 shadow-xl"
              >
                <Image
                  src={rel.coverImage}
                  alt={rel.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider">
                    {rel.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#E10600] transition-colors leading-snug mb-1">
                    {rel.title}
                  </h3>
                  <span className="font-mono text-[11px] text-[#8A8A8A]">
                    {rel.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ─── 4. CAR CTA BANNER ─── */}
      <CarCtaBanner />
    </article>
  );
}
