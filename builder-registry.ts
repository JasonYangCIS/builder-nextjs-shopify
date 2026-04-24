import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens/BuilderDesignTokens";

import ProductGrid from "@/components/shopify/ProductGrid/ProductGrid";
import ProductCard from "@/components/shopify/ProductCard/ProductCard";
import InventoryBadge from "@/components/shopify/InventoryBadge/InventoryBadge";
import LoginButton from "@/components/shopify/LoginButton/LoginButton";
import OrderHistoryList from "@/components/shopify/OrderHistoryList/OrderHistoryList";
import HeroSplit from "@/components/marketing/HeroSplit/HeroSplit";
import HeroCentered from "@/components/marketing/HeroCentered/HeroCentered";
import AnnouncementBar from "@/components/marketing/AnnouncementBar/AnnouncementBar";
import FaqList from "@/components/marketing/FaqList/FaqList";

export const customComponents: RegisteredComponent[] = [
  {
    component: ProductGrid,
    name: "ProductGrid",
    inputs: [
      { name: "heading", type: "string" },
      { name: "collectionHandle", type: "string", helperText: "Shopify collection handle (optional)" },
      { name: "query", type: "string", helperText: "Storefront search query (optional)" },
      { name: "limit", type: "number", defaultValue: 12 },
    ],
  },
  {
    component: HeroSplit,
    name: "HeroSplit",
    inputs: [
      { name: "eyebrow", type: "string" },
      { name: "heading", type: "string", required: true },
      { name: "body", type: "longText" },
      { name: "ctaLabel", type: "string" },
      { name: "ctaHref", type: "url" },
      { name: "imageUrl", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
      { name: "imageAlt", type: "string" },
      { name: "headingLevel", type: "string", enum: ["h1", "h2"], defaultValue: "h1" },
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
  {
    component: AnnouncementBar,
    name: "AnnouncementBar",
    inputs: [
      { name: "message", type: "string" },
      { name: "href", type: "url" },
    ],
  },
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
    component: ProductCard,
    name: "ProductCard",
    inputs: [{ name: "productHandle", type: "string", required: true }],
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
];
