import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import CarDetailClient from "@/components/cars/CarDetailClient";
import { Car, Comment } from "@/types/database";
import { formatUSD } from "@/lib/utils";

export const dynamicParams = true;
export const revalidate = 60;

interface CarPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
    const publicClient = createPublicClient();
    const { data: cars } = await publicClient
      .from("cars")
      .select("slug");

    return (cars || []).map((car: { slug: string }) => ({
      slug: car.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const publicClient = createPublicClient();
  const { data: rawCar } = await publicClient
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  const car = rawCar as Car | null;

  if (!car) {
    return {
      title: "Vehicle Not Found | Aston",
    };
  }

  const priceFormatted = formatUSD(car.discount_price ?? car.price);

  return {
    title: `${car.year} ${car.title} | Aston`,
    description: `Acquire the ${car.title} (${priceFormatted}) at Aston Beverly Hills. ${car.horsepower} HP, 0-60 mph in ${car.acceleration_0_100}s, ${car.color}. Available with certified inspection and nationwide enclosed delivery.`,
    openGraph: {
      title: `${car.title} — Aston`,
      description: car.description,
      images: [
        {
          url: car.hero_image,
          width: 1200,
          height: 630,
          alt: car.title,
        },
      ],
    },
  };
}

export default async function CarDetailPage({ params }: CarPageProps) {
  const { slug } = await params;
  const publicClient = createPublicClient();

  const { data: rawCar } = await publicClient
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  const car = rawCar as Car | null;

  if (!car) {
    notFound();
  }

  const [allCarsRes, commentsRes] = await Promise.all([
    publicClient.from("cars").select("*").neq("id", car.id).limit(3),
    publicClient.from("comments").select("*").eq("car_id", car.id).eq("status", "approved").order("created_at", { ascending: false }),
  ]);

  const similarCars = (allCarsRes.data as Car[]) || [];
  const comments = (commentsRes.data as Comment[]) || [];

  // Structured JSON-LD schema for automotive SEO in USD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.title,
    image: car.hero_image,
    description: car.description,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model,
    vehicleModelDate: car.year,
    itemCondition: "https://schema.org/UsedCondition",
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: car.discount_price ?? car.price,
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "AutoDealer",
        name: "Aston",
        address: "450 North Rodeo Drive, Beverly Hills, CA 90210",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetailClient car={car} comments={comments} similarCars={similarCars} />
    </>
  );
}
