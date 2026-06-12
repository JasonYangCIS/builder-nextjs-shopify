import type { RegisteredComponent } from "@builder.io/sdk-react";
import HeroSplit from "./HeroSplit";

export const heroSplitConfig: RegisteredComponent = {
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
};
