# Aurora Jewels — Complete Implementable Design System

**Version:** 1.0
**Design Direction:** Luxury + Editorial + Minimal Clean + Soft + Light + Immersive
**Secondary Direction:** Bold typography + restrained motion + sophisticated digital commerce

## 1. System Foundation

Aurora Jewels should feel like **a modern luxury jewelry editorial that happens to be an exceptionally easy-to-use store**.

The system is designed around the confirmed requirements for a premium, sophisticated, timeless and exclusive jewelry experience, while protecting product discovery, checkout usability, mobile performance and restrained motion.

### Core Formula

**Ivory space + deep emerald/black + restrained champagne accents + editorial serif + contemporary sans-serif + exceptional photography + generous whitespace + subtle motion.**

### Design Priority

1. Product desirability
2. Luxury brand perception
3. Shopping clarity
4. Photography
5. Typography
6. Whitespace and composition
7. Restrained motion
8. Performance
9. Decorative effects

---

# 2. BRAND

## 2.1 Visual Personality

Aurora Jewels is:

* Sophisticated
* Timeless
* Feminine
* Intimate
* Refined
* Quietly luxurious
* Editorial
* Modern
* Confident
* Premium

The luxury should come from **composition, photography, typography and restraint**, not ornamentation.

### Avoid

* Gold-heavy interfaces
* Excessive ornamentation
* Glitter effects
* Decorative borders
* Heavy gradients
* Dense product grids
* Excessive rounded cards
* Heavy shadows
* Flashy animation
* Persistent parallax
* Generic e-commerce templates
* Unnecessary custom cursors
* Decorative 3D

## 2.2 Design Principles

### 01 — Quiet Luxury

Luxury is communicated through restraint.

Use fewer visual elements, but make every element deliberate.

### 02 — Product First

Jewelry photography is the primary visual asset.

UI should frame the product rather than compete with it.

### 03 — Editorial Composition

Marketing pages can use asymmetry, large type, large photography and strong vertical rhythm.

Commerce interfaces become progressively more structured.

### 04 — Commerce Without Friction

The experience may feel editorial, but shopping must remain obvious and efficient.

### 05 — Whitespace Is a Brand Asset

Do not fill empty space merely because it exists.

### 06 — Motion Has a Purpose

Motion should communicate hierarchy, continuity, feedback or product quality.

### 07 — Mobile Preserves Luxury

Mobile is not a compressed desktop layout.

Simplify composition while preserving typography, imagery and atmosphere.

### 08 — Performance Is Part of Luxury

A premium experience that feels slow is not premium.

### 09 — Consistency Over Decoration

Repeated spacing, typography, iconography, buttons and interaction behavior create perceived quality.

### 10 — Accessibility Without Visual Compromise

Accessible interaction patterns should be integrated into the visual system from the beginning.

## 2.3 Brand Keywords

**Primary:**

`Quiet Luxury`
`Editorial`
`Timeless`
`Sophisticated`
`Refined`
`Intimate`
`Premium`

**Secondary:**

`Feminine`
`Modern`
`Minimal`
`Elegant`
`Exclusive`
`Confident`
`Immersive`

---

# 3. COLOR SYSTEM

The approved visual direction identifies deep emerald/teal, champagne/gold, ivory and black as the core visual family. Gold must remain an accent rather than the dominant interface color.

The following values convert that direction into implementation-ready design tokens.

## 3.1 Core Palette

| Token                  | Hex       | Usage                            |
| ---------------------- | --------- | -------------------------------- |
| `color-primary`        | `#123C36` | Primary brand color, primary CTA |
| `color-primary-hover`  | `#0D302B` | Primary hover/pressed state      |
| `color-primary-soft`   | `#E8F0ED` | Soft emerald backgrounds         |
| `color-secondary`      | `#F5F0E7` | Ivory editorial surfaces         |
| `color-accent`         | `#C6A56A` | Champagne/gold accents           |
| `color-accent-soft`    | `#EFE4CF` | Soft gold backgrounds            |
| `color-background`     | `#FAF8F3` | Main site background             |
| `color-surface`        | `#FFFFFF` | Cards, drawers, modals           |
| `color-surface-warm`   | `#F5F0E7` | Editorial sections               |
| `color-text`           | `#171A18` | Primary text                     |
| `color-text-secondary` | `#343936` | Secondary text                   |
| `color-muted`          | `#737873` | Supporting text                  |
| `color-border`         | `#DDD9D0` | Dividers and fields              |
| `color-border-strong`  | `#BDB9B0` | Focus/strong borders             |
| `color-success`        | `#2F6B50` | Success state                    |
| `color-warning`        | `#9A6B25` | Warning state                    |
| `color-error`          | `#A53B3B` | Error state                      |

