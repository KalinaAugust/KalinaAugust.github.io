# Flores — Design System

This document is the **Single Source of Truth** for the visual identity, styling conventions, design tokens, and UX guidelines of the Flores landing page.

> Flores is a static single-page image site (сайт-визитка) for a flower shop. Plain HTML + CSS, no framework. The glassmorphism system is adapted from the Star Compass project, re-themed from a dark sci-fi palette to soft, warm beige.

---

## 1. Design Concept: Soft Beige Bloom

The visual identity is **warm, calm, and premium** — an image site for a flower boutique. A soft **beige background with a peach undertone**, layered with translucent **glassmorphism** panels and gentle warm highlights. Where the source theme felt like cold outer space, Flores feels like morning light through a florist's window: pastel, airy, tactile.

---

## 2. Color Palette & Tokens

All colors are defined as CSS variables in [assets/css/main.css](../assets/css/main.css) (linked globally from `index.html`). Always use these variables instead of hardcoding raw HEX/RGB values.

### 2.1 Backgrounds & Gradients
| CSS Variable | Value | Description |
| :--- | :--- | :--- |
| `--bg-gradient` | `linear-gradient(135deg, #f7efe6 0%, #f5e4d6 50%, #f9ebe0 100%)` | Global body gradient (warm beige with a peach drift) |
| `--surface-solid` | `#fdf6ee` | Solid opaque cream surface for modals and overlay cards |
| `--feature-gradient` | `radial-gradient(130% 90% at 50% 0%, #fbe9da 0%, #f6dcc8 45%, #efcdb5 100%)` | Warm peach backdrop for premium/featured surfaces |

### 2.2 Accents & Glows
| CSS Variable | Value | Description |
| :--- | :--- | :--- |
| `--accent-primary` | `#cf9a73` | Primary actions and key borders (warm terracotta-peach) |
| `--accent-hover` | `#bd855e` | Hover state for primary buttons/elements |
| `--accent-secondary`| `#e0b49a` | Secondary icons, labels, and highlights (soft rose-peach) |
| `--accent-yellow` | `#e8b04b` | Warm amber for warning/star accents |
| `--accent-glow` | `rgba(207, 154, 115, 0.35)` | Soft glow effect for borders and highlights |
| `--accent-gold` | `#c8a36a` | Warm gold — kicker/icon/border accent on premium surfaces |
| `--accent-gold-strong` | `#d8b87f` | Brighter gold for emphasized text (prices, active dot) |
| `--gold-gradient` | `linear-gradient(180deg, #d8b87f 0%, #b88f4f 100%)` | Gold fill for premium CTA buttons |

### 2.3 Typography Colors
| CSS Variable | Value | Description |
| :--- | :--- | :--- |
| `--text-primary` | `#4a3a30` | Headings, main button labels, primary text (warm cocoa) |
| `--text-secondary` | `rgba(74, 58, 48, 0.72)` | Body text, sub-labels, secondary metadata |
| `--text-muted` | `rgba(74, 58, 48, 0.55)` | Input placeholders, inactive states, footer text |
| `--text-highlight` | `#b06b42` | Focused items, active navigation links |

> **Light-glass contrast note:** unlike the dark source theme, Flores uses **dark warm text on light glass**. Keep text at `--text-primary` / `--text-secondary` over the beige surfaces for legibility.

---

## 3. Glassmorphism Styling

Cards, panels, and other container surfaces use a **Glassmorphism** approach to give a layered, floating feeling. On a light beige base, glass reads as **frosted cream** rather than smoked dark glass.

