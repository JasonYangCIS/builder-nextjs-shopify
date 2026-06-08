import type { Metadata } from "next";
import { Button, Badge, Card, Input, Label, AnnouncementBar } from "@jasonyangcis/core-ui";
import HeroSplit from "@/components/marketing/HeroSplit/HeroSplit";
import HeroCentered from "@/components/marketing/HeroCentered/HeroCentered";
import FaqList from "@/components/marketing/FaqList/FaqList";
import SigilForge from "@/components/marketing/SigilForge/SigilForge";
import PriceDisplay from "@/components/shopify/PriceDisplay/PriceDisplay";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import LoginButton from "@/components/shopify/LoginButton/LoginButton";
import DiscountCodeInput from "@/components/shopify/DiscountCodeInput/DiscountCodeInput";
import styles from "./page.module.scss";

const PLACEHOLDER_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F2ba2a4f70b3344978de5230adda60dd3%2F06376fd985e8499fb5b004850080dd09?format=webp&width=800&height=1200";

export const metadata: Metadata = {
  title: "Design Codex",
  description: "XENOSPHERE design system — tokens, typography, and components.",
};

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-20 pb-20">

      {/* ── Page hero ─────────────────────────────────────────── */}
      <section>
        <div className="t-eyebrow mb-4 flex items-center gap-3">
          <span className={styles.heroEyebrowRule} />
          XENOSPHERE / DESIGN CODEX / VOL. 01
        </div>
        <h1 className={`t-display ${styles.heroHeading}`}>
          Design<br />
          <span className={styles.heroAccent}>System</span>
        </h1>
        <p className={styles.heroBody}>
          Tokens, typography, and components for the XENOSPHERE aesthetic.
        </p>
      </section>

      {/* ── Color palette ─────────────────────────────────────── */}
      <Section title="Color Palette" num="01">
        <div className="flex flex-col gap-8">
          <ColorGroup label="Void — backgrounds" swatches={[
            { name: "--void-0", hex: "#06090f", label: "Deepest" },
            { name: "--void-1", hex: "#0a1018", label: "Page bg" },
            { name: "--void-2", hex: "#0d1420", label: "Panel" },
            { name: "--void-3", hex: "#131c2e", label: "Raised panel" },
            { name: "--void-4", hex: "#1a2740", label: "Border / divider" },
          ]} />
          <ColorGroup label="Bioluminescent — cyan" swatches={[
            { name: "--cyan-1", hex: "#1a8a8c", label: "Deep" },
            { name: "--cyan-2", hex: "#3dd9d6", label: "Primary accent" },
            { name: "--cyan-3", hex: "#7af0ee", label: "Glow highlight" },
          ]} />
          <ColorGroup label="Bioluminescent — violet" swatches={[
            { name: "--violet-1", hex: "#5e2db5", label: "Deep" },
            { name: "--violet-2", hex: "#a76bff", label: "Secondary accent" },
            { name: "--violet-3", hex: "#d6a8ff", label: "Glow highlight" },
          ]} />
          <ColorGroup label="Terrain — oxblood" swatches={[
            { name: "--terrain-1", hex: "#2a1420", label: "Deep" },
            { name: "--terrain-2", hex: "#5b2a3a", label: "Burgundy" },
            { name: "--terrain-3", hex: "#7d3c4d", label: "Warm dust" },
          ]} />
          <ColorGroup label="Ink — text" swatches={[
            { name: "--ink-0", hex: "#eaf6f5", label: "Primary" },
            { name: "--ink-1", hex: "#b8c8d4", label: "Secondary" },
            { name: "--ink-2", hex: "#6e7e90", label: "Tertiary / meta" },
          ]} />
          <ColorGroup label="Signal" swatches={[
            { name: "--xenosphere-success", hex: "#4ee0a8", label: "Success" },
            { name: "--xenosphere-danger",  hex: "#ff5a7a", label: "Danger" },
            { name: "--amber-1",            hex: "#d97f3a", label: "Amber signal" },
          ]} />
        </div>
      </Section>

      {/* ── Typography ────────────────────────────────────────── */}
      <Section title="Typography" num="02">
        <div className="flex flex-col gap-10">
          <div>
            <p className="t-eyebrow mb-4">Display — Orbitron</p>
            {[
              { size: "var(--t-5xl)", label: "5XL / 72px" },
              { size: "var(--t-4xl)", label: "4XL / 52px" },
              { size: "var(--t-3xl)", label: "3XL / 40px" },
              { size: "var(--t-2xl)", label: "2XL / 30px" },
              { size: "var(--t-xl)",  label: "XL / 24px" },
            ].map(({ size, label }) => (
              <div key={size} className={`flex items-baseline gap-6 py-3 ${styles.typeRow}`}>
                <span className={`t-display ${styles.typeDisplay}`} style={{ fontSize: size }}>
                  Alien Terrain
                </span>
                <span className={`t-mono ${styles.typeLabel}`}>{label}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="t-eyebrow mb-4">Body — Inter</p>
            {[
              { size: "var(--t-lg)", weight: 400, label: "LG / 20px Regular" },
              { size: "var(--t-md)", weight: 400, label: "MD / 16px Regular" },
              { size: "var(--t-sm)", weight: 400, label: "SM / 14px Regular" },
              { size: "var(--t-xs)", weight: 400, label: "XS / 12px Regular" },
            ].map(({ size, weight, label }) => (
              <div key={label} className={`flex items-baseline gap-6 py-3 ${styles.typeRow}`}>
                <span className={styles.typeBody} style={{ fontSize: size, fontWeight: weight }}>
                  The void whispers in frequencies beyond human range.
                </span>
                <span className={`t-mono ${styles.typeLabel}`}>{label}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="t-eyebrow mb-4">Mono — JetBrains Mono</p>
            {[
              { size: "var(--t-sm)", label: "SM / 14px" },
              { size: "var(--t-xs)", label: "XS / 12px" },
              { size: "var(--t-2xs)", label: "2XS / 11px" },
            ].map(({ size, label }) => (
              <div key={label} className={`flex items-baseline gap-6 py-3 ${styles.typeRow}`}>
                <span className={`t-mono ${styles.typeMono}`} style={{ fontSize: size }}>
                  SYS-4471 ◈ XENOSPHERE ⌁ BIOLUMINESCENT SIGNAL ACTIVE
                </span>
                <span className={`t-mono ${styles.typeLabel}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Buttons ───────────────────────────────────────────── */}
      <Section title="Buttons" num="03">
        <div className="flex flex-col gap-8">
          <div>
            <p className="t-eyebrow mb-4">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <p className="t-eyebrow mb-4">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">Large</Button>
              <Button size="default">Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon" aria-label="Icon button">◈</Button>
            </div>
          </div>
          <div>
            <p className="t-eyebrow mb-4">States</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Disabled</Button>
              <Button aria-busy="true">Loading…</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Badges ────────────────────────────────────────────── */}
      <Section title="Badges" num="04">
        <p className="t-eyebrow mb-4">Variants</p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">In stock</Badge>
          <Badge variant="secondary">Low stock</Badge>
          <Badge variant="destructive">Depleted</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
        </div>
      </Section>

      {/* ── Form elements ─────────────────────────────────────── */}
      <Section title="Form Elements" num="05">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-text">Text input</Label>
            <Input id="ds-text" placeholder="Enter artifact designation…" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-disabled">Disabled input</Label>
            <Input id="ds-disabled" placeholder="System offline" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-error">Error state</Label>
            <Input
              id="ds-error"
              placeholder="Invalid signal"
              aria-invalid="true"
              className={styles.errorInput}
            />
          </div>
        </div>
      </Section>

      {/* ── Cards ─────────────────────────────────────────────── */}
      <Section title="Cards" num="06">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <p className="t-eyebrow mb-2">Standard panel</p>
            <p className={styles.cardBody}>
              Default card using <code className={styles.cardCode}>--card</code> background with border.
            </p>
          </Card>

          <Card className={`p-6 ${styles.cardCyan}`}>
            <span className="corner-tl" />
            <span className="corner-br" />
            <p className={`t-eyebrow mb-2 ${styles.cardEyebrowCyan}`}>Cyan frame</p>
            <p className={styles.cardBody}>
              Glow border with corner brackets and inner shadow.
            </p>
          </Card>

          <Card className={`p-6 ${styles.cardViolet}`}>
            <span className="corner-tl corner-tl--violet" />
            <span className="corner-br corner-br--violet" />
            <p className={`t-eyebrow mb-2 ${styles.cardEyebrowViolet}`}>Violet frame</p>
            <p className={styles.cardBody}>
              Secondary accent variant using violet glow tokens.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── Shadows & glows ───────────────────────────────────── */}
      <Section title="Shadows & Glows" num="07">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Cyan SM",   shadow: "var(--glow-cyan-sm)",   border: "var(--cyan-line)" },
            { label: "Cyan MD",   shadow: "var(--glow-cyan-md)",   border: "var(--cyan-line)" },
            { label: "Cyan LG",   shadow: "var(--glow-cyan-lg)",   border: "var(--cyan-line)" },
            { label: "Violet SM", shadow: "var(--glow-violet-sm)", border: "var(--violet-line)" },
            { label: "Violet MD", shadow: "var(--glow-violet-md)", border: "var(--violet-line)" },
            { label: "Shadow LG", shadow: "var(--shadow-lg)",      border: "var(--border)" },
          ].map(({ label, shadow, border }) => (
            <div
              key={label}
              className={styles.glowTile}
              style={{ border: `1px solid ${border}`, boxShadow: shadow }}
            >
              <p className={`t-eyebrow ${styles.glowTileLabel}`}>{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Spacing ───────────────────────────────────────────── */}
      <Section title="Spacing Scale" num="08">
        <div className="flex flex-col gap-2">
          {[
            { token: "--s-1",  px: "4px" },
            { token: "--s-2",  px: "8px" },
            { token: "--s-3",  px: "12px" },
            { token: "--s-4",  px: "16px" },
            { token: "--s-6",  px: "24px" },
            { token: "--s-8",  px: "32px" },
            { token: "--s-10", px: "40px" },
            { token: "--s-12", px: "48px" },
            { token: "--s-16", px: "64px" },
          ].map(({ token, px }) => (
            <div key={token} className="flex items-center gap-4">
              <span className={`t-mono ${styles.spaceToken}`}>{token}</span>
              <div className={styles.spaceBar} style={{ width: px }} />
              <span className={`t-mono ${styles.spacePx}`}>{px}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Marketing components ──────────────────────────────── */}
      <Section title="Marketing Components" num="09">
        <div className="flex flex-col gap-12">
          <div>
            <p className="t-eyebrow mb-4">AnnouncementBar</p>
            <AnnouncementBar
              message="Free transit on all xenospheric relay orders over $200"
              href="/collections/relay"
            />
          </div>

          <div>
            <p className="t-eyebrow mb-4">HeroCentered</p>
            <div className={styles.componentFrame}>
              <HeroCentered
                eyebrow="XENOSPHERE / TRANSMISSION / VOL. 01"
                heading="Signal Acquired"
                body="Centered marketing hero with eyebrow, headline, body, and a primary call-to-action."
                ctaLabel="Begin Descent"
                ctaHref="#"
              />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">HeroSplit — default (image right)</p>
            <div className={styles.componentFrame}>
              <HeroSplit
                eyebrow="FIELD REPORT 013"
                heading="Resonant alloys for the descent."
                body="Two-column hero with image and CTA. Demonstrates the default right-aligned image position."
                ctaLabel="Acquire Artifact"
                ctaHref="#"
                imageUrl={PLACEHOLDER_IMAGE}
                imageAlt="Placeholder artifact"
              />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">HeroSplit — field report (image left, accent + secondary CTA)</p>
            <div className={styles.componentFrame}>
              <HeroSplit
                eyebrow="FIELD REPORT 014 — LIMITED"
                heading="The Nocturne drop is calibrated for Ridge Line."
                headingAccent="Nocturne"
                body="Resonant violet inlays harvested from Bagnetic Hadespeex deposits in sector 7741."
                ctaLabel="Acquire Nocturne →"
                ctaHref="#"
                secondaryCtaLabel="Read full report"
                secondaryCtaHref="#"
                imagePosition="left"
                imageUrl={PLACEHOLDER_IMAGE}
                imageAlt="Nocturne board"
                frameLabel="+ FIELD REPORT 014"
                frameFootLeft="NOCTURNE BLADE"
                frameFootRight="// 352"
              />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">FaqList</p>
            <FaqList
              heading="Transmission FAQ"
              items={[
                {
                  question: "What is the XENOSPHERE relay?",
                  answerHtml: "<p>A bioluminescent network broadcasting on frequencies beyond human range.</p>",
                },
                {
                  question: "How are artifacts authenticated?",
                  answerHtml: "<p>Each artifact is logged against its field report and sector coordinates.</p>",
                },
                {
                  question: "Can I return a depleted relic?",
                  answerHtml: "<p>Depleted relics may be exchanged within 30 cycles of acquisition.</p>",
                },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ── Commerce primitives ───────────────────────────────── */}
      <Section title="Commerce Primitives" num="10">
        <div className="flex flex-col gap-10">
          <div>
            <p className="t-eyebrow mb-4">PriceDisplay</p>
            <div className="flex flex-wrap items-center gap-8">
              <PriceDisplay price={{ amount: "129.00", currencyCode: "USD" }} />
              <PriceDisplay
                price={{ amount: "89.00", currencyCode: "USD" }}
                compareAtPrice={{ amount: "129.00", currencyCode: "USD" }}
              />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">InventoryBadge — variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <InventoryBadge availableForSale quantityAvailable={42} />
              <InventoryBadge availableForSale quantityAvailable={3} lowStockThreshold={5} />
              <InventoryBadge availableForSale={false} quantityAvailable={0} />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">LoginButton</p>
            <div className="flex flex-wrap items-center gap-3">
              <LoginButton />
              <LoginButton label="Enter the relay" />
            </div>
          </div>

          <div>
            <p className="t-eyebrow mb-4">DiscountCodeInput</p>
            <div className={styles.componentFrame}>
              <DiscountCodeInput />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Interactive artifact ──────────────────────────────── */}
      <Section title="Interactive Artifact" num="11">
        <div className="flex flex-col gap-4">
          <p className="t-eyebrow">SigilForge</p>
          <SigilForge />
        </div>
      </Section>

    </div>
  );
}

/* ── Section wrapper ──────────────────────────────────────── */
function Section({ title, num, children }: { title: string; num: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <span className={`t-mono ${styles.sectionNum}`}>§ {num}</span>
        <h2 className={`t-display ${styles.sectionHeading}`}>{title}</h2>
        <div className={styles.sectionRule} />
      </div>
      {children}
    </section>
  );
}

/* ── Color swatch group ───────────────────────────────────── */
function ColorGroup({ label, swatches }: { label: string; swatches: { name: string; hex: string; label: string }[] }) {
  return (
    <div>
      <p className="t-eyebrow mb-4">{label}</p>
      <div className="flex flex-wrap gap-4">
        {swatches.map(({ name, hex, label: swatchLabel }) => (
          <div key={name} className={styles.swatch}>
            <div className={styles.swatchTile} style={{ background: hex }} />
            <p className={`t-mono ${styles.swatchName}`}>{name}</p>
            <p className={`t-mono ${styles.swatchMeta}`}>{hex}</p>
            <p className={`t-mono ${styles.swatchMeta}`}>{swatchLabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
