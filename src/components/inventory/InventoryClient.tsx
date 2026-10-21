"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { Car } from "@/types/database";
import Container from "@/components/ui/Container";
import { formatUSD } from "@/lib/utils";
import { storeApi } from "@/lib/supabase/client";

interface InventoryClientProps {
  initialCars: Car[];
}

function getStatusBadge(status: Car["status"]) {
  switch (status) {
    case "available":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
          Available
        </span>
      );
    case "reserved":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
          Reserved
        </span>
      );
    case "sold":
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F5F5F5] text-[#525252] border border-[#E5E5E5]">
          Sold
        </span>
      );
    default:
      return null;
  }
}

function InventoryContent({ initialCars }: InventoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<Car[]>(initialCars);

  // Read URL parameters
  const brandParam = searchParams.get("brand") || "All";
  const bodyTypeParam = searchParams.get("body_type") || "All";
  const searchParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const maxPriceParam = searchParams.get("max_price") || "";

  // Local state initialized from URL
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [selectedBodyType, setSelectedBodyType] = useState(bodyTypeParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [sortBy, setSortBy] = useState(sortParam);

  // Sync to URL
  const updateUrl = useCallback(
    (params: {
      q?: string;
      brand?: string;
      body_type?: string;
      max_price?: string;
      sort?: string;
    }) => {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.brand && params.brand !== "All") sp.set("brand", params.brand);
      if (params.body_type && params.body_type !== "All") sp.set("body_type", params.body_type);
      if (params.max_price) sp.set("max_price", params.max_price);
      if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);

      const qs = sp.toString();
      router.replace(qs ? `/inventory?${qs}` : "/inventory", { scroll: false });
    },
    [router]
  );

  // Listen to live inventory updates
  useEffect(() => {
    async function refreshCars() {
      try {
        const live = await storeApi.getCars();
        if (live && live.length > 0) setCars(live);
      } catch (err) {
        console.warn("Failed to load live cars:", err);
      }
    }
    refreshCars();
    const handleUpdate = () => refreshCars();
    window.addEventListener("aston_cars_updated", handleUpdate);
    return () => window.removeEventListener("aston_cars_updated", handleUpdate);
  }, []);

  // Filter options derived from data
  const brands = useMemo(() => {
    return ["All", ...Array.from(new Set(cars.map((c) => c.brand))).sort()];
  }, [cars]);

  const bodyTypes = useMemo(() => {
    return ["All", ...Array.from(new Set(cars.map((c) => c.body_type))).sort()];
  }, [cars]);

  // Filtering & Sorting
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const matchBrand = selectedBrand === "All" || car.brand === selectedBrand;
        const matchType = selectedBodyType === "All" || car.body_type === selectedBodyType;

        let matchSearch = true;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          matchSearch =
            car.title.toLowerCase().includes(q) ||
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q);
        }

        let matchPrice = true;
        if (maxPrice && !isNaN(Number(maxPrice))) {
          const price = car.discount_price ?? car.price;
          matchPrice = price <= Number(maxPrice);
        }

        return matchBrand && matchType && matchSearch && matchPrice;
      })
      .sort((a, b) => {
        const priceA = a.discount_price ?? a.price;
        const priceB = b.discount_price ?? b.price;
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "year_desc") return b.year - a.year;
        if (sortBy === "mileage_asc") return a.mileage - b.mileage;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [cars, selectedBrand, selectedBodyType, searchQuery, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("All");
    setSelectedBodyType("All");
    setMaxPrice("");
    setSortBy("newest");
    router.replace("/inventory", { scroll: false });
  };

  const hasActiveFilters =
    selectedBrand !== "All" ||
    selectedBodyType !== "All" ||
    searchQuery.trim().length > 0 ||
    maxPrice.trim().length > 0 ||
    sortBy !== "newest";

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-28 pb-24">
      {/* ─── Header ─── */}
      <section className="pb-12 border-b border-[#E8E8E8]">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
              Showroom Inventory
            </span>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#0A0A0A] mb-3">
              Available Motorcars
            </h1>
            <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
              Explore our verified collection of performance, luxury, and exotic motorcars. Each vehicle carries a documented title and is eligible for nationwide delivery.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── Filter Bar (URL-Synced) ─── */}
      <section className="py-6 border-b border-[#E8E8E8] bg-[#FAFAFA]">
        <Container>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search make, model, or year..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrl({
                    q: e.target.value,
                    brand: selectedBrand,
                    body_type: selectedBodyType,
                    max_price: maxPrice,
                    sort: sortBy,
                  });
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>

            {/* Filter Dropdowns & Inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  updateUrl({
                    q: searchQuery,
                    brand: e.target.value,
                    body_type: selectedBodyType,
                    max_price: maxPrice,
                    sort: sortBy,
                  });
                }}
                aria-label="Filter by brand"
                className="px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === "All" ? "All Makes" : b}
                  </option>
                ))}
              </select>

              {/* Body Type Filter */}
              <select
                value={selectedBodyType}
                onChange={(e) => {
                  setSelectedBodyType(e.target.value);
                  updateUrl({
                    q: searchQuery,
                    brand: selectedBrand,
                    body_type: e.target.value,
                    max_price: maxPrice,
                    sort: sortBy,
                  });
                }}
                aria-label="Filter by body type"
                className="px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              >
                {bodyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Body Types" : t}
                  </option>
                ))}
              </select>

              {/* Max Price input with plain number and $ prefix */}
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#6B6B6B]">$</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    updateUrl({
                      q: searchQuery,
                      brand: selectedBrand,
                      body_type: selectedBodyType,
                      max_price: e.target.value,
                      sort: sortBy,
                    });
                  }}
                  className="w-28 pl-7 pr-3 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrl({
                    q: searchQuery,
                    brand: selectedBrand,
                    body_type: selectedBodyType,
                    max_price: maxPrice,
                    sort: e.target.value,
                  });
                }}
                aria-label="Sort inventory"
                className="px-3.5 py-2.5 text-xs bg-white rounded-lg border border-[#E8E8E8] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest</option>
                <option value="mileage_asc">Mileage: Lowest</option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Inventory Grid ─── */}
      <section className="py-12 sm:py-16">
        <Container>
          {filteredCars.length === 0 ? (
            /* Empty State */
            <div className="py-24 text-center max-w-md mx-auto">
              <h3 className="text-xl font-medium text-[#0A0A0A] mb-2">
                No vehicles match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mb-6">
                Try widening your price range, clearing make filters, or contacting our concierge for incoming off-market allocations.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>
                  Showing {filteredCars.length} {filteredCars.length === 1 ? "vehicle" : "vehicles"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredCars.map((car) => {
                  const displayPrice = car.discount_price ?? car.price;
                  return (
                    <Link
                      key={car.id}
                      href={`/cars/${car.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden transition-all duration-300 hover:border-[#D4D4D4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                    >
                      {/* Photo */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAFA]">
                        {car.hero_image ? (
                          <Image
                            src={car.hero_image}
                            alt={`${car.year} ${car.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#6B6B6B]">
                            No Image
                          </div>
                        )}

                        <div className="absolute top-3.5 left-3.5">
                          {getStatusBadge(car.status)}
                        </div>

                        <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#0A0A0A] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1.5">
                          <span>{car.year} &bull; {car.brand}</span>
                          <span>{car.mileage ? `${car.mileage.toLocaleString()} mi` : "0 mi"}</span>
                        </div>

                        <h2 className="text-base sm:text-lg font-medium text-[#0A0A0A] line-clamp-1 mb-4">
                          {car.title}
                        </h2>

                        <div className="mt-auto pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] block">
                              Price
                            </span>
                            <span className="text-lg font-medium text-[#0A0A0A]">
                              {formatUSD(displayPrice)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors flex items-center gap-1">
                            View details
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </Container>
      </section>
    </div>
  );
}

export default function InventoryClient(props: InventoryClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-xs text-[#6B6B6B]">Loading inventory...</div>}>
      <InventoryContent {...props} />
    </Suspense>
  );
}
