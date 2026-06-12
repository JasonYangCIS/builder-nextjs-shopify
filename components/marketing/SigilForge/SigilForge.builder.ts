import type { RegisteredComponent } from "@builder.io/sdk-react";
import SigilForge from "./SigilForge";

export const sigilForgeConfig: RegisteredComponent = {
  component: SigilForge,
  name: "SigilForge",
  inputs: [
    { name: "eyebrow", type: "string", defaultValue: "⌁ § Sigil Forge / interactive artifact" },
    { name: "heading", type: "string", defaultValue: "Drag to commune." },
    { name: "headingAccent", type: "string", defaultValue: "commune", helperText: "Substring of heading rendered with cyan glow accent" },
    { name: "body", type: "longText", defaultValue: "A live xenotechnical sigil — drawn from the same lattice as every artifact in the catalogue.\nDrag to rotate. Scroll to lean closer. Cycle the frequency." },
  ],
};
