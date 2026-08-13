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
  options: [{ name: "Size", values: ["8", "9"] }],
  priceRange: {
    minVariantPrice: { amount: "120.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "140.00", currencyCode: "USD" },
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "8",
      availableForSale: true,
      quantityAvailable: 5,
      price: { amount: "120.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [{ name: "Size", value: "8" }],
      image: null,
    },
    {
      id: "gid://shopify/ProductVariant/2",
      title: "9",
      availableForSale: true,
      quantityAvailable: 2,
      price: { amount: "140.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [{ name: "Size", value: "9" }],
      image: null,
    },
  ],
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

  it("lets the shopper pick a variant and updates the price", async () => {
    render(<CompareCardsClient items={items} />);
    fireEvent.click(screen.getByText("Trail").closest("button")!);

    await waitFor(() => expect(screen.getByText("Trail Shoe")).toBeTruthy());
    expect(screen.getByText("$120.00")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(screen.getByText("$140.00")).toBeTruthy();
  });

  it("skips the product fetch and renders sidebar content when no handle is set", () => {
    render(<CompareCardsClient items={items} />);
    fireEvent.click(screen.getByText("Runner").closest("button")!);

    expect(screen.queryByText("Loading...")).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
