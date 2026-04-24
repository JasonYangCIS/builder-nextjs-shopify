import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductByHandle, listProductHandles } from "@/lib/shopify/product";
import ProductDetail from "@/components/shopify/ProductDetail/ProductDetail";
import { env } from "@/lib/env";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const handles = await listProductHandles(50);
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const variant = product.variants[0];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      url: `${env.APP_ORIGIN}/products/${product.handle}`,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: variant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/collections/all" className="hover:underline">Products</Link></li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{product.title}</li>
        </ol>
      </nav>
      <ProductDetail product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
