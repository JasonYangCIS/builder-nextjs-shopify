import Link from "next/link";
import Button from "@/components/ui/Button/Button";

export default function LoginButton({ label = "Log in" }: { label?: string | null }) {
  return (
    <Button asChild variant="outline">
      <Link href="/api/auth/login">{label ?? "Log in"}</Link>
    </Button>
  );
}