### 3.1 Glass Properties
| CSS Variable | Value | Description |
| :--- | :--- | :--- |
| `--glass-bg` | `rgba(255, 252, 248, 0.55)` | Frosted cream surface for outer shells |
| `--glass-bg-light` | `rgba(255, 252, 248, 0.35)` | Fill for nested surfaces (no backdrop-filter) |
| `--glass-border` | `rgba(255, 255, 255, 0.65)` | Bright white border simulating a glare edge |
| `--glass-blur` | `blur(12px) saturate(150%)` | Backdrop blur with warm saturation (default, flat backgrounds) |
| `--glass-bg-photo` | `rgba(255, 250, 244, 0.34)` | Low-opacity tint for glass over photos/complex backgrounds (§3.5) |
| `--glass-blur-photo` | `blur(8px) saturate(160%)` | Lighter blur for glass over photos/complex backgrounds (§3.5) |
| `--glass-cutout` | `rgba(196, 156, 120, 0.16)` | Pressed-in "well" fill for nested structural containers |
| `--glass-cutout-strong` | `rgba(180, 138, 100, 0.26)` | Deeper cutout fill for stronger inset emphasis |
| `--shadow-glass` | `0 20px 40px -15px rgba(150,110,80,0.3), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(150,110,80,0.08)` | Multi-layered shadow (warm outer shadow, top glare, soft bottom edge) |
| `--shadow-inset-cutout` | `inset 0 2px 4px rgba(150,110,80,0.2)` | Soft warm inset shadow that pushes an element inward (the "well") |

### 3.2 Standard Glass Container
```css
.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-glass);
  border-radius: var(--radius-xl);
}
```

### 3.3 Core Stacking & Layering Laws (The 5 Rules of Glass)
When building layouts with glassmorphism, transparencies and blurs multiply. A stacking mistake degrades readability, destroys hierarchy, and kills rendering performance. Follow these 5 strict rules:

1. **Material Alternation (Правило чередования материалов)**
   * Glass is a convex, raised surface. **Never nest glass directly inside glass.**
   * Alternate materials using the "cutout" well approach: `glass panel` (raised) → `cutout well` (pressed-in, no blur, warm-tinted) → `glass-light chip` (flat).
   * The eye reads depth as raised → cut out → raised. Two adjacent raised layers break the hierarchy.
   * **Implementation:** use `--glass-cutout` or `--glass-cutout-strong` combined with `--shadow-inset-cutout` for nested structural containers.

2. **Single Blur per Context (Один blur на стекинг-контекст)**
   * `backdrop-filter` must live **only** on the outermost shell/container.
   * Nested surfaces take a semi-transparent background (`--glass-bg-light` or `--glass-cutout`) **without** their own `backdrop-filter`.
   * *Why:* eliminates visual mud (double-blur) and prevents severe performance drops (nested backdrop-filters are one of the most expensive browser rendering operations).

3. **Depth Budget — Max 2 Glass Layers (Бюджет глубины)**
   * Beyond the second nested level, transparency stops conveying hierarchy. "Deeper than two glasses — become solid."
   * At the 3rd depth level and beyond, transition to opaque/near-opaque backgrounds (`--surface-solid`) to maintain text contrast.

4. **Borders Are Glare, Not Frames (Бордер только на верхнем крае)**
   * A light 1px border simulates light refraction on a raised glass edge.
   * On nested elements, **remove the outer light border** or replace it with an inner shadow (`--shadow-inset-cutout`).
   * *Why:* stacking multiple white borders makes the UI look like a basic HTML table, destroying the glass illusion.

5. **Transparency Ramp by Depth (Рамп прозрачности по глубине)**

| Depth Level | Material Concept | Target CSS Token |
| :--- | :--- | :--- |
| **L0 (Base)** | Global gradient background | `--bg-gradient` |
| **L1 (Outer Panel)** | Large glass panel + Blur + Border + Drop Shadow | `--glass-bg` |
| **L1 (Standalone Card)** | Floating standalone card + Blur + Border + Drop Shadow | `--glass-bg-light` |
| **L2 (Inside L1)** | Cutout well, inset shadow, warm fill, NO border | `--glass-cutout` |
| **L3 (Inside L2)** | Flat glass chip/input, light fill | `--glass-bg-light` |
| **L4 (Deepest)** | Opaque solid overlay / dense container | `--surface-solid` |

