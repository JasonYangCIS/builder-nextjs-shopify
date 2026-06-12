import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens/BuilderDesignTokens";

import { productGridConfig } from "@/components/shopify/ProductGrid/ProductGrid.builder";
import { productGridSelectedConfig } from "@/components/shopify/ProductGridSelected/ProductGridSelected.builder";
import { productCardConfig } from "@/components/shopify/ProductCard/ProductCard.builder";
import { inventoryBadgeConfig } from "@/components/shopify/InventoryBadge/InventoryBadge.builder";
import { loginButtonConfig } from "@/components/shopify/LoginButton/LoginButton.builder";
import { orderHistoryListConfig } from "@/components/shopify/OrderHistoryList/OrderHistoryList.builder";
import { heroSplitConfig } from "@/components/marketing/HeroSplit/HeroSplit.builder";
import { heroCenteredConfig } from "@/components/marketing/HeroCentered/HeroCentered.builder";
import { faqListConfig } from "@/components/marketing/FaqList/FaqList.builder";
import { sigilForgeConfig } from "@/components/marketing/SigilForge/SigilForge.builder";
import { announcementBarConfig } from "@jasonyangcis/core-ui/components/AnnouncementBar/AnnouncementBar.builder";

export const customComponents: RegisteredComponent[] = [
  productGridConfig,
  productGridSelectedConfig,
  heroSplitConfig,
  heroCenteredConfig,
  announcementBarConfig,
  faqListConfig,
  productCardConfig,
  inventoryBadgeConfig,
  loginButtonConfig,
  orderHistoryListConfig,
  sigilForgeConfig,
];
