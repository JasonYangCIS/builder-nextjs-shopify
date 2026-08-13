// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import CompareCardsClient from "./CompareCardsClient";
import type { CompareCardItem } from "./CompareCards.types";
import type { Product } from "@/lib/shopify/types";

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill,
    ...rest
  }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    void fill;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

const items: CompareCardItem[] = [
  {
    image: "https://cdn.shopify.com/s/files/1/0000/0000/files/trail.jpg",
    imageAlt: "Trail shoe",
    label: "Trail",
    productHandle: "trail-shoe",
    sidebarContent: "<p>More about the trail shoe.</p>",
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0000/0000/files/runner.jpg",
    imageAlt: "Runner shoe",
    label: "Runner",
    productHandle: null,
    sidebarContent: null,
  },
];

const product: Product = {
  id: "1",
  handle: "trail-shoe",
  title: "Trail Shoe",
  description: "",
  descriptionHtml: "",
  featuredImage: {
    url: "https://cdn.shopify.com/s/files/1/0000/0000/files/trail.jpg",
    altText: "Trail shoe",
    width: 800,
    height: 800,
  },
  images: [],
  options: [],
  priceRange: {
    minVariantPrice: { amount: "120.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "120.00", currencyCode: "USD" },
  },
  variants: [],
  tags: [],
  productType: "Shoes",
  availableForSale: true,
};

describe("CompareCardsClient", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    global.fetch = vi.fn(
      async () => new Response(JSON.stringify({ products: [product] }), { status: 200 }),
    ) as unknown as typeof fetch;
  });

  it("renders a card per item", () => {
    render(<CompareCardsClient items={items} />);
    expect(screen.getByText("Trail")).toBeTruthy();
    expect(screen.getByText("Runner")).toBeTruthy();
  });

  it("opens the sidebar and shows fetched product data on click", async () => {
    render(<CompareCardsClient items={items} />);
    fireEvent.click(screen.getByText("Trail").closest("button")!);

    await waitFor(() => expect(screen.getByText("Trail Shoe")).toBeTruthy());
    expect(global.fetch).toHaveBeenCalledWith("/api/products?handle=trail-shoe");
  });

  it("skips the product fetch and renders sidebar content when no handle is set", () => {
    render(<CompareCardsClient items={items} />);
    fireEvent.click(screen.getByText("Runner").closest("button")!);

    expect(screen.queryByText("Loading...")).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
