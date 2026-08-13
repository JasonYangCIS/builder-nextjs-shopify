// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { ComponentProps, ImgHTMLAttributes } from "react";
import CompareCards from "./CompareCards";

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

type Items = ComponentProps<typeof CompareCards>["items"];

describe("CompareCards", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when items is null", () => {
    const { container } = render(<CompareCards items={null} />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders nothing when items is not an array", () => {
    // Simulates a malformed Builder payload before the field is set correctly.
    render(<CompareCards items={{} as unknown as Items} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("filters out null/undefined entries in the items list", () => {
    const items = [
      null,
      undefined,
      {
        image: "https://cdn.shopify.com/s/files/1/0000/0000/files/a.jpg",
        imageAlt: "A",
        label: "A",
        productHandle: null,
        sidebarContent: null,
      },
    ] as unknown as Items;
    render(<CompareCards items={items} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("falls back to a placeholder image and default label for a blank item", () => {
    render(<CompareCards items={[{}] as unknown as Items} />);
    expect(screen.getByText("Untitled")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
