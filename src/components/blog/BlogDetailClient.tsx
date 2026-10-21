"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  Check,
  Phone,
  ArrowRight,
} from "lucide-react";
import { BlogArticle, BLOG_ARTICLES } from "@/lib/data/blog-articles";
import Container from "@/components/ui/Container";
import CarCtaBanner from "@/components/blog/CarCtaBanner";

interface BlogDetailClientProps {
  article: BlogArticle;
}

export default function BlogDetailClient({ article }: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);

  // Related articles (exclude current)
  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-white text-[#0A0A0A] pt-24 pb-20">
      {/* ─── 1. BREADCRUMBS & TOP BAR ─── */}
      <div className="border-b border-[#E8E8E8] pb-4 mb-8">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#6B6B6B]">
              <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#0A0A0A] transition-colors">Journal</Link>
              <span>/</span>
              <span className="text-[#0A0A0A] truncate max-w-[240px] sm:max-w-md">
                {article.title}
              </span>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-medium text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Back to Articles</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* ─── 2. ARTICLE HEADER ─── */}
      <header className="pb-10 sm:pb-14">
        <Container className="max-w-4xl">
          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-2.5 py-1 rounded bg-[#0A0A0A] text-white text-[11px] font-medium tracking-wide">
              {article.category}
            </span>

            <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#0A0A0A] tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Lead Excerpt */}
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-8 pb-8 border-b border-[#E8E8E8]">
            {article.excerpt}
          </p>

          {/* Author Strip & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-medium text-xs">
                A
              </div>
              <div>
                <span className="text-xs font-medium text-[#0A0A0A] block">
                  Aston Editorial Desk
                </span>
                <span className="text-[11px] text-[#6B6B6B]">
                  Client Advisory Team
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8E8E8] bg-white hover:bg-[#FAFAFA] text-[#0A0A0A] text-xs font-medium transition-colors cursor-pointer"
                title="Copy article link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-emerald-700 font-medium">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#6B6B6B]" strokeWidth={1.5} />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* ─── 3. HERO COVER IMAGE ─── */}
      <section className="pb-12 sm:pb-16">
        <Container className="max-w-5xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-xl overflow-hidden bg-[#FAFAFA] border border-[#E8E8E8]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover object-center"
            />
          </div>
        </Container>
      </section>

      {/* ─── 4. ARTICLE BODY CONTENT ─── */}
      <section className="pb-16 sm:pb-24">
        <Container className="max-w-3xl">
          <div className="space-y-10 sm:space-y-12">
            {article.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-medium text-[#0A0A0A] tracking-tight">
                  {section.heading}
                </h2>

                {section.paragraph && (
                  <p className="text-base text-[#6B6B6B] leading-relaxed">
                    {section.paragraph}
                  </p>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-lg border border-[#E8E8E8]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div className="text-sm text-[#6B6B6B] leading-relaxed">
                          <strong className="text-[#0A0A0A] font-medium block mb-0.5">
                            {bullet.label}
                          </strong>
                          <span>{bullet.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Concierge Inquiry Box */}
          <div className="mt-14 p-6 sm:p-8 bg-[#FAFAFA] rounded-xl border border-[#E8E8E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1 max-w-md">
              <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block">
                Direct Inquiries
              </span>
              <h3 className="text-base font-medium text-[#0A0A0A]">
                Have questions regarding this topic or a specific motorcar?
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Connect with our automotive client desk at +1 448 226 4666.
              </p>
            </div>

            <a
              href="tel:+14482264666"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0A0A0A] text-white font-medium text-xs tracking-wide hover:opacity-90 transition-opacity shrink-0"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>+1 448 226 4666</span>
            </a>
          </div>
        </Container>
      </section>

      {/* ─── 5. RECOMMENDED ARTICLES ─── */}
      {relatedArticles.length > 0 && (
        <section className="py-14 sm:py-20 border-t border-[#E8E8E8] bg-[#FAFAFA]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-1">
                  Further Reading
                </span>
                <h2 className="text-2xl font-medium text-[#0A0A0A] tracking-tight">
                  Recommended Articles
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
              >
                <span>All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.slug}
                  className="group flex flex-col bg-white rounded-xl border border-[#E8E8E8] overflow-hidden hover:border-[#0A0A0A]/30 transition-colors"
                >
                  <Link href={`/blog/${rel.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAFA]">
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded bg-[#0A0A0A]/80 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">
                          {rel.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B] mb-2">
                      <span>{rel.date}</span>
                      <span>•</span>
                      <span>{rel.readTime}</span>
                    </div>

                    <Link href={`/blog/${rel.slug}`}>
                      <h3 className="text-sm font-medium text-[#0A0A0A] group-hover:underline line-clamp-2 mb-2 leading-snug">
                        {rel.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#6B6B6B] line-clamp-2 mb-4">
                      {rel.excerpt}
                    </p>

                    <div className="mt-auto pt-3 border-t border-[#E8E8E8]">
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A0A0A] group-hover:gap-2 transition-all"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 6. CAR CTA BANNER ─── */}
      <CarCtaBanner />
    </article>
  );
}