## 3.2 Dark Theme / Dark Sections

Dark sections should use emerald/black rather than introducing another visual identity.

| Token                | Hex       |
| -------------------- | --------- |
| `color-dark`         | `#101412` |
| `color-dark-surface` | `#17201D` |
| `color-dark-text`    | `#F8F5ED` |
| `color-dark-muted`   | `#B9BDB8` |
| `color-dark-border`  | `#34403B` |
| `color-dark-accent`  | `#C6A56A` |

## 3.3 Color Rules

* Emerald is the primary brand/action color.
* Ivory is the dominant background family.
* Champagne/gold is an accent.
* Black is used for strong contrast and premium editorial sections.
* Gold should not be used for large buttons, large backgrounds or body text.
* Never communicate meaning through color alone.
* Error, warning and success states must include text/icon/structural feedback.
* Gradients should remain subtle and editorial.

---

# 4. TYPOGRAPHY

The approved direction calls for a high-contrast luxury editorial serif paired with a clean modern sans-serif.

## 4.1 Font Stack

### Display / Heading

**Primary:** `Cormorant Garamond`

Fallback:

```text
Georgia, "Times New Roman", serif
```

### UI / Body

**Primary:** `Manrope`

Fallback:

```text
Inter, Arial, sans-serif
```

### Implementation

```css
--font-display: "Cormorant Garamond", Georgia, serif;
--font-body: "Manrope", Inter, Arial, sans-serif;
```

Use locally hosted webfont files where licensing permits.

## 4.2 Type Scale

### H1 — Hero

* Font: Display Serif
* Size: `clamp(3rem, 7vw, 6.5rem)`
* Line height: `0.92–1.02`
* Weight: `500`
* Letter spacing: `-0.035em`

Usage:

* Homepage hero
* Major editorial statements
* Major campaign moments

### H2 — Section Heading

* Size: `clamp(2.25rem, 4.5vw, 4.5rem)`
* Line height: `0.98–1.05`
* Weight: `500`
* Letter spacing: `-0.025em`

### H3 — Content Heading

* Size: `clamp(1.75rem, 3vw, 2.75rem)`
* Line height: `1.05`
* Weight: `500`

### H4 — Commerce Heading

* Size: `1.25rem–1.5rem`
* Line height: `1.2`
* Weight: `600`
* Font: Sans-serif

### Body Large

* Size: `1.125rem`
* Line height: `1.65`
* Weight: `400`

### Body

* Size: `1rem`
* Line height: `1.6`
* Weight: `400`

### Small

* Size: `0.875rem`
* Line height: `1.5`

### Micro / Label

* Size: `0.6875rem–0.75rem`
* Line height: `1.2`
* Weight: `600`
* Letter spacing: `0.12em`
* Text transform: uppercase

### Button

* Size: `0.8125rem–0.875rem`
* Weight: `600`
* Letter spacing: `0.04em`

## 4.3 Typography Rules

* Serif communicates emotion and luxury.
* Sans-serif communicates usability and commerce.
* Product names should remain highly legible.
* Prices always use the sans-serif.
* Avoid script fonts.
* Avoid excessive all-caps typography.
* Never sacrifice readability for editorial styling.

---

# 5. LAYOUT SYSTEM

## 5.1 Container

### Desktop

```css
max-width: 1440px;
margin-inline: auto;
padding-inline: 40px;
```

### Large Screens

Maximum content width should remain approximately `1440px`.

### Tablet

```text
padding: 32px
```

### Mobile

```text
padding: 20px
```

## 5.2 Grid

Primary desktop grid:

```text
12 columns
24px gutter
```

Tablet:

```text
8 columns
20px gutter
```

Mobile:

```text
4 columns
16px gutter
```

### Product Grid

Desktop:

* 4 columns as default
* 3 columns when larger product imagery is required

Tablet:

* 2–3 columns

Mobile:

* 2 columns for product browsing
* 1 column for editorial sections

Product grids should remain visually spacious rather than dense.

## 5.3 Spacing Scale

Use a 4px base system.

