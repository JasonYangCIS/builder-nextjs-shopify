"use client";

import dynamic from "next/dynamic";
import type { RenderBuilderContentProps } from "./RenderBuilderContent/RenderBuilderContent";

const RenderBuilderContent = dynamic(
  () => import("./RenderBuilderContent/RenderBuilderContent"),
  { ssr: false },
);

export default function ClientOnlyBuilderContent(props: RenderBuilderContentProps) {
  return <RenderBuilderContent {...props} />;
}
