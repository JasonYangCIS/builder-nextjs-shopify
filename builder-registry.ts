import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens/BuilderDesignTokens";

import ProductGridClient from "@/components/shopify/ProductGrid/ProductGridClient";
import ProductGridSelectedClient from "@/components/shopify/ProductGridSelected/ProductGridSelectedClient";
import ProductCardClient from "@/components/shopify/ProductCard/ProductCardClient";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import LoginButton from "@/components/shopify/LoginButton/LoginButton";
import OrderHistoryList from "@/components/shopify/OrderHistoryList/OrderHistoryList";
import HeroSplit from "@/components/marketing/HeroSplit/HeroSplit";
import HeroCentered from "@/components/marketing/HeroCentered/HeroCentered";
import { announcementBarConfig } from "@jasonyangcis/core-ui/components/AnnouncementBar/AnnouncementBar.builder";
import FaqList from "@/components/marketing/FaqList/FaqList";
import SigilForge from "@/components/marketing/SigilForge/SigilForge";

export const customComponents: RegisteredComponent[] = [
  {
    component: ProductGridClient,
    name: "ProductGrid",
    inputs: [
      { name: "heading", type: "string" },
      { name: "collectionHandle", type: "string", helperText: "Shopify collection handle (optional)" },
      { name: "query", type: "string", helperText: "Storefront search query (optional)" },
      { name: "limit", type: "number", defaultValue: 12 },
    ],
  },
  {
    component: ProductGridSelectedClient,
    name: "ProductGridSelected",
    inputs: [
      { name: "heading", type: "string" },
      {
        name: "handles",
        type: "list",
        subFields: [
          {
            name: "shopifyProductHandle",
            type: "ShopifyProductHandle",
            helperText: "Shopify product handle, e.g. the-inventory-not-tracked-snowboard",
          },
        ],
      },
    ],
  },
  {
    component: HeroSplit,
    name: "HeroSplit",
    inputs: [
      { name: "eyebrow", type: "string" },
      { name: "heading", type: "string", required: true },
      { name: "headingAccent", type: "string", helperText: "Substring of heading rendered with violet accent" },
      { name: "body", type: "longText" },
      { name: "ctaLabel", type: "string" },
      { name: "ctaHref", type: "url" },
      { name: "secondaryCtaLabel", type: "string" },
      { name: "secondaryCtaHref", type: "url" },
      { name: "imageUrl", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
      { name: "imageAlt", type: "string" },
      { name: "headingLevel", type: "string", enum: ["h1", "h2"], defaultValue: "h1" },
      { name: "imagePosition", type: "string", enum: ["left", "right"], defaultValue: "right" },
      { name: "frameLabel", type: "string", helperText: "Top-left chrome label, e.g. FIELD REPORT 014" },
      { name: "frameFootLeft", type: "string", helperText: "Bottom-left chrome label" },
      { name: "frameFootRight", type: "string", helperText: "Bottom-right chrome label" },
    ],
  },
  {
    component: HeroCentered,
    name: "HeroCentered",
    inputs: [
      { name: "heading", type: "string", required: true },
      { name: "body", type: "longText" },
      { name: "ctaLabel", type: "string" },
      { name: "ctaHref", type: "url" },
      { name: "headingLevel", type: "string", enum: ["h1", "h2"], defaultValue: "h1" },
    ],
  },
  announcementBarConfig,
  {
    component: FaqList,
    name: "FaqList",
    inputs: [
      { name: "heading", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "question", type: "string" },
          { name: "answerHtml", type: "richText" },
        ],
      },
    ],
  },
  {
    component: ProductCardClient,
    name: "ProductCard",
    inputs: [
      {
        name: "productHandle",
        type: "string",
        required: true,
        helperText: "Shopify product handle, e.g. obsidian-amulet",
      },
    ],
  },
  {
    component: InventoryBadge,
    name: "InventoryBadge",
    inputs: [
      { name: "availableForSale", type: "boolean", defaultValue: true },
      { name: "quantityAvailable", type: "number" },
      { name: "lowStockThreshold", type: "number", defaultValue: 5 },
    ],
  },
  {
    component: LoginButton,
    name: "LoginButton",
    inputs: [{ name: "label", type: "string", defaultValue: "Log in" }],
  },
  {
    component: OrderHistoryList,
    name: "OrderHistoryList",
    inputs: [],
  },
  {
    component: SigilForge,
    name: "SigilForge",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "⌁ § Sigil Forge / interactive artifact" },
      { name: "heading", type: "string", defaultValue: "Drag to commune." },
      { name: "headingAccent", type: "string", defaultValue: "commune", helperText: "Substring of heading rendered with cyan glow accent" },
      { name: "body", type: "longText", defaultValue: "A live xenotechnical sigil — drawn from the same lattice as every artifact in the catalogue.\nDrag to rotate. Scroll to lean closer. Cycle the frequency." },
    ],
  },
];