### 3.4 Shadow Formulas
* **Outer Panel Shadows (`--shadow-glass`):** soft warm outer drop shadow + crisp inner glare highlight on the top edge (`inset 0 1px 0 rgba(255,255,255,0.7)`) to simulate a 3D glass edge.
* **Cutout Shadows (`--shadow-inset-cutout`):** soft warm inset drop shadow that pushes the element inward, creating a well (`inset 0 2px 4px rgba(150,110,80,0.2)`).

### 3.5 Glass Over Photos / Complex Backgrounds

The default glass (`--glass-bg` at `0.55` opacity + `--glass-blur` 12px) is tuned for the **flat beige gradient** — there it reads as clean frosted cream. Over a **photo or busy background** (a flower image, dense foliage) that recipe washes the image into a near-solid blur: the high-opacity white fill is what kills the picture, not only the blur.

**The problem is opacity, not blur.** Busy backgrounds actually benefit from *some* blur to calm them; the fix for legibility is a **low-opacity tint** over the blur, not maxing out the blur. So for any surface sitting on an image or strong gradient, use the **photo variant**:

```html
<div class="glass-panel glass-panel--photo"> … </div>
```

It swaps in `--glass-bg-photo` (`rgba(255,250,244,0.34)` — ~34% tint) and `--glass-blur-photo` (`blur(8px) saturate(160%)`): the image reads through, colors stay lively, text stays legible.

Rules of thumb (industry practice):
- **Tint opacity 0.2–0.4** over a photo (we use ~0.34); **blur 8–16px** (we use 8). More blur calms a busier image; raise it before raising opacity.
- Keep **text contrast ≥ 4.5:1** (≥ 3:1 for large display). If a particular image leaves text weak, deepen the tint slightly or add a soft gradient/shadow behind the text — don't just crank the blur.
- Everything else (border-as-glare, single blur per context, depth budget, radii) stays per §3.3.

When the background is a flat color/gradient, use plain `.glass-panel` — the photo variant would look under-frosted there.

---

## 4. Typography

Two primary typefaces, loaded via Google Fonts (`<link>` in `index.html` `<head>`):
*   **Body & Interface Text:** `Manrope` (`--font-body`), sans-serif. Designed for readability.
*   **Display & Headings:** `Unbounded` (`--font-display`), applied to `h1`–`h3` globally.

Type scale tokens: `--text-xs` `0.75rem` · `--text-sm` `0.875rem` · `--text-base` `1rem` · `--text-lg` `1.25rem` · `--text-xl` `1.75rem` · `--text-2xl` `2.5rem` · `--text-3xl` `3.5rem`.

---

## 5. Layout & Sizing Constants
*   `--header-height`: `3rem` (48px at base 16px)
*   `--container-max`: `1080px` (main content max width)

### Z-index scale (stacking order)

**Never hard-code a numeric `z-index`.** Every stacking layer uses a token from the single scale in `main.css` (`:root`). This prevents the recurring bug where a floating element disappears behind another.

| Token | Value | Use for |
|---|---|---|
| `--z-behind` | `-1` | decorative backgrounds (bg blobs, particles) |
| `--z-base` | `0` | normal in-flow content |
| `--z-sticky` | `10` | sticky headers |
| `--z-nav` | `200` | side panels |
| `--z-modal` | `1500` | modal backdrop |
| `--z-modal-content` | `1501` | modal content box |
| `--z-tooltip` | `1600` | tooltips |
| `--z-popover` | `2000` | dropdowns / poppers — above every dialog |

**Rule:** any floating layer appended to `<body>` (dropdown, popover, tooltip) must use the matching `--z-*` token. A purely local stack within one component may use a small literal like `z-index: 1` — the scale governs cross-component layers, not intra-component ones.

