import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, listCollectionHandles } from "@/lib/shopify/product";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const handles = await listCollectionHandles(50);
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description?.slice(0, 160),
    alternates: { canonical: `/collections/${collection.handle}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = await getCollection(handle, 24);
  if (!collection) notFound();
  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-muted-foreground">{collection.description}</p>
        )}
      </header>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collection.products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
