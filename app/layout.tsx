import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import SilenceScriptTagWarning from "@/components/util/SilenceScriptTagWarning/SilenceScriptTagWarning";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: { default: "Builder Shop", template: "%s · Builder Shop" },
  description: "Headless storefront powered by Builder.io and Shopify.",
  metadataBase: new URL(process.env.APP_ORIGIN ?? "http://localhost:3000"),
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Builder Shop",
  url: process.env.APP_ORIGIN ?? "http://localhost:3000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} h-full`}
    >
      <body>
        <SilenceScriptTagWarning />
        <div className="atmosphere" aria-hidden="true" />
        <div className="glyph-strip glyph-strip--left" aria-hidden="true">
          <div className="glyph-strip__inner">
            {"⌁ ▰ ◉ ⟁ ⌬ ⊹ ✦ ⟁ ▰ ⌁ ◉ ⌬ ✦ ⟁ ⌁ ⊹ ▰ ◉ ⌬ ⟁ ✦ ⌁ ▰ ◉ ⟁ ⌬ ⊹ ✦ ⟁ ▰ ⌁ ◉ ⌬ ✦ ⟁ ⌁ ⊹ ▰ ◉ ⌬ ⟁ ✦ ".repeat(2)}
          </div>
        </div>
        <div className="site-shell">
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Header />
          <main id="main-content" className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-14">
            {children}
          </main>
          <Footer />
        </div>
        {/* Render JSON-LD as raw HTML to avoid React 19's script-element warning.
            Crawlers parse this from the DOM; it doesn't need to execute. */}
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<script type="application/ld+json">${JSON.stringify(orgJsonLd)}</script>`,
          }}
        />
      </body>
    </html>
  );
}
