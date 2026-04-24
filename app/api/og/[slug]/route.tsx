import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
          padding: 48,
          textAlign: "center",
        }}
      >
        {decodeURIComponent(slug).replace(/-/g, " ")}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