| Token      | Value |
| ---------- | ----: |
| `space-1`  |   4px |
| `space-2`  |   8px |
| `space-3`  |  12px |
| `space-4`  |  16px |
| `space-5`  |  20px |
| `space-6`  |  24px |
| `space-8`  |  32px |
| `space-10` |  40px |
| `space-12` |  48px |
| `space-16` |  64px |
| `space-20` |  80px |
| `space-24` |  96px |
| `space-32` | 128px |
| `space-40` | 160px |

## 5.4 Section Spacing

### Marketing / Editorial

Desktop:

```text
120–160px
```

Tablet:

```text
88–120px
```

Mobile:

```text
64–88px
```

### Commerce

Use tighter spacing:

Desktop:

```text
64–96px
```

Mobile:

```text
48–64px
```

### Checkout

Use the most compact spacing system:

```text
32–64px
```

---

# 6. RESPONSIVE BREAKPOINTS

Use content-driven breakpoints rather than device-specific assumptions.

| Breakpoint |     Width |
| ---------- | --------: |
| `xs`       | `< 480px` |
| `sm`       |   `480px` |
| `md`       |   `768px` |
| `lg`       |  `1024px` |
| `xl`       |  `1280px` |
| `2xl`      |  `1440px` |

### Mobile Priority

At `<768px`:

* Simplify editorial compositions.
* Reduce animation.
* Reduce parallax.
* Preserve product image prominence.
* Keep controls thumb-friendly.
* Keep navigation simple.
* Avoid decorative interactions.
* Keep checkout highly functional.

---

# 7. NAVBAR

## 7.1 Desktop

Structure:

```text
[Menu / Collections]   [AURORA JEWELS]   [Search] [Account] [Wishlist] [Bag]
```

Alternative full navigation may expose:

```text
New Arrivals
Collections
All Jewelry
About
Our Story
```

The exact navigation structure should follow the approved page architecture.

## 7.2 Visual

* Height: approximately `80–96px`
* Ivory/transparent background initially
* Thin divider on scroll where useful
* Centered wordmark
* Minimal line icons
* No oversized navigation pills
* No heavy shadows

## 7.3 Scroll Behavior

Initial:

```text
transparent / visually light
```

After scroll:

```text
solid ivory background
1px divider
subtle transition
```

Transition:

```text
300ms ease-out
```

## 7.4 Mobile

Use:

```text
[Menu] [AURORA] [Bag]
```

Account/wishlist/search should be accessible through the menu or dedicated controls without overcrowding the header.

---

# 8. BUTTON SYSTEM

## 8.1 Primary Button

```text
Background: Deep Emerald
Text: Ivory
Border: Deep Emerald
Radius: 2px–4px
Height: 48–52px
Horizontal padding: 24–32px
```

Hover:

* Slight background darkening
* Optional 1px upward movement
* No bounce
* No dramatic scale

## 8.2 Secondary Button

```text
Background: transparent
Text: Deep Emerald / Black
Border: 1px solid
Radius: 2px–4px
```

Hover:

* Subtle ivory/emerald fill
* Border transition

## 8.3 Text Button

Used for editorial links.

```text
No background
No visible border
Underline or directional arrow
```

Hover:

* Underline expands
* Arrow moves approximately 4px

## 8.4 Destructive

Use only for destructive account/admin actions.

```text
Text: Error
Border: Error
Background: transparent
```

## 8.5 Button States

Every button must support:

* Default
* Hover
* Focus-visible
* Active
* Disabled
* Loading

Disabled:

* Reduced contrast
* No pointer interaction
* No confusing animation

---

# 9. INPUTS

## 9.1 Default Input

```text
Height: 48–52px
Border: 1px solid #DDD9D0
Background: #FFFFFF
Radius: 2–4px
Padding: 0 16px
```

## 9.2 Focus

```text
Border: Deep Emerald
Outline: 2px solid rgba(18,60,54,.18)
```

Focus must remain clearly visible.

## 9.3 Error

* Error border
* Error message beneath
* Supporting icon where appropriate
* Do not rely solely on red

## 9.4 Labels

Labels should remain visible above the field.

Avoid relying exclusively on placeholder text.

## 9.5 Select / Dropdown

Use the same geometry as inputs.

Avoid overly rounded or app-like controls.

---

# 10. PRODUCT CARDS

Product cards are image-led and intentionally quiet. The source direction explicitly recommends minimal/no visible containers, generous spacing and understated metadata.

## Structure

