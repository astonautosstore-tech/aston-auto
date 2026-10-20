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
  BookOpen
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
    <article className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. BREADCRUMBS & TOP BAR ─── */}
      <div className="bg-[#F9FAFB] border-b border-neutral-200 py-3.5">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-neutral-900">Journal &amp; News</Link>
              <span>/</span>
              <span className="text-neutral-900 font-semibold truncate max-w-[280px] sm:max-w-md">
                {article.title}
              </span>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-bold text-neutral-900 hover:text-neutral-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* ─── 2. ARTICLE HEADER ─── */}
      <header className="py-10 sm:py-16 bg-white">
        <Container className="max-w-4xl">
          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-md bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>

            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Lead Excerpt */}
          <p className="text-base sm:text-xl text-neutral-600 leading-relaxed font-normal mb-8 pb-8 border-b border-neutral-200">
            {article.excerpt}
          </p>

          {/* Author Strip & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Aston Editorial Desk
                </span>
                <span className="text-[11px] text-neutral-500">
                  Beverly Hills Automotive Advisory
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 bg-[#F9FAFB] hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors"
                title="Copy article link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Share Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* ─── 3. HERO COVER IMAGE ─── */}
      <section className="pb-10 sm:pb-14">
        <Container className="max-w-5xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
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
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                  {section.heading}
                </h2>

                {section.paragraph && (
                  <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                    {section.paragraph}
                  </p>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl border border-neutral-200"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                          <strong className="text-neutral-950 font-bold block mb-0.5">
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

          {/* Dealership Author & Advice Box */}
          <div className="mt-14 p-6 sm:p-8 bg-[#F9FAFB] rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1 max-w-md">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                Direct Dealership Inquiries
              </span>
              <h3 className="text-lg font-bold text-neutral-950">
                Have questions regarding this topic or vehicle acquisition?
              </h3>
              <p className="text-xs text-neutral-600">
                Connect with our Beverly Hills automotive desk at +1 448 226 4666.
              </p>
            </div>

            <a
              href="tel:+14482264666"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+1 448 226 4666</span>
            </a>
          </div>
        </Container>
      </section>

      {/* ─── 5. RECOMMENDED ARTICLES ─── */}
      {relatedArticles.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#F9FAFB] border-t border-neutral-200">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                  Further Reading
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                  Recommended Articles
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 hover:text-neutral-600"
              >
                <span>All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.slug}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link href={`/blog/${rel.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold">
                          {rel.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-2">
                      <span>{rel.date}</span>
                      <span>•</span>
                      <span>{rel.readTime}</span>
                    </div>

                    <Link href={`/blog/${rel.slug}`}>
                      <h3 className="text-base font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors line-clamp-2 mb-2">
                        {rel.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-4">
                      {rel.excerpt}
                    </p>

                    <div className="mt-auto pt-3 border-t border-neutral-100">
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 group-hover:gap-2 transition-all"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" />
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
