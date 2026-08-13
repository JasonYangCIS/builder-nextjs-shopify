import type { RegisteredComponent } from "@builder.io/sdk-react";
import "@/components/builder/BuilderDesignTokens/BuilderDesignTokens";

import { productGridConfig } from "@/components/shopify/ProductGrid/ProductGrid.builder";
import { productGridSelectedConfig } from "@/components/shopify/ProductGridSelected/ProductGridSelected.builder";
import { productCardConfig } from "@/components/shopify/ProductCard/ProductCard.builder";
import { compareCardsConfig } from "@/components/shopify/CompareCards/CompareCards.builder";
import { inventoryBadgeConfig } from "@/components/shopify/InventoryBadge/InventoryBadge.builder";
import { loginButtonConfig } from "@/components/shopify/LoginButton/LoginButton.builder";
import { orderHistoryListConfig } from "@/components/shopify/OrderHistoryList/OrderHistoryList.builder";
import { heroSplitConfig } from "@/components/marketing/HeroSplit/HeroSplit.builder";
import { heroCenteredConfig } from "@/components/marketing/HeroCentered/HeroCentered.builder";
import { faqListConfig } from "@/components/marketing/FaqList/FaqList.builder";
import { sigilForgeConfig } from "@/components/marketing/SigilForge/SigilForge.builder";
import { announcementBarConfig } from "@jasonyangcis/core-ui/components/AnnouncementBar/AnnouncementBar.builder";
import { createBlogEditorialBuilderConfigs } from "@jasonyangcis/core-ui/builder";
import BlogRichText from "@/components/blog/BlogRichText/BlogRichText";
import { config } from "@/config";
import { groupComponents } from "@/utils/register-insert-menu";

const blogEditorialConfigs = groupComponents(
  "Blog editorial",
  createBlogEditorialBuilderConfigs({
    all: {
      models: [config.models.blogPost],
      meta: { insertMenuGroup: "Blog editorial" },
    },
    blogRichText: { component: BlogRichText },
  }),
);

export const customComponents: RegisteredComponent[] = [
  productGridConfig,
  productGridSelectedConfig,
  heroSplitConfig,
  heroCenteredConfig,
  announcementBarConfig,
  faqListConfig,
  productCardConfig,
  compareCardsConfig,
  inventoryBadgeConfig,
  loginButtonConfig,
  orderHistoryListConfig,
  sigilForgeConfig,
  ...blogEditorialConfigs,
];