```text
[Product Image]
[Wishlist]
[Optional Status]
Product Name
Short descriptor if needed
Price
```

## Visual Rules

* No heavy card container
* No large shadow
* Minimal borders
* Large image area
* Consistent image ratios
* Generous vertical spacing
* Product name in sans-serif
* Price in highly legible sans-serif

## Hover

Desktop:

```text
image scale: 1.02–1.04
duration: 500–700ms
```

Optional secondary product image crossfade.

Mobile:

* Disable hover-dependent behavior.
* Use tap interactions only.

---

# 11. PRODUCT DETAIL PAGE

## Desktop Layout

Recommended:

```text
Left: large product image gallery
Right: product information / purchase area
```

The product image should remain the primary visual hero.

## Information Hierarchy

1. Collection/category
2. Product name
3. Price
4. Short description
5. Variant selection
6. Stock state
7. Add to Bag
8. Wishlist
9. Product details
10. Reviews
11. Related products

## Purchase CTA

Primary button should remain visually dominant.

## Mobile

Use:

```text
Image
Product name
Price
Description
Variants
Purchase CTA
Details
Reviews
Related products
```

A sticky purchase control may be used where appropriate, provided it does not obstruct content.

---

# 12. CARDS

General content cards should be less visually dominant than product imagery.

### Style

```text
Background: Surface
Border: 1px solid border
Radius: 2–4px
Shadow: none or extremely subtle
```

Use cards for:

* Editorial content
* Account summaries
* Admin content
* Supporting information

Do not use rounded card containers for every section.

---

# 13. MODALS / DRAWERS

## Modal

* Maximum width: `560–720px`
* Background: Surface
* Radius: `2–6px`
* Overlay: near-black at approximately 45–60% opacity
* Internal padding: `32–48px`

## Drawer

Recommended for:

* Cart
* Mobile navigation
* Filters if filters are eventually approved

Cart drawer should prioritize:

1. Products
2. Quantity
3. Price
4. Remove/edit
5. Checkout CTA

Animation:

```text
250–400ms
ease-out
```

---

# 14. TABLES

Primarily used within admin.

## Style

* Minimal borders
* No heavy row shadows
* Header typography: small uppercase sans-serif
* Row height: `56–72px`
* Strong numeric alignment
* Hover background: subtle warm ivory
* Status represented through label + color

On mobile:

* Convert complex tables to stacked records/cards where practical.
* Never require horizontal scrolling for critical customer-facing commerce information unless unavoidable.

---

# 15. DROPDOWNS

Use for:

* Account menus
* Sorting if sorting is eventually approved
* Admin controls
* Select fields

Style:

```text
Background: #FFFFFF
Border: #DDD9D0
Radius: 2–4px
Shadow: very soft
```

Dropdown entrance:

```text
opacity: 0 → 1
translateY: -4px → 0
duration: 180–240ms
```

---

# 16. FORMS

Forms should feel calm and premium rather than highly decorative.

## Structure

```text
Label
Input
Helper / validation text
```

Use clear grouping and generous vertical spacing.

## Checkout

Checkout should deliberately reduce editorial styling.

Priorities:

1. Clarity
2. Trust
3. Speed
4. Error prevention
5. Payment completion

Avoid elaborate page transitions or decorative animations during checkout.

---

# 17. FOOTER

## Desktop

Use a spacious multi-column footer:

```text
Brand statement
Shop
About
Customer Care
Contact
Social
```

Include confirmed content destinations such as:

* About Aurora
* Our Story
* Contact
* FAQ
* Shipping & Returns
* Privacy Policy
* Terms & Conditions
* Instagram/social links

## Visual

Dark emerald/black footer is preferred.

Typography:

* Ivory primary text
* Warm muted secondary text
* Champagne used sparingly

## Mobile

Stack sections vertically with collapsible groups where useful.

---

# 18. ICONOGRAPHY

Use minimal line icons.

### Characteristics

* Thin stroke
* Simple geometry
* Consistent stroke width
* No filled decorative icons
* No cartoon styling

Primary icons:

* Search
* Account
* Wishlist
* Bag
* Menu
* Arrow
* Plus
* Minus
* Close

Icon size:

```text
16px — compact UI
20px — standard
24px — prominent controls
```

Touch controls should provide an appropriately sized interactive area even when the visible icon is smaller.

---

# 19. BORDERS, RADIUS AND SHADOWS

## Border

Default:

```text
1px solid #DDD9D0
```

Strong:

