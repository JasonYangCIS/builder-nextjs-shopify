import type { Metadata } from "next";
import OrderHistoryList from "@/components/shopify/OrderHistoryList/OrderHistoryList";
import LoginButton from "@/components/shopify/LoginButton/LoginButton";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <LoginButton />
      </header>
      <section>
        <h2 className="text-xl font-semibold">Recent orders</h2>
        <div className="mt-4">
          <OrderHistoryList />
        </div>
      </section>
    </section>
  );
}
