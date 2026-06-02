import Link from "next/link";
import { Button } from "@jasonyangcis/core-ui";

export default function LoginButton({ label = "Log in" }: { label?: string | null }) {
  return (
    <Button asChild variant="outline">
      <Link href="/api/auth/login">{label ?? "Log in"}</Link>
    </Button>
  );
}