```text
1px solid #BDB9B0
```

Gold border should only be used for special editorial hierarchy.

## Radius

Aurora uses architectural geometry.

```text
0px — editorial/dividers
2px — buttons/inputs
4px — standard controls
6px — exceptional overlays
```

Avoid:

```text
12px+
```

for normal commerce components.

## Shadows

Use extremely sparingly.

Recommended:

```text
0 12px 40px rgba(16,20,18,0.08)
```

Only for:

* Modals
* Floating menus
* Drawers
* Layered UI

---

# 20. MOTION SYSTEM

Motion is confirmed as part of the launch experience, including smooth transitions, product reveals, subtle scroll animation, premium hover effects and micro-interactions.

Overall intensity:

**Low–Medium**

## Motion Hierarchy

| Area               | Intensity  |
| ------------------ | ---------- |
| Homepage           | Medium     |
| Editorial sections | Medium     |
| Collection         | Low–Medium |
| Product detail     | Medium     |
| Cart               | Low        |
| Checkout           | Very Low   |
| Account            | Low        |
| Admin              | Minimal    |

## 20.1 Timing Tokens

```css
--duration-fast: 150ms;
--duration-standard: 250ms;
--duration-medium: 400ms;
--duration-slow: 650ms;
--duration-editorial: 900ms;
```

## 20.2 Easing

```css
--ease-standard: cubic-bezier(.22, 1, .36, 1);
--ease-soft: cubic-bezier(.16, 1, .3, 1);
```

Avoid elastic/bouncy easing.

---

# 21. PAGE TRANSITIONS

Use subtle continuity between pages.

Recommended:

```text
Current page:
opacity 1

Transition:
opacity 1 → 0.96

New page:
opacity 0 → 1
```

Duration:

```text
300–500ms
```

Do not create a loading animation that delays access to product content.

---

# 22. HOVER INTERACTIONS

## Product Image

```text
scale: 1 → 1.03
duration: 600ms
```

## Button

```text
background transition
transform: translateY(0 → -1px)
```

## Editorial Link

Underline expands from text-width to intended emphasis width.

## Image

Optional secondary image crossfade.

Hover effects must never be required to understand or use the interface.

---

# 23. SCROLL ANIMATION

Use scroll as storytelling.

Approved patterns:

* Image reveal masks
* Fade/translate text entrance
* Subtle parallax
* Editorial image transitions
* Staggered content reveals
* Section continuity

Recommended reveal:

```text
opacity: 0 → 1
transform: translateY(24px) → translateY(0)
duration: 650–900ms
```

Stagger:

```text
60–100ms
```

Do not animate every element.

Do not make navigation, product selection or checkout dependent on scroll animation.

---

# 24. MOUSE-FOLLOW

Mouse-follow is **not a core requirement**.

If implemented in selected editorial sections:

* Keep displacement extremely small.
* Use it only for atmosphere.
* Never use it for essential controls.
* Disable on touch devices.
* Disable when reduced motion is requested.

Recommended maximum displacement:

```text
4–8px
```

---

# 25. CURSOR INTERACTIONS

A custom cursor is **not recommended as a core requirement**. The creative direction specifically identifies it as potential decorative friction.

If experimentally used:

* Only on desktop.
* Never replace native cursor semantics.
* Never obscure clickable elements.
* Disable for checkout.
* Disable for accessibility/reduced-motion preferences.

Default system: **native cursor.**

---

# 26. LOADING

Loading should feel quiet and fast.

## Initial Page Loading

Prefer:

* Skeleton/image placeholders
* Progressive image loading
* Minimal opacity transitions

Avoid:

* Long branded intro screens
* Full-screen animation before shopping
* Decorative loading sequences

## Product Images

Use:

```text
low-quality/blurred placeholder
→ high-resolution image
```

with a short opacity transition.

## Button Loading

Button text can become:

```text
[ subtle spinner ] Processing...
```

Do not resize the button during loading.

---

# 27. MICRO-INTERACTIONS

Use micro-interactions for meaningful feedback.

Examples:

### Add to Bag

* Button state changes
* Small confirmation
* Cart indicator updates

### Wishlist

* Icon state changes
* Short opacity/scale transition

### Form Validation

* Error state appears smoothly
* Message enters without large movement

### Coupon

* Success/error feedback appears inline

### Quantity

* Subtle value transition

Micro-interactions should generally complete within:

```text
150–400ms
```

---

# 28. REDUCED MOTION