---

## 6. Border Radii (Corner Rounding)

Corner rounding follows **4 structural roles + pill** (tokens in `main.css`). The roles map to nesting depth so concentric corners stack correctly — pick the token by an element's *role*, not by eyeballing a pixel value:

*   **`24px` (`--radius-xl`) — large surfaces:** major page panels, glass cards, hero/feature cards.
*   **`16px` (`--radius-lg`) — cards & popovers:** standard cards and the shells of floating menus.
*   **`12px` (`--radius-md`) — controls:** buttons, text inputs, selects — anything the user directly operates.
*   **`8px` (`--radius-sm`) — inner elements:** list rows, chips, tooltips, small icons sitting inside a control or popover.
*   **`999px` (`--radius-pill`):** pill badges, tag indicators, status dots, fully-rounded controls.

**Nesting rule:** an element's radius must be smaller than its container's (`surface → card → control → inner`), so the inner corner sits visually concentric inside the outer one. A card (16) holding an input (12) — never the reverse.

---

## 7. Spacings & Paddings (8-Point Grid)

Adhere to an **8-point grid** (tokens `--space-1`…`--space-12`, i.e. `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`) for rhythm and consistency:

*   **`40px` / `32px` (`--space-10` / `--space-8`):** global page wrapper padding, main outer margins.
*   **`24px` / `20px` (`--space-6` / `--space-5`):** modal padding, large form paddings.
*   **`16px` (`--space-4`):** card inner padding, list item spacing, main container gaps.
*   **`12px` / `8px` (`--space-3` / `--space-2`):** button padding, input field padding.
*   **`4px` / `2px` (`--space-1`):** mini-badges, tiny gaps between related tags, inline icons.

---

## 8. Sizing Units: `rem` vs `px`

### 8.1 Use `rem` for:
*   **Typography:** all `font-size` and `line-height` (scales with user accessibility preferences).
*   **Global layout spacing & large paddings:** margins/paddings of large wrappers, modules, pages.

### 8.2 Use `px` for:
*   **Border radii:** corner rounding stays visually fixed regardless of font scale.
*   **Border widths:** `1px`, `2px` — lines must not blur or disappear when fonts scale.
*   **Micro spacings & tiny elements:** fine gaps, fixed icon sizes (e.g. `16px`, `24px`).

---

## 9. Markup & Styling Conventions

Flores is plain HTML + CSS — no framework, no build step.

*   **One stylesheet of record:** `assets/css/main.css` holds the tokens (`:root`), base element styles, and shared component classes (`.glass-panel`, `.btn`, …). Keep it the single source of truth alongside this document.
*   **Class-based styling:** style with semantic class names (`.hero`, `.bouquet-card`, `.glass-panel`). Avoid inline styles except for dynamically computed values (e.g. a background image URL on a card).
*   **Reuse before re-inventing:** prefer the shared component classes (glass panel, button variants, fields) over one-off CSS for each block.
*   **Semantic HTML:** use `<header>`, `<nav>`, `<section>`, `<footer>`, `<button>`, `<a>` for their real roles — it carries accessibility for free on a no-JS-framework site.

---

## 10. Form Inputs & Custom Controls

All inputs and selection controls use glassmorphism rather than flat solid colors.

### 10.1 Text Inputs & Field Triggers — two surface variants

Form-control surfaces share one geometry (border-radius `var(--radius-md)`, text-input height `45px`) but come in **two surface looks**. **A surface can only look recessed if there's something for it to be recessed into**, so:

**Default — raised glassmorphic** (the field sits *on* the page background):
*   **Default:** background `var(--glass-bg-light)`, `1px solid var(--glass-border)`, no shadow.
*   **Hover:** background `var(--glass-bg)`, border-color `rgba(207,154,115,0.45)`.
*   **Focus:** border-color `var(--accent-primary)`, glow `box-shadow: 0 0 10px var(--accent-glow)`.

