"use client";
import useSWR from "swr";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";

interface MeResponse {
  authenticated: boolean;
  customer?: { firstName?: string; emailAddress?: { emailAddress?: string } };
}

const fetcher = async (url: string): Promise<MeResponse> => {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return { authenticated: false };
  return (await res.json()) as MeResponse;
};

export default function AccountMenu() {
  const { data } = useSWR<MeResponse>("/api/customer", fetcher, { revalidateOnFocus: false });
  if (!data?.authenticated) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/api/auth/login">Log in</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link href="/account" className="text-sm hover:underline">
        {data.customer?.firstName ?? data.customer?.emailAddress?.emailAddress ?? "Account"}
      </Link>
      <Button asChild variant="ghost" size="sm">
        <Link href="/api/auth/logout">Log out</Link>
      </Button>
    </div>
  );
}