The system should support:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

* Disable parallax.
* Disable mouse-follow.
* Remove page transition movement.
* Remove image zoom animation.
* Reduce reveal transitions.
* Remove decorative stagger.
* Keep essential state feedback instantaneous.
* Never hide information because animation is disabled.

The discovery/SRS does not currently establish a contractual accessibility standard, so this is a proactive design-system behavior rather than a confirmed contractual compliance level.

---

# 29. 2D VISUAL SYSTEM

## 29.1 Decorative Elements

Use decoration sparingly.

Approved styles:

* Fine champagne lines
* Thin rules
* Cropped photography
* Typography compositions
* Soft tonal blocks
* Minimal geometric shapes
* Editorial image masks

Avoid:

* Glitter
* Sparkles everywhere
* Ornate frames
* Decorative jewelry illustrations competing with products
* Excessive patterns

## 29.2 Illustrations

Illustration should be:

* Minimal
* Line-based
* Editorial
* Monochromatic or restrained
* Used only where photography is insufficient

Potential applications:

* Jewelry care
* Shipping information
* Supporting informational sections

## 29.3 Shapes

Preferred:

* Rectangles
* Thin lines
* Cropped image blocks
* Subtle circles used only as composition devices

Avoid highly rounded UI shapes.

## 29.4 Gradients

Gradients are secondary.

Use only subtle tonal gradients such as:

```text
Ivory → Warm Ivory
Emerald → Dark Emerald
```

Do not use:

* Metallic gold gradients as primary UI
* Neon gradients
* High-saturation gradients
* Glassmorphism-style gradients

---

# 30. IMAGERY SYSTEM

Photography is one of the primary luxury signals.

## Product Photography

Prioritize:

* High-resolution jewelry photography
* Clean backgrounds
* Macro/detail images
* Consistent crop ratios
* Craftsmanship details
* Controlled lighting

## Lifestyle Photography

Use:

* Elegant compositions
* Soft studio or natural light
* Intimate framing
* Fashion/editorial styling
* Strong negative space

## Image Ratios

Recommended product ratio:

```text
4:5
```

Secondary editorial:

```text
3:4
16:9
```

Do not mix arbitrary product image ratios within the same product grid.

---

# 31. 3D SYSTEM

## Launch Decision

**3D: Not used as a core launch feature.**

The confirmed scope makes 3D optional and explicitly requires that it not compromise speed or mobile usability. Full 3D experiences, modeling and asset production are not confirmed.

## Where 3D May Be Used Later

Only where there is a measurable customer-experience benefit, such as:

* Interactive product visualization
* Demonstrating complex jewelry construction
* A future campaign experience

## Scene Style

If future 3D is approved:

* Minimal
* Studio-like
* Soft lighting
* Neutral/ivory environment
* No unnecessary visual effects

## Camera

* Slow, controlled movement
* No uncontrolled spinning
* User interaction only when it improves product understanding

## Interaction

Potential:

* Gentle rotation
* Zoom
* Product inspection

Not:

* Full-screen experimental navigation
* 3D as decorative background
* 3D blocking checkout

## Performance Fallback

Every 3D experience must have:

```text
3D available
↓
If unsupported/slow
↓
Static optimized product image
```

Mobile should default toward the lightweight representation when appropriate.

---

# 32. ACCESSIBILITY SYSTEM

No specific WCAG level has been contractually confirmed, but the visual system should proactively support accessible interaction.

## 32.1 Contrast

Use the defined text/background combinations so primary content maintains strong readability.

Do not use champagne/gold as normal body text on ivory.

Gold should generally be decorative or used for borders/accents.

## 32.2 Focus

Every interactive element must have a visible `:focus-visible` state.

Recommended:

```css
outline: 2px solid #123C36;
outline-offset: 3px;
```

## 32.3 Keyboard

Keyboard users must be able to access:

* Navigation
* Search
* Account
* Wishlist
* Cart
* Product controls
* Variant controls
* Forms
* Checkout
* Modals
* Drawers
* Admin controls

Focus order must follow logical reading order.

## 32.4 Forms

* Visible labels
* Programmatic labels
* Clear errors
* Helpful validation
* Error messages associated with fields
* Required fields explicitly indicated
* No color-only validation

## 32.5 Images

Product and editorial images must have appropriate alternative text.

Decorative images should use empty alternative text where appropriate.

## 32.6 Motion

Support `prefers-reduced-motion`.

