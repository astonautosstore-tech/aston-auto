import { Metadata } from "next";
import { notFound } from "next/navigation";
import { storeApi } from "@/lib/supabase/client";
import { SEED_CARS } from "@/lib/data/seed-cars";
import CarDetailClient from "@/components/cars/CarDetailClient";

interface CarPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_CARS.map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await storeApi.getCarBySlug(slug);

  if (!car) {
    return {
      title: "Vehicle Not Found | Aston Auto Stores",
    };
  }

  const priceFormatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(car.discount_price ?? car.price).replace("NGN", "₦");

  return {
    title: `${car.year} ${car.title} | Aston Auto Stores Nigeria`,
    description: `Acquire the ${car.title} (${priceFormatted}) at Aston Auto Stores. ${car.horsepower} HP, 0-100 in ${car.acceleration_0_100}s, ${car.color}. Available for immediate delivery in Lagos and Abuja.`,
    openGraph: {
      title: `${car.title} — Aston Auto Stores`,
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
  const car = await storeApi.getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const allCars = await storeApi.getCars();
  const comments = await storeApi.getComments(car.id);
  const similarCars = allCars.filter((c) => c.id !== car.id).slice(0, 3);

  // Structured JSON-LD schema for automotive SEO
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
    itemCondition: "https://schema.org/NewCondition",
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: car.discount_price ?? car.price,
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "AutoDealer",
        name: "Aston Auto Stores",
        address: "14 Alexander Avenue, Ikoyi, Lagos, Nigeria",
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
