import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white text-[#0A0A0A] flex items-center justify-center pt-28 pb-20">
      <Container className="text-center max-w-xl">
        <span className="text-xs uppercase tracking-[0.2em] text-[#6B6B6B] block mb-3">
          404 &bull; Page Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#0A0A0A] mb-4">
          Vehicle or page not found.
        </h1>
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
          The requested vehicle, article, or resource may have been acquired, relocated, or is no longer in active showroom rotation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/inventory"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
          >
            Browse Inventory
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium transition-colors hover:bg-[#FAFAFA]"
          >
            Return Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