No essential functionality may depend on animation.

## 32.7 Touch

Interactive controls should provide comfortable touch targets.

Do not depend on hover for mobile interactions.

---

# 33. RESPONSIVE COMPONENT BEHAVIOR

## Navbar

**Desktop:** full navigation + utility icons
**Tablet:** simplified navigation
**Mobile:** compact menu + logo + bag

## Product Grid

**Desktop:** 4 columns
**Tablet:** 2–3 columns
**Mobile:** 2 columns

## Product Detail

**Desktop:** gallery + information split
**Mobile:** stacked gallery + purchase information

## Footer

**Desktop:** multi-column
**Mobile:** stacked/collapsible

## Editorial Sections

**Desktop:** asymmetric compositions
**Mobile:** simplified stacked composition

## Tables

**Desktop:** conventional table
**Mobile:** stacked record presentation

---

# 34. DESIGN TOKENS — CODE FOUNDATION

A frontend implementation can establish the system with a centralized token layer:

```css
:root {
  /* Colors */
  --color-primary: #123C36;
  --color-primary-hover: #0D302B;
  --color-primary-soft: #E8F0ED;

  --color-secondary: #F5F0E7;
  --color-accent: #C6A56A;
  --color-accent-soft: #EFE4CF;

  --color-background: #FAF8F3;
  --color-surface: #FFFFFF;
  --color-surface-warm: #F5F0E7;

  --color-text: #171A18;
  --color-text-secondary: #343936;
  --color-muted: #737873;

  --color-border: #DDD9D0;
  --color-border-strong: #BDB9B0;

  --color-success: #2F6B50;
  --color-warning: #9A6B25;
  --color-error: #A53B3B;

  /* Typography */
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Manrope", Inter, Arial, sans-serif;

  /* Radius */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;

  /* Motion */
  --duration-fast: 150ms;
  --duration-standard: 250ms;
  --duration-medium: 400ms;
  --duration-slow: 650ms;
  --duration-editorial: 900ms;

  --ease-standard: cubic-bezier(.22, 1, .36, 1);
  --ease-soft: cubic-bezier(.16, 1, .3, 1);

  /* Layout */
  --container-max: 1440px;
  --grid-gutter: 24px;
  --page-padding: 40px;

  /* Shadows */
  --shadow-floating:
    0 12px 40px rgba(16, 20, 18, 0.08);
}
```

These exact color and font values are **implementation recommendations**, because the source material establishes the visual family and typography direction but states that final colors and typography remain subject to design development and approval.

---

# 35. COMPONENT STATE MATRIX

Every reusable interactive component should support a predictable state model.

| Component    | Default | Hover | Focus | Active | Disabled | Loading  | Error    |
| ------------ | ------- | ----- | ----- | ------ | -------- | -------- | -------- |
| Button       | ✓       | ✓     | ✓     | ✓      | ✓        | ✓        | Optional |
| Input        | ✓       | —     | ✓     | —      | ✓        | Optional | ✓        |
| Select       | ✓       | ✓     | ✓     | ✓      | ✓        | —        | ✓        |
| Checkbox     | ✓       | ✓     | ✓     | ✓      | ✓        | —        | ✓        |
| Wishlist     | ✓       | ✓     | ✓     | ✓      | —        | —        | —        |
| Cart         | ✓       | ✓     | ✓     | ✓      | —        | ✓        | ✓        |
| Product Card | ✓       | ✓     | ✓     | ✓      | —        | ✓        | —        |
| Modal        | ✓       | —     | ✓     | —      | —        | Optional | —        |
| Dropdown     | ✓       | ✓     | ✓     | ✓      | —        | —        | —        |

---

# 36. PAGE-LEVEL DESIGN APPLICATION

## Home

**Highest visual intensity**

* Editorial hero
* Large typography
* Premium photography
* Storytelling
* Featured collections
* Product discovery
* Medium motion

## Shop / All Jewelry

**Commerce-focused**

* Clear product grid
* Strong filtering/search only if approved
* Minimal motion
* Fast browsing

## New Arrivals

* Product-first
* Editorial introduction
* Clear collection hierarchy

## Collections

* Large imagery
* Editorial collection storytelling
* Structured product discovery

## Product Detail

**Product desirability + conversion**

* Large gallery
* Clear purchase information
* Moderate image motion
* Strong CTA
* Reviews
* Related products

## About / Our Story

**Editorial intensity**

* Typography
* Large imagery
* Storytelling
* Scroll reveals

