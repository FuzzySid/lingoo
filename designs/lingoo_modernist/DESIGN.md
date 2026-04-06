# Design System Document: Editorial Linguistic Experience

## 1. Overview & Creative North Star: "The Digital Lexicographer"
This design system moves beyond the utility of a standard dictionary to create a high-end, editorial experience. Our Creative North Star is **"The Digital Lexicographer"**—a philosophy that treats every word not just as data, but as a curated exhibit. 

We break the "template" look by rejecting the rigid, boxed-in grids typical of mobile apps. Instead, we embrace **Intentional Asymmetry** and **Tonal Depth**. By utilizing massive whitespace, high-contrast typography scales, and layered surfaces, we create a trilingual environment that feels like a premium physical encyclopedia translated into a fluid, digital medium. The goal is "Soft Minimalism": an interface that breathes, prioritizing legibility and cognitive ease through spatial breathing room rather than structural lines.

---

2. Colors
Our palette is rooted in a sophisticated interplay between "Ink" and "Paper." We avoid sterile blacks and whites in favor of nuanced neutrals and a singular, commanding Indigo.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to create a "zone" without a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper. 
- **Nesting:** To define importance, use the tier system. A search result card (`surface-container-lowest`) should sit atop a `surface-container-low` background to provide a soft, natural lift.
- **Glass & Gradient:** For floating elements (like a sticky trilingual language switcher), use **Glassmorphism**. Apply `surface` colors at 80% opacity with a `20px` backdrop-blur. 
- **Signature Textures:** For the main "Search" action or "Word of the Day" hero, use a subtle linear gradient transitioning from `primary` (#3525cd) to `primary_container` (#4f46e5) at a 135-degree angle. This adds a "visual soul" that flat indigo cannot achieve.

| Token | Value | Role |
| :--- | :--- | :--- |
| `surface` | #f8f9fa | The base "Paper" layer. |
| `primary` | #3525cd | The "Ink" for actions and brand moments. |
| `on_surface` | #191c1d | High-contrast text for maximum legibility. |
| `surface_container_low` | #f3f4f5 | Sub-sectioning and grouping. |
| `outline_variant` | #c7c4d8 | Only for the "Ghost Border" fallback (at 20% opacity). |

---

3. Typography
We use **Inter** to bridge the gap between technical precision and editorial elegance. The hierarchy is exaggerated to create a clear path for the eye.

- **Display & Headline (The Authority):** Used for the word being searched. `display-lg` (3.5rem) creates a monumental feel. Use tight letter-spacing (-0.02em) to make it feel "locked in."
- **Title (The Bridge):** Used for language headers (English, Spanish, French). These should be `title-lg` with increased tracking (+0.05em) for an airy, sophisticated feel.
- **Body (The Content):** `body-lg` for definitions. Line-height must be generous (1.6) to prevent trilingual text blocks from feeling cramped.
- **Labels (The Metadata):** `label-md` is reserved for "Noun," "Verb," or "IPA Phonetics," styled in `on_surface_variant` (#464555) to recede visually.

---

4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a "soft lift" that feels architectural rather than "pasted on."
- **Ambient Shadows:** When a floating element (like a FAB) is required, use a shadow with a blur radius of `40px` and a spread of `-10px`. Use a tint of the `primary` color at 8% opacity for the shadow to mimic natural, ambient light.
- **The "Ghost Border":** If a border is required for accessibility in input fields, use `outline-variant` at **20% opacity**. Never use 100% opaque borders.

---

5. Components

### Search Bar (The Signature Component)
The search bar is the centerpiece. 
- **Shape:** `xl` (3rem/60px) roundedness to create a friendly, "pill" aesthetic.
- **State:** On focus, transition from `surface_container_highest` to a `surface_container_lowest` background with a subtle "Ghost Border" and an ambient indigo shadow.

### Trilingual Segmented Controls
Used to switch between languages.
- **Style:** Avoid a "button" look. Use a `surface_container_high` track with a `surface_container_lowest` sliding indicator. The indicator should have the `sm` (0.5rem) corner radius.

### Synonym & Antonym Chips
- **Layout:** Non-traditional, wrap-around layouts with generous horizontal padding (1.5rem).
- **Styling:** Use `surface_variant` for the background and `on_surface_variant` for text. No borders. On hover/tap, shift to `primary_fixed` with `on_primary_fixed_variant` text.

### Word Cards & Lists
- **Rule:** **Strictly forbid dividers.** Separate list items using the **Spacing Scale** (e.g., 24px vertical margin) or by alternating subtle background shifts (`surface` to `surface_container_low`).

### Input Fields
- **Editorial Touch:** Labels should never be inside the box. Use `label-md` placed 8px above the input. Use a `primary` color cursor for a tiny pop of brand identity.

---

6. Do's and Don'ts

| Do | Don't |
| :--- | :--- |
| **Do** use `display-lg` for search terms to create an editorial focal point. | **Don't** use 1px grey borders to separate sections. Use tonal shifts. |
| **Do** embrace white space; if the layout feels "empty," add 16px more padding. | **Don't** use standard "drop shadows" (Black 25% opacity). |
| **Do** use `60px` (xl) corners for the primary search bar to make it iconic. | **Don't** use more than three font weights. Stick to Regular and Semi-Bold. |
| **Do** use Glassmorphism for overlays to keep the context of the word list visible. | **Don't** use standard "Material Blue." Use our custom Indigo (#3525cd). |