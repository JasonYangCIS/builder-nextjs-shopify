export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Builder Shop — sandbox storefront.</p>
        <p>Powered by Builder.io + Shopify</p>
      </div>
    </footer>
  );
}
