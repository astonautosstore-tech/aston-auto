"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

const ARTICLES = [
  {
    category: "Supercar Engineering",
    date: "November 2024",
    title: "V12 Naturally Aspirated vs. Hybrid Hypercars: The Collector's Dilemma in West Africa",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Financial Structuring",
    date: "October 2024",
    title: "Strategic Asset Allocation: Leveraging Exotic Vehicles as Tangible High-Yield Portfolios",
    img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function NewsArticles() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section ref={ref} className="bg-[#050505] border-t border-white/[0.06]">
      <Container>
        {/* Header row: Left heading, Right paragraph */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E10600]">
                Editorial Journal
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="font-display font-black text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-tight text-white leading-[1.08] [text-wrap:balance]"
            >
              News and{" "}
              <span
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.3) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Articles
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-[#8A8A8A] max-w-[360px] leading-relaxed"
          >
            Insights on luxury automotive trends, global auctions, and high-net-worth ownership in West Africa.
          </motion.p>
        </div>

        {/* 2-Column Articles Grid with gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 min-h-[360px] md:min-h-[420px] cursor-pointer shadow-xl bg-[#0D0D0D]"
            >
              <Image
                src={article.img}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                {/* Category & Date with 24px inner padding */}
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#E10600] text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                    {article.category}
                  </span>
                  <span className="text-xs text-white/60 font-mono tracking-wider">
                    {article.date}
                  </span>
                </div>

                {/* Bottom title & link */}
                <div className="flex items-end justify-between gap-4 pt-4 border-t border-white/15">
                  <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white leading-snug max-w-md group-hover:text-white transition-colors [text-wrap:balance]">
                    {article.title}
                  </h3>
                  <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#E10600] group-hover:border-[#E10600] group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