**`inset` — pressed-glass well** (use **only when the control rests on a glass surface**, where the recessed look reads correctly):
*   **Default:** background `var(--glass-cutout)`, `box-shadow: var(--shadow-inset-cutout)`, transparent border.
*   **Hover:** background `var(--glass-cutout-strong)`.
*   **Focus:** `box-shadow: var(--shadow-inset-cutout), 0 0 0 1px var(--accent-primary), 0 0 10px var(--accent-glow)`.

**Both variants:** error → border-color `var(--color-danger)` + red focus glow. Popover/overlay panels are the opaque L4 surface: `--surface-solid` + `--glass-border` + `--shadow-glass` + blur, at `--z-popover`.

### 10.2 Custom Checkboxes & Radio Buttons
*   **Unchecked:** background `rgba(255,255,255,0.35)`, border `1.5px solid var(--glass-border)`.
*   **Hover unchecked:** border-color `rgba(207,154,115,0.5)`.
*   **Checked:** background `rgba(207,154,115,0.2)`, border-color `var(--accent-primary)`, glow `box-shadow: 0 0 10px var(--accent-glow)`.
*   **Shapes:** checkboxes use a rounded squircle (`border-radius: 5px`), radio buttons a circle (`border-radius: 50%`).

---

## 11. Buttons & Hover Physics

### 11.1 Base Sizing & Borders
All buttons have `border: 1px solid transparent` and `box-sizing: border-box` to avoid layout shift when switching variants.

### 11.2 Hover Physics (Lift-Up effect)
Standard buttons (Primary, Ghost) animate on hover:
*   **Hover:** `transform: translateY(-2px)` with `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`.
*   **Active:** `transform: translateY(0)` (depressed when clicked).
*   *Exception — icon-only buttons:* never lift on hover (`transform: none`). Feedback is opacity/color only.

### 11.3 Primary Button (warm glassmorphic energy panel)
*   **Default:** background `linear-gradient(135deg, rgba(207,154,115,0.35) 0%, rgba(189,133,94,0.5) 100%)`, border `1px solid rgba(207,154,115,0.7)`, glow `box-shadow: 0 4px 15px rgba(150,110,80,0.2), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 10px var(--accent-glow)`.
*   **Hover:** deepen the gradient, raise border opacity, intensify glow.

---

## 12. Section Reveal (scroll animation)

Sections fade and slide up as they enter the viewport, using a small `.reveal` / `.reveal.is-visible` class pair toggled by an `IntersectionObserver` (the page's only JS). Keep it short and subtle:

```css
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

Rules:
- Keep reveals **short and subtle** (~0.6s, small offset). Ambient polish, not a focal animation.
- Always guard with `@media (prefers-reduced-motion: reduce)` → no transform/transition for accessibility.

---

## 13. Guidelines for Developers & Agents

1.  **Do Not Hardcode Colors:** use `var(--token)` from `main.css` and the tables above.
2.  **Class-based styles, not inline:** apply component styles via semantic classes in `main.css`. Avoid inline styles except for dynamically computed values (e.g. a card's background image).
3.  **Contrast & Accessibility:** ensure dark warm text over light glass stays legible — use `--text-primary` / `--text-secondary`.
4.  **Glass Hover States:** on glass panels, slightly increase background opacity / accent borders rather than switching to a solid color.
5.  **Follow Radii & Spacing Scales:** map paddings and radii to §6 and §7.
6.  **Respect Unit Separation (`rem` vs `px`):** §8 — `rem` for text/layout spacing, `px` for borders and rounded corners.
7.  **`backdrop-filter`:** always write both `-webkit-backdrop-filter` and `backdrop-filter` (Safari ≤17 still needs the prefix).
8.  **Synchronization:** if you change any global variable in `main.css` (or a spacing constant), update this document in the same change to keep the design system in sync.
