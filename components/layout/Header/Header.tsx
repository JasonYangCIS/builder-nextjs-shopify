import Link from "next/link";
import CartDrawer from "@/components/shopify/CartDrawer/CartDrawer";
import AccountMenu from "@/components/layout/AccountMenu/AccountMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          Builder Shop
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm md:flex">
          <Link href="/collections/all" className="hover:underline">All products</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
          <Link href="/account" className="hover:underline">Account</Link>
        </nav>
        <div className="flex items-center gap-2">
          <AccountMenu />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
