# SigilForge

Interactive 3D xenotechnical sigil rendered entirely in SVG. Supports drag-to-rotate, scroll-to-zoom, resonance charge buildup, and a full detonation/wreckage phase sequence.

## Quick usage

```tsx
import SigilForge from "@/components/marketing/SigilForge/SigilForge";

// All props are optional — the component is fully self-contained.
<SigilForge
  eyebrow="⌁ § Sigil Forge / interactive artifact"
  heading="Drag to commune."
  headingAccent="commune"
  body="A live xenotechnical sigil. Drag to rotate. Scroll to lean closer."
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `eyebrow` | `string` | `"⌁ § Sigil Forge / interactive artifact"` | Small label rendered above the heading. |
| `heading` | `string` | `"Drag to commune."` | Main heading text. |
| `headingAccent` | `string` | `"commune"` | Substring of `heading` that is highlighted with `<em>`. Case-insensitive match. |
| `body` | `string` | *(instructional copy)* | Body copy below the heading. Newlines are converted to `<br />`. |

No other props are accepted. All interaction state (rotation, zoom, charge, phase) is managed internally.

## Interactions

| Input | Effect |
|---|---|
| Pointer drag | Rotates the sigil; accumulates resonance charge while held. |
| Scroll wheel | Zooms between `0.6×` and `1.8×`. |
| Auto-spin toggle | Enables continuous slow rotation (pauses during drag). |
| Recenter button | Resets rotation to the default orientation. |

## Control panel

The right-hand panel exposes three selector groups:

- **Frequency** — Schumann / Gamma / Verdant / Xeno-Peak. Affects animation speed and particle density.
- **Hue** — Cryo (cyan) / Nocturne (violet) / Ember (amber). Recolors the entire sigil.
- **Geometry** — Tetrahedron / Octahedron / Icosahedron. Swaps the wireframe lattice.

## Phase state machine

```
idle → warn (charge ≥ 55%) → critical (charge ≥ 100%) → detonating → wreckage → rebooting → idle
```

| Phase | Trigger | Visible effect |
|---|---|---|
| `idle` | Default | Normal animation. |
| `warn` | Charge ≥ 55% | "LATTICE OVERHEATING" banner; amber charge meter. |
| `critical` | Charge ≥ 100% | "CONTAINMENT BREACH IMMINENT" banner; red charge meter. |
| `detonating` | 1.4 s in `critical` while still dragging | Sigil explodes into 64 physics-simulated shards. |
| `wreckage` | 1.9 s after detonation | Wreckage overlay with detonation count; Reboot button. |
| `rebooting` | Reboot pressed | 1.2 s fade-back before returning to `idle`. |

Detonation count is persisted in `localStorage` under the key `xcs.sf.detonations`.

## File structure

```
SigilForge/
├── SigilForge.tsx          — Root component; fans state out to parts
├── SigilForge.types.ts     — SigilForgeProps, Phase, Shard, Rotation, preset IDs
├── SigilForge.constants.ts — SF_HUES, SF_FREQS, SF_GEOMETRIES, SF_GLYPHS, SF_STORAGE_KEY
├── SigilForge.geometry.ts  — Vec3, PolyData, getPolyhedron(), rotatePoint()
├── SigilForge.module.scss  — All component styles
├── useSigilForge.ts        — All volatile state + RAF loop + pointer/wheel handlers
└── parts/
    ├── ChargeMeter.tsx     — Resonance charge bar (color changes per phase)
    ├── ControlPanel.tsx    — Frequency / hue / geometry selectors + telemetry
    ├── ForgeHeader.tsx     — Eyebrow, heading, body, readout strip
    ├── ShardField.tsx      — Detonation shard animation (only in "detonating")
    ├── SigilSvg.tsx        — SVG canvas; assembles the five SVG sub-layers
    ├── StageChrome.tsx     — Corners, glow, chips, hint, scan-line
    ├── WarningBanner.tsx   — Warn/critical phase banner
    ├── WreckageOverlay.tsx — Post-detonation screen + reboot button
    └── svg/
        ├── Core.tsx        — Central node with rotating outlines and crosshair
        ├── GlyphRing.tsx   — Exotic-glyph ring (computeGlyphRing)
        ├── OrbitalRings.tsx — Animated dashed ellipses
        ├── ParticleLayer.tsx — Depth-sorted orbiting particles (back + front)
        └── Polyhedron.tsx  — 3D wireframe (depth-based opacity)
```

## Important constraints

- **Single instance only.** Do not render more than one `<SigilForge />` per page. Each instance runs its own `requestAnimationFrame` loop and shares the same `localStorage` key.
- **Client component.** The interactive stage is gated behind a mounted flag (SSR-safe via `useSyncExternalStore`). The static heading renders on the server; the SVG stage renders only on the client.
- **No external state required.** Do not pass interaction callbacks or phase state as props — the component is intentionally self-contained.

## Builder.io

`SigilForge` is registered in `builder-registry.ts` as a drag-and-drop marketing component. The four text props are editable directly in the Builder visual editor.

## Extended docs

Full API reference, theming details, and accessibility notes live in [`design-system-docs/SigilForge.mdx`](../../../../design-system-docs/SigilForge.mdx).