## Contact / FAQ / Shipping & Returns

**Functional clarity**

* Reduced decorative motion
* Strong information hierarchy
* Accessible content

## Cart

**Low motion**

* Clear product summary
* Quantity
* Pricing
* Coupon where applicable
* Checkout CTA

## Checkout

**Very low motion**

* Clarity
* Trust
* Error prevention
* Fast interaction
* Minimal distraction

## Account

**Functional premium**

* Clean forms
* Order history
* Addresses
* Wishlist

## Admin

**Utility-first**

* Minimal animation
* Dense but readable information
* Consistent tables/forms
* No editorial decoration

---

# 37. PERFORMANCE RULES

Because the approved requirements explicitly require a fast, mobile-friendly website and warn that imagery, motion and optional 3D can create performance conflicts, performance is a design constraint rather than a later optimization step.

## Required Practices

* Responsive images
* Modern image formats where supported
* Lazy-load below-the-fold imagery
* Prioritize above-the-fold hero imagery
* Avoid unnecessary video
* Avoid persistent animation loops
* Avoid unnecessary JavaScript animation
* Avoid 3D at launch
* Keep product grids lightweight
* Avoid oversized DOM structures
* Load fonts efficiently
* Use animation only where it contributes to the experience

## Critical Rule

**Never delay product discovery because of decorative animation.**

---

# 38. CONTENT AND UI VOICE

The design system should visually support copy that feels:

* Confident
* Refined
* Concise
* Sensory without being exaggerated
* Premium without sounding pretentious

Avoid:

* Excessive exclamation marks
* Aggressive sales language
* Generic e-commerce clichés
* Overuse of "luxury"
* Artificial scarcity unless commercially accurate

---

# 39. DESIGN QA CHECKLIST

Before a component is approved:

### Brand

* [ ] Looks premium without being ornate
* [ ] Uses the Aurora palette correctly
* [ ] Does not resemble a generic e-commerce template
* [ ] Maintains editorial sophistication

### Typography

* [ ] Correct font role
* [ ] Correct hierarchy
* [ ] Readable body text
* [ ] Prices remain highly legible

### Layout

* [ ] Correct container
* [ ] Correct grid
* [ ] Consistent spacing
* [ ] Adequate whitespace

### Components

* [ ] Default state
* [ ] Hover state
* [ ] Focus state
* [ ] Active state
* [ ] Disabled state
* [ ] Loading/error states where applicable

### Motion

* [ ] Purposeful
* [ ] Subtle
* [ ] Fast enough for commerce
* [ ] Not required for comprehension
* [ ] Reduced-motion behavior implemented

### Mobile

* [ ] No desktop-only interaction
* [ ] Touch-friendly
* [ ] Images remain performant
* [ ] Navigation remains simple
* [ ] Checkout remains efficient

### Accessibility

* [ ] Keyboard accessible
* [ ] Visible focus
* [ ] Appropriate contrast
* [ ] Semantic structure
* [ ] Form labels
* [ ] Accessible errors
* [ ] Reduced motion
* [ ] No hover-only functionality

---

# 40. IMPLEMENTATION BOUNDARY

This design system translates the approved creative direction into a concrete implementation foundation while preserving the distinction between confirmed requirements and unresolved decisions.

The underlying project requirements confirm a premium Pakistan-first jewelry e-commerce experience, approximately 50–100 launch products, guest checkout, optional accounts, wishlist, reviews, COD, online payment, product/content administration, responsive behavior, sophisticated restrained motion and optional rather than core 3D.

The following remain **open and should not be silently treated as approved product requirements**:

* Exact payment gateway
* Exact courier/shipping provider
* Authentication method
* Search/filter/sort behavior
* Currency
* Tax treatment
* Variant-level inventory
* Review moderation rules
* Guest wishlist behavior
* Transactional email requirements
* Exact analytics events
* Multiple admin roles
* Accessibility compliance target
* Numerical performance targets
* Specific security/compliance requirements
* Any launch-specific 3D experience

The design system therefore provides **implementation-ready visual tokens, components, responsive rules and interaction behavior without converting those unresolved business decisions into unapproved scope**.

## Final Art Direction

**Aurora Jewels = Quiet Luxury with Editorial Confidence.**

The website should feel expensive because it is **restrained, intentional, beautifully photographed, typographically sophisticated and exceptionally easy to shop**—not because it is overloaded with gold, effects, animation or technology.
