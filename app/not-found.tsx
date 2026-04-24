import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">We couldn’t find the page you’re looking for.</p>
      <Link href="/" className="underline">Back home</Link>
    </section>
  );
}
