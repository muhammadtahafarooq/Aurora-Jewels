# Aurora Jewels — UI Generator Design Blueprint

**Version:** 1.0
**Status:** Single source of truth for UI generation
**Design direction:** Quiet Luxury + Editorial Confidence
**Launch 3D:** None
**Primary visual priority:** Product desirability → luxury perception → shopping clarity → photography → typography → whitespace → motion → performance

---

# 1. GLOBAL DESIGN DECISIONS

## 1.1 Core visual rule

Every screen must look like it belongs to the same luxury jewelry house.

The visual formula is:

**Ivory canvas + deep emerald structure + near-black contrast + champagne accents + editorial serif + clean sans-serif + exceptional photography + architectural spacing + restrained motion.**

The interface must **not** resemble:

* A generic Shopify storefront
* A SaaS dashboard
* A fashion marketplace
* A gold-heavy jewelry template
* A rounded mobile-app UI
* A futuristic/AI interface

The product photography and typography create the luxury; UI decoration stays subordinate.

---

# 2. COLOR BLUEPRINT

## 2.1 Exact production palette

| Token           | Hex       | Exact usage                                            |
| --------------- | --------- | ------------------------------------------------------ |
| Primary Emerald | `#123C36` | Primary CTA, active navigation, key interactive states |
| Deep Emerald    | `#0D302B` | Hover/pressed primary states, dark footer              |
| Emerald Soft    | `#E8F0ED` | Selected states, soft informational surfaces           |
| Near Black      | `#101412` | Strong editorial sections, footer background           |
| Text Black      | `#171A18` | Main headings and body text                            |
| Text Secondary  | `#343936` | Supporting copy                                        |
| Warm Gray       | `#737873` | Metadata, helper text                                  |
| Ivory           | `#FAF8F3` | Default page background                                |
| Warm Ivory      | `#F5F0E7` | Editorial alternate sections                           |
| White           | `#FFFFFF` | Product surfaces, forms, drawers                       |
| Champagne       | `#C6A56A` | Fine accents, rules, selected editorial details        |
| Champagne Soft  | `#EFE4CF` | Very limited accent surfaces                           |
| Border          | `#DDD9D0` | Dividers, inputs, subtle component boundaries          |
| Strong Border   | `#BDB9B0` | Active/strong field boundaries                         |
| Success         | `#2F6B50` | Success states                                         |
| Warning         | `#9A6B25` | Warning states                                         |
| Error           | `#A53B3B` | Error states                                           |

### Color ratio

Across a typical page:

* **55–65%:** Ivory / warm ivory / white
* **20–25%:** photography
* **8–12%:** emerald / near-black
* **2–4%:** champagne
* Remaining: semantic/status colors only when required

Gold must never visually dominate a screen.

## 2.2 Dark-section rule

Only approved sections requiring strong contrast use dark treatment.

Dark background:

`#101412`

Dark surface:

`#17201D`

Dark primary text:

`#F8F5ED`

Dark muted text:

`#B9BDB8`

Dark accent:

`#C6A56A`

Do not introduce navy, purple, blue, or metallic gradients.

## 2.3 Why this palette fits Aurora

Emerald gives Aurora distinction and depth without the conventional "gold jewelry store" look. Ivory provides the quiet negative space associated with editorial luxury. Near-black supplies authority and contrast. Champagne identifies preciousness without turning the interface into a gold ornament.

The combination is particularly appropriate for a premium jewelry audience because the interface feels **exclusive rather than promotional**.

## 2.4 Rejected alternatives

### Alternative A — Black + Gold + White

Rejected because it is too conventional for luxury jewelry and would push Aurora toward an ornate, traditional jewelry-house aesthetic.

### Alternative B — Blush + Rose Gold + Ivory

Rejected because it becomes overtly feminine and trend-driven. Aurora needs femininity with timelessness and authority.

### Alternative C — Forest Green + Cream + Brass

Rejected because it is too earthy and heritage-oriented. Aurora requires a cleaner, more contemporary emerald/teal identity.

---

# 3. TYPOGRAPHY BLUEPRINT

## 3.1 Exact pairing

### Display / Editorial

**Cormorant Garamond**

Used for:

* Hero headlines
* Major section titles
* Editorial statements
* Collection titles
* Brand-story statements

### UI / Commerce

**Manrope**

Used for:

* Navigation
* Product names
* Prices
* Buttons
* Forms
* Account areas
* Checkout
* Supporting copy
* Labels

Fallbacks:

```text
Cormorant Garamond → Georgia → Times New Roman → serif
Manrope → Inter → Arial → sans-serif
```

## 3.2 Exact hierarchy

### Display H1

* Cormorant Garamond
* Weight: 500
* Desktop: `clamp(48px, 7vw, 104px)`
* Mobile: `48–64px`
* Line height: `0.94–1.02`
* Letter spacing: `-0.035em`

### H2

* Cormorant Garamond
* Weight: 500
* Desktop: `56–72px`
* Mobile: `38–48px`
* Line height: `0.98–1.05`

### H3

* Cormorant Garamond
* Weight: 500
* Desktop: `40–44px`
* Mobile: `30–36px`

### H4

* Manrope
* Weight: 600
* `20–24px`
* Line height: `1.2`

### Body Large

* Manrope
* `18px`
* Line height: `1.65`

### Body

* Manrope
* `16px`
* Line height: `1.6`

### Small

* Manrope
* `14px`
* Line height: `1.5`

### Eyebrow / Label

* Manrope
* `11–12px`
* Weight: 600
* Uppercase
* Letter spacing: `0.12em`

### Button

* Manrope
* `13–14px`
* Weight: 600
* Letter spacing: `0.04em`

## 3.3 Typography rule

Serif communicates **desire and brand emotion**.

Sans-serif communicates **trust, clarity and commerce**.

Never use the serif for prices, forms, checkout controls or dense product metadata.

---

# 4. ICONOGRAPHY

## 4.1 Direction

Use **Lucide-style custom line icons** as the implementation basis, with Aurora-specific sizing and stroke rules.

Required icon set:

* Search
* Account
* Wishlist/heart
* Bag
* Menu
* Close
* Arrow right
* Arrow left
* Plus
* Minus
* Chevron
* Check
* Alert
* Trash/edit where required by approved commerce/account functionality

## 4.2 Exact treatment

* Line only
* No filled decorative icons
* `1.25px` stroke at normal size
* `1.5px` stroke for prominent controls
* Rounded line caps
* Rounded line joins
* No ornamental flourishes
* No emoji icons

Visible sizes:

* Compact: `16px`
* Standard: `20px`
* Prominent: `24px`

Interactive wrapper must be substantially larger than the visible icon.

---

# 5. IMAGERY BLUEPRINT

## 5.1 Primary medium

**Photography is the dominant visual medium.**

Use 3D at **0% at launch**.

Illustration is secondary and only used for supporting informational content when photography is unsuitable.

## 5.2 Product photography

Every product grid uses a consistent **4:5 portrait frame**.

Treatment:

* Clean ivory/neutral background
* Soft controlled studio light
* Accurate jewelry color
* High-resolution detail
* Consistent camera distance
* Minimal props
* No artificial glitter
* No excessive reflections
* No inconsistent cropping

Object-fit:

`cover`

Object-position:

`center center`

## 5.3 Editorial photography

Use:

* Macro jewelry details
* Hands/wearing shots
* Intimate lifestyle imagery
* Craftsmanship details
* Controlled studio portraits
* Architectural compositions
* Strong negative space

Avoid:

* Generic stock photography
* Busy backgrounds
* Overly saturated fashion imagery
* Excessive props
* Visually competing accessories

## 5.4 Image treatment

Images remain predominantly natural color.

Do not apply a permanent duotone treatment to product photography.

Editorial images may receive:

* Soft warm tonal treatment
* Very subtle grain
* Controlled crop
* Ivory/emerald framing
* Masked reveal animation

Grain must remain almost imperceptible.

---

# 6. LOGO DIRECTION

The sitemap confirms a wordmark rather than a finalized logo system.

Until final logo assets are supplied, generate a **refined wordmark placeholder direction**:

**AURORA JEWELS**

Characteristics:

* Uppercase
* Elegant spacing
* Thin-to-medium letter weight
* No decorative symbol required
* Horizontal wordmark
* High legibility at navigation scale

The wordmark should feel closer to a luxury fashion-house masthead than a decorative jewelry logo.

Do not generate an ornate crest, gemstone icon, crown, sparkle symbol or scripted monogram.

---

# 7. LAYOUT SYSTEM

## 7.1 Desktop container

Maximum width:

`1440px`

Horizontal padding:

`40px`

## 7.2 Tablet

Horizontal padding:

`32px`

## 7.3 Mobile

Horizontal padding:

`20px`

## 7.4 Grid

Desktop:

* 12 columns
* 24px gutters

Tablet:

* 8 columns
* 20px gutters

Mobile:

* 4 columns
* 16px gutters

## 7.5 Product grid

Desktop:

**4 columns**

Gap:

`24px`

Tablet:

**2 columns**

Gap:

`20px`

Mobile:

**2 columns**

Gap:

`12–16px`

Do not compress product cards into dense marketplace-style grids.

---

# 8. REPEATING STRUCTURES

# 8.1 Header / Navbar

## Desktop

Exact structure:

```text
[Shop / All Jewelry] [New Arrivals] [Collections] [About / Our Story]
                         AURORA JEWELS
                  [Search] [Account] [Wishlist] [Bag]
```

The wordmark remains visually centered.

Height:

`88px`

Horizontal padding:

`40px`

Initial homepage state:

* Transparent or visually integrated with hero
* Ivory/light text only when contrast requires it

Scrolled state:

* `#FAF8F3`
* `#DDD9D0` bottom divider
* `#171A18` text/icons
* 250–300ms transition

No shadow.

## Mobile

Exact structure:

```text
[Menu]          AURORA          [Bag]
```

Height:

`68px`

The menu opens a full-height ivory navigation drawer.

Mobile drawer order:

1. Shop / All Jewelry
2. New Arrivals
3. Collections
4. About / Our Story
5. Account
6. Wishlist
7. Search
8. Customer-care destinations where applicable

No pill navigation.

---

# 8.2 Footer

## Desktop

Dark emerald/black full-width footer.

Content grid:

```text
AURORA JEWELS
Brand statement

SHOP
All Jewelry
New Arrivals
Collections

ABOUT
About Aurora
Our Story

CUSTOMER CARE
FAQ
Shipping & Returns
Contact

SOCIAL
Instagram
```

Legal row below:

* Privacy Policy
* Terms & Conditions

Footer spacing:

`96–128px` top/bottom.

## Mobile

Stack into:

1. Brand statement
2. Shop accordion
3. About accordion
4. Customer Care accordion
5. Social
6. Legal

Background remains dark emerald.

---

# 8.3 Hero patterns

## Marketing hero

Used by:

* Home
* About Aurora
* Our Story
* Collections
* Contact
* FAQ
* Shipping & Returns

Structure:

```text
Eyebrow
Large serif heading
Supporting copy
CTA group
Large editorial image
```

The image and typography should not form a generic centered SaaS hero.

Use asymmetric positioning and generous negative space.

## Commerce hero

Used by:

* Shop / All Jewelry
* New Arrivals

Structure:

```text
Small eyebrow
Large serif page title
Short supporting copy
Whitespace
Product grid
```

No oversized full-screen image.

## Product hero

Product Detail begins immediately with:

```text
Large image gallery | Purchase information
```

No separate marketing hero is inserted before the product.

## Functional hero

Used by:

* Contact
* FAQ
* Shipping & Returns
* Privacy Policy
* Terms & Conditions

Structure:

```text
Small eyebrow where appropriate
Large title
Short introduction
Content
```

Keep decorative imagery subordinate.

---

# 8.4 Product card pattern

Exact order:

1. Image
2. Wishlist control over image, top-right
3. Optional understated status label
4. Product name
5. Price
6. Optional short supporting descriptor

Image ratio:

`4:5`

Card container:

* No visible background
* No border
* No shadow
* No rounded container

Hover:

* Image scales from `1.00` to `1.03`
* 600ms
* Secondary image crossfade only where an approved second image exists

Mobile:

* No hover dependency

---

# 8.5 CTA patterns

### Primary

Emerald fill.

```text
Height: 50–52px
Padding: 24–32px
Radius: 2px
Text: ivory
```

### Secondary

Transparent with `1px` border.

### Editorial CTA

Text link with directional arrow.

Example:

`Discover Our Story  →`

Underline expands on hover.

### Purchase CTA

Full-width on product detail and checkout.

Height:

`52px`

It is the strongest action on the screen.

---

# 9. PAGE-BY-PAGE BLUEPRINT

# HOME

## Section 1 — Navbar

Full Aurora header.

Desktop:

* Four primary navigation destinations left
* Centered Aurora wordmark
* Four utility controls right

Mobile:

* Menu
* Centered wordmark
* Bag

Homepage header begins visually light/transparent and becomes ivory after scrolling.

---

## Section 2 — Hero

### Layout

Desktop uses a two-zone asymmetric composition:

* Left: approximately 42% width
* Right: approximately 58% width

Left contains:

1. Small editorial eyebrow
2. Large Cormorant Garamond headline
3. Supporting statement
4. Primary `Shop Jewelry`
5. Secondary `Explore Collections`

Right contains:

* One large premium jewelry/lifestyle photograph
* Portrait-oriented image
* Image extends close to viewport height but leaves header breathing room

The hero must not use a centered text-over-background template.

### Motion

On entry:

1. Image mask reveals vertically
2. Headline fades/slides upward
3. Supporting copy follows
4. CTAs follow
5. No simultaneous explosive animation

Hero animation duration:

`900ms`

Stagger:

`80ms`

No 3D.

### Mobile

Order:

1. Hero image
2. Eyebrow
3. Headline
4. Supporting statement
5. Primary CTA
6. Secondary CTA

Image remains dominant but is reduced to an efficient portrait crop.

---

## Section 3 — Featured Collections

### Layout

Three editorial collection compositions on desktop.

Each item:

```text
Large image
Collection name
Short copy
Explore Collection →
```

Use an asymmetric image sizing pattern:

* First: large
* Second: smaller offset
* Third: large

Do not make all three identical cards.

### Mobile

Stack vertically.

Each collection becomes:

```text
Image
Collection title
Short copy
CTA
```

### Motion

Image reveal as each block enters viewport.

---

## Section 4 — Product Discovery / Featured Products

### Layout

Section heading on left:

```text
Featured Jewelry
Short supporting line
```

Optional editorial text link on right:

`View All Jewelry →`

Below:

**4-column product grid desktop**

Each card follows the global product-card pattern.

### CTA

Each product card links to Product Detail.

Section-level link leads to Shop / All Jewelry.

### Motion

Low-medium:

* Image scale
* Optional second-image crossfade
* Wishlist reveal

No scroll-dependent product movement.

---

## Section 5 — Brand Storytelling

### Layout

Desktop:

* Image occupies approximately 58% width
* Text occupies approximately 42%
* Text vertically centered
* Large serif statement
* Supporting copy
* `Discover Our Story →`

Image may slightly overlap the grid boundary.

### Motion

* Image mask reveal
* Typography fade/translate
* No aggressive parallax

### Mobile

Image first, then text.

---

## Section 6 — Additional Product/Collection Storytelling

### Layout

Full-width editorial image with a deliberately offset text block.

Text block:

1. Small label
2. Serif heading
3. Supporting copy
4. Relevant CTA

Image should have significant negative space around the copy.

### Motion

Slow image transition and text reveal.

---

## Section 7 — Trust / Supporting Information

### Layout

Three evenly spaced information blocks.

Each contains:

* Minimal line icon
* Short heading
* Concise supporting information
* Relevant text CTA where required

Use confirmed shopping/customer-care information only.

Background:

Warm ivory.

No large decorative icons.

---

## Section 8 — Footer

Use global dark editorial footer.

---

# SHOP / ALL JEWELRY

## Section 1 — Navbar

Standard commerce navbar.

Unlike Home, header begins solid ivory.

---

## Section 2 — Page Introduction

Centered editorial composition.

Structure:

1. Small uppercase label
2. `Shop All Jewelry`
3. One concise introductory paragraph

Maximum text width:

`620px`

Vertical spacing:

`64–96px`.

Motion:

Single subtle heading reveal.

---

## Section 3 — Product Browsing Grid

Desktop:

4 columns.

Mobile:

2 columns.

Each product card contains:

* 4:5 image
* Wishlist
* Product name
* Price
* Status where applicable

No filters or sorting controls are added because those are not approved.

No artificial category sidebar.

### Motion

Product image hover only.

---

## Section 4 — Collection/Product Navigation

A slim editorial navigation strip appears after or alongside the product catalog only when confirmed collection destinations exist in the approved navigation.

Use:

```text
Shop All | New Arrivals | Collections
```

No filter chips.

No pill controls.

---

## Section 5 — Footer

Global footer.

---

# NEW ARRIVALS

## Section 1 — Navbar

Solid ivory commerce navbar.

---

## Section 2 — Editorial Introduction

Desktop composition:

* Left: heading and supporting copy
* Right: premium supporting image

Heading:

`New Arrivals`

Supporting text remains concise.

Mobile:

Image → heading → copy.

Motion:

Image reveal + restrained text entrance.

---

## Section 3 — New Arrivals Product Grid

4 columns desktop.

2 columns mobile.

Same product card rules.

The New Arrivals collection must feel more editorial than the All Jewelry catalog without changing the commerce component.

---

## Section 4 — Supporting Collection/Product Storytelling

Asymmetric image + text composition.

Text contains:

* Serif heading
* Short copy
* Relevant commerce CTA

No new content category is introduced.

---

## Section 5 — Footer

Global footer.

---

# COLLECTIONS

## Section 1 — Navbar

Global header.

---

## Section 2 — Collections Editorial Hero

Desktop:

Full-width image composition with text occupying an intentional negative-space region.

Text:

1. `Collections`
2. Introductory copy

The image should remain visible as a major visual field.

Mobile:

Image followed by title and copy.

### Motion

* Image mask reveal
* Typography entrance

---

## Section 3 — Collection Listing

Use editorial collection tiles rather than conventional cards.

Desktop:

Asymmetric 12-column layout.

Each collection:

* Image
* Collection name
* Supporting copy
* `Explore Collection →`

No rounded containers.

### Motion

Image scale/reveal.

---

## Section 4 — Collection Discovery / Product Preview

Display relevant products beneath the collection storytelling.

Desktop:

4-column product grid.

Each product uses global card pattern.

CTA:

`View Product →`

---

## Section 5 — Footer

Global footer.

---

# PRODUCT DETAIL

## Section 1 — Navbar

Commerce header.

---

## Section 2 — Product Gallery

### Desktop

Gallery occupies approximately 58–60% of page width.

Use a two-column image arrangement within the gallery where multiple images are available.

Primary image is larger.

Additional images use consistent 4:5 treatment.

### Mobile

Images become a vertical gallery.

Do not create a heavy carousel UI if scrolling through product images is sufficient.

### Motion

* Gentle image transition
* Controlled image fade
* No persistent zoom
* No 3D

---

## Section 3 — Product Information

Desktop information panel occupies approximately 40–42%.

Exact hierarchy:

1. Collection/category label
2. Product name
3. Price
4. Short description
5. Variant selection
6. Stock status
7. Quantity where applicable
8. `Add to Bag`
9. Wishlist
10. Product details

Product name uses serif.

Price uses Manrope.

---

## Section 4 — Variant Selection

Use clean rectangular controls.

No pill-shaped variant chips.

Selected:

* Deep emerald border
* Very light emerald background if necessary

Unavailable:

* Reduced contrast
* Visible unavailable treatment
* Not communicated by color alone

---

## Section 5 — Purchase Area

Primary CTA:

**Add to Bag**

Full width within product information panel.

Below:

Wishlist control.

Add-to-bag interaction:

1. Button enters loading state
2. Button confirms success
3. Bag count updates
4. Cart drawer may open if configured by the approved commerce behavior

Do not invent an additional purchase flow.

---

## Section 6 — Product Details

Use an editorial accordion/stacked information layout.

Each item:

```text
[Heading]                         [+]
```

Opening uses a 250–300ms height/opacity transition.

Content remains readable and spacious.

---

## Section 7 — Reviews

Display:

* Review heading
* Review summary/content
* Individual reviews
* Approved review action/functionality

Do not invent verified-purchase badges, ratings mechanics or moderation controls beyond confirmed functionality.

---

## Section 8 — Related Products

4-column desktop grid.

2-column mobile.

Product card rules apply.

---

## Section 9 — Footer

Global footer.

---

# ABOUT AURORA

## Section 1 — Navbar

Global marketing header.

---

## Section 2 — Editorial Hero

Desktop:

Image-led asymmetric composition.

Text:

* `About Aurora`
* Short positioning statement

Image occupies approximately 60% width.

Text occupies approximately 40%.

---

## Section 3 — Brand Introduction

Large serif statement followed by concise brand narrative.

Layout:

* Text left
* Image right

Alternate image/text position from hero to prevent repetitive stacking.

---

## Section 4 — Brand Visual Story

Full-width editorial photography.

Supporting narrative is placed within negative space rather than inside a conventional card.

### Motion

* Image reveal
* Gentle text entrance
* Very subtle parallax on desktop only

Disable parallax on mobile.

---

## Section 5 — Brand Experience / Values

Use three editorial value blocks.

Each:

* Small label
* Serif heading
* Supporting copy

No icons unless supplied/required by content.

---

## Section 6 — CTA

Centered on ivory background.

Large serif statement.

CTA:

`Discover Our Story →`

---

## Section 7 — Footer

Global footer.

---

# OUR STORY

## Section 1 — Navbar

Global marketing header.

---

## Section 2 — Story Hero

Large editorial photograph.

Opening statement positioned over or beside intentional negative space.

Heading:

`Our Story`

---

## Section 3 — Story Content

Long-form narrative.

Desktop:

Text column limited to approximately `620–700px`.

Editorial imagery interrupts the narrative at controlled intervals.

Do not create dense text walls.

---

## Section 4 — Craft / Product Storytelling

Large craftsmanship/detail photography.

Supporting copy beside or below image.

Motion:

* Image reveal
* Text reveal
* Subtle scroll continuity

---

## Section 5 — Closing Brand Statement

Dark emerald section.

Large ivory serif statement.

Supporting imagery may appear as a controlled inset image.

---

## Section 6 — CTA

CTA:

`Shop Jewelry →`

Primary emerald/ivory or ivory-on-dark treatment according to surrounding background.

---

## Section 7 — Footer

Global footer.

---

# CONTACT

## Section 1 — Navbar

Global header.

---

## Section 2 — Contact Hero

Compact functional hero.

Centered:

* `Contact`
* Short supporting copy

No full-screen image.

Motion:

Minimal heading fade.

---

## Section 3 — Contact Information

Desktop:

Three-column information layout.

Each block:

* Small line icon
* Contact heading
* Confirmed contact detail
* Appropriate action

WhatsApp support gets a direct action where applicable.

---

## Section 4 — Contact Form

Desktop:

Form occupies approximately 60%.

Supporting contact information occupies approximately 40%.

Field order:

1. Name
2. Contact information
3. Message

Use only confirmed fields.

Every field has visible label.

CTA:

`Send Message`

Errors appear inline.

---

## Section 5 — Social Contact

Instagram/social destination.

Use minimal social icon treatment.

---

## Section 6 — Footer

Global footer.

---

# FAQ

## Section 1 — Navbar

Global header.

---

## Section 2 — FAQ Introduction

Centered:

* `FAQ`
* Short supporting copy

Maximum text width:

`620px`.

---

## Section 3 — FAQ Content

Use a single editorial accordion column.

Maximum width:

`900px`.

Each row:

```text
Question                                      +
```

Divider:

`1px #DDD9D0`

Open state:

* Question remains strong
* Answer expands below
* Plus changes to minus
* No rotation animation required

Motion:

250ms.

---

## Section 4 — Customer Support CTA

Warm ivory or dark emerald section.

Copy:

`Still have questions?`

CTA:

`Contact Aurora`

Secondary route:

WhatsApp where applicable.

---

## Section 5 — Footer

Global footer.

---

# SHIPPING & RETURNS

## Section 1 — Navbar

Global header.

---

## Section 2 — Page Introduction

Editorial but compact.

Heading:

`Shipping & Returns`

Supporting copy below.

---

## Section 3 — Shipping Information

Desktop:

Readable content column with supporting side navigation/summary only if content volume requires it.

Primary content remains the focus.

Use structured headings and paragraphs.

No decorative cards.

---

## Section 4 — Returns Information

Same structure as Shipping.

Use clear numbered process only if the approved client policy itself specifies a process.

---

## Section 5 — Customer Support

Dark emerald or warm ivory support block.

CTA:

`Contact Aurora`

WhatsApp/contact functionality where applicable.

---

## Section 6 — Footer

Global footer.

---

# PRIVACY POLICY

## Section 1 — Navbar

Simplified but standard legal navigation.

---

## Section 2 — Page Header

Centered:

* `Privacy Policy`
* Effective/update information only when supplied

No hero photography.

---

## Section 3 — Privacy Policy Content

Maximum reading width:

`760px`.

Use:

* H2 legal section headings
* Body paragraphs
* Lists where present in approved legal copy

Text:

16px / 1.65 line height.

---

## Section 4 — Related Legal Navigation

Three simple text links:

* Terms & Conditions
* Shipping & Returns
* Contact

No cards.

---

## Section 5 — Footer

Global footer.

---

# TERMS & CONDITIONS

## Section 1 — Navbar

Standard legal navigation.

---

## Section 2 — Page Header

Centered:

* `Terms & Conditions`
* Effective/update information only when supplied

---

## Section 3 — Terms & Conditions Content

Maximum width:

`760px`.

Use structured legal typography.

No editorial photography.

No decorative animation.

---

## Section 4 — Related Legal Navigation

Links:

* Privacy Policy
* Shipping & Returns
* Contact

---

## Section 5 — Footer

Global footer.

---

# CART

## Section 1 — Simplified Commerce Navbar

Keep:

* Aurora wordmark
* Minimal navigation
* Bag state

Remove unnecessary marketing navigation emphasis.

---

## Section 2 — Cart Header

Large but compact serif title:

`Your Bag`

Below:

Item count.

---

## Section 3 — Cart Product List

Desktop:

Two-column structure:

* Left: product list
* Right: sticky summary

Each item:

1. Product image
2. Product name
3. Selected variant
4. Price
5. Quantity
6. Remove/edit
7. Stock/status where applicable

Mobile:

Single-column product list followed by summary.

---

## Section 4 — Discount / Coupon

Input + `Apply`.

Success/error appears directly below.

No modal coupon interaction.

---

## Section 5 — Cart Summary

Order:

1. Product subtotal
2. Discount where applicable
3. Applicable delivery/total information
4. Final total

Primary CTA:

`Proceed to Checkout`

---

## Section 6 — Continue Shopping

Secondary text/button:

`Continue Shopping →`

---

## Section 7 — Commerce Footer

Compact footer containing:

* Support
* Legal links

No large editorial brand statement.

---

# CHECKOUT

## Section 1 — Checkout Header

Minimal header.

Only:

* Aurora wordmark
* Essential bag/security/trust context where confirmed

No full marketing navigation.

---

## Section 2 — Customer / Delivery Information

Desktop:

Two-column checkout layout.

Left:

Customer and delivery form.

Right:

Order summary.

Fields use:

* Visible labels
* 48–52px controls
* Strong focus states
* Inline validation

---

## Section 3 — Saved Address Selection

Only displayed for registered customers with saved addresses.

Use simple selectable rows.

Selected state:

* Emerald border
* Soft emerald background
* Check icon

---

## Section 4 — Delivery / Shipping Information

Display the applicable confirmed Pakistan-first shipping information.

Do not invent courier names or shipping prices.

---

## Section 5 — Order Summary

Right-side desktop panel.

Contents:

* Product thumbnail
* Product name
* Variant
* Quantity
* Price
* Discount
* Shipping-related pricing where applicable
* Final total

Mobile:

Order summary becomes a collapsible or compact section above payment completion, without obscuring essential pricing.

---

## Section 6 — Payment Method

Display:

* Cash on Delivery
* Online payment

Exact payment provider branding appears only after the provider is confirmed.

Use radio-style selection with rectangular editorial styling.

---

## Section 7 — Final Purchase CTA

Full-width primary CTA:

`Place Order` / `Complete Purchase`

Use one exact label based on the implemented transaction state; do not display both simultaneously.

Loading:

`Processing…`

Keep button dimensions fixed.

---

## Section 8 — Checkout Validation / Error States

Inline errors.

Payment errors must explain:

* What failed
* What the customer can do next

Do not rely on red alone.

---

## Section 9 — Order Processing State

Show processing feedback within the checkout flow.

Do not create a separate Order Confirmation page because it is not approved in the sitemap.

---

## Section 10 — Minimal Footer

Only:

* Privacy Policy
* Terms & Conditions
* Shipping & Returns
* Contact

No large marketing footer.

---

# CUSTOMER ACCOUNT — PROFILE

## Section 1 — Account Header

Desktop:

Aurora wordmark with account utility.

Mobile:

Menu + Aurora + Bag.

---

## Section 2 — Account Navigation

Desktop horizontal/side navigation:

1. Profile
2. Order History
3. Saved Addresses
4. Wishlist

Mobile:

Compact horizontal navigation or stacked account menu.

---

## Section 3 — Profile Information

Single clean form column.

Fields contain visible labels and values.

No card-heavy dashboard treatment.

---

## Section 4 — Profile Actions

Primary:

`Save Changes`

Validation appears inline.

Success feedback uses semantic icon + text.

---

## Section 5 — Footer

Global footer, compacted for account context.

---

# CUSTOMER ACCOUNT — ORDER HISTORY

## Section 1 — Account Header

Global account header.

---

## Section 2 — Account Navigation

Profile / Order History / Saved Addresses / Wishlist.

---

## Section 3 — Order History

Desktop:

Minimal table/list.

Each order row contains only information confirmed to be available.

Use:

* Order identifier
* Date where available
* Order summary
* Available status information

No invented tracking interface.

Mobile:

Rows become stacked order records.

---

## Section 4 — Order Selection / Detail State

Selecting an order reveals the available order information within the approved account experience.

Do not invent a separate Order Detail page.

---

## Section 5 — Footer

Global footer.

---

# CUSTOMER ACCOUNT — SAVED ADDRESSES

## Section 1 — Account Header

Global account header.

---

## Section 2 — Account Navigation

Profile / Order History / Saved Addresses / Wishlist.

---

## Section 3 — Saved Address List

Each saved address uses a clean rectangular record.

Actions:

* Edit
* Remove

Do not use oversized rounded cards.

---

## Section 4 — Address Form

Visible fields.

Clear labels.

Inline validation.

Primary CTA:

`Save Address`

Editing changes CTA to:

`Update Address`

---

## Section 5 — Footer

Global footer.

---

# CUSTOMER ACCOUNT — WISHLIST

## Section 1 — Account Header

Global account header.

---

## Section 2 — Account Navigation

Profile / Order History / Saved Addresses / Wishlist.

---

## Section 3 — Wishlist Product Grid

Desktop:

4 columns.

Mobile:

2 columns.

Each product:

* Image
* Name
* Price
* Wishlist/remove control
* Stock/status where applicable

---

## Section 4 — Purchase Action

Product links to Product Detail.

Use:

`View Product →`

Do not invent a separate direct-purchase flow if it is not implemented.

---

## Section 5 — Empty Wishlist State

Centered editorial empty state.

Structure:

```text
Wishlist
Your saved pieces will appear here.
Explore Jewelry →
```

CTA:

`Explore Jewelry`

No decorative illustration unless supplied.

---

## Section 6 — Footer

Global footer.

---

# 10. MOTION BLUEPRINT

## Homepage

**Medium**

Approved:

* Image reveal masks
* Typography entrance
* Editorial image transitions
* Subtle parallax
* Product hover

## Shop / New Arrivals / Collections

**Low–Medium**

Approved:

* Heading reveal
* Product image scale
* Image crossfade
* Editorial reveals

## Product Detail

**Medium**

Approved:

* Gallery transitions
* Image reveal
* Add-to-bag microinteraction
* Detail accordion

## Cart

**Low**

Approved:

* Quantity transition
* Drawer entrance
* Inline confirmation

## Checkout

**Very Low**

Only:

* Focus transitions
* Validation feedback
* Loading state
* Essential state changes

## Account

**Low**

Only functional transitions.

## Legal

**Minimal**

No decorative scroll effects.

---

# 11. RESPONSIVE BLUEPRINT

## Desktop ≥ 1024px

Use full editorial compositions.

* Asymmetric layouts
* 12-column grid
* Large typography
* Hover interactions
* Controlled parallax

## Tablet 768–1023px

Simplify:

* 8-column grid
* Smaller editorial offsets
* Reduced hero image height
* Reduced typography
* No unnecessary overlap

## Mobile < 768px

Rules:

* 4-column grid
* 20px page padding
* 2-column product grids
* Stacked editorial sections
* Reduced image motion
* No parallax
* No mouse interaction
* No hover-dependent functionality
* Simplified navigation
* Sticky purchase control only where genuinely useful on Product Detail

Mobile must feel like **the same luxury brand expressed more efficiently**, not a shrunken desktop page.

---

# 12. COMPONENT GEOMETRY

## Buttons

* Height: `50–52px`
* Radius: `2px`
* Padding: `24–32px`
* No pills

## Inputs

* Height: `48–52px`
* Radius: `2–4px`
* Border: `1px #DDD9D0`

## Product images

* Ratio: `4:5`

## Standard editorial radius

* `0–4px`

## Dividers

* `1px #DDD9D0`

## Primary focus ring

* `2px #123C36`
* Offset: `3px`

## Floating shadow

Only where layering is required:

`0 12px 40px rgba(16,20,18,0.08)`

---

# 13. ACCESSIBILITY BEHAVIOR

Every interactive element must have:

* Keyboard accessibility
* Visible focus
* Logical focus order
* Accessible name
* Non-hover alternative
* Touch-friendly hit area

Forms must use visible labels.

Errors require:

* Text
* Semantic state
* Appropriate icon where useful
* Color as supplementary information only

Images require meaningful alt text where informative.

Decorative images use empty alternative text.

Reduced-motion mode disables:

* Parallax
* Mouse-follow
* Decorative stagger
* Image zoom animation
* Page movement transitions

---

# 14. PERFORMANCE RULES

The generator must prioritize:

1. Above-the-fold product/hero image loading
2. Responsive image sizing
3. Lazy loading below the fold
4. Efficient font loading
5. Minimal animation JavaScript
6. No persistent decorative animation
7. No launch 3D
8. No full-screen loading animation
9. No video unless explicitly introduced into approved content
10. No animation that blocks shopping

The interface must become usable before editorial animation completes.

---

# 15. ABSOLUTE DO-NOT-GENERATE RULES

The UI generator must not introduce:

* Indigo
* Violet
* SaaS gradients
* Bootstrap-blue
* Neon accents
* Gold-heavy backgrounds
* Glassmorphism
* Frosted cards
* Pill-shaped primary navigation
* 12px+ generic rounded cards
* Heavy card shadows
* Generic centered SaaS hero
* Floating dashboard cards
* Decorative sparkle icons
* Gemstone clip-art
* Crown graphics
* Glitter effects
* Ornate borders
* Persistent parallax
* Bouncing interactions
* Elastic easing
* Custom cursor as default
* Decorative 3D
* Full-screen 3D
* Generic stock photography
* Dense marketplace grids
* Unapproved filter/sort interfaces
* Unapproved search-results page
* Journal/Blog/Editorial content page
* Login/register pages as separate sitemap pages
* Password reset page
* Order confirmation page
* Order tracking page
* Guest wishlist page
* Individual collection pages as independently confirmed sitemap pages
* International/localized pages
* Additional admin pages
* Additional checkout stages

---

# 16. UI GENERATION PRIORITY

When visual elements compete, apply this hierarchy:

### 01 — Jewelry

Product photography always wins.

### 02 — Primary action

Add to Bag, Proceed to Checkout, Place Order and equivalent confirmed actions remain unmistakable.

### 03 — Editorial typography

Use large serif type to establish brand character.

### 04 — Whitespace

Do not fill unused space merely to increase visual density.

### 05 — Emerald structure

Use emerald for hierarchy and action.

### 06 — Champagne detail

Use champagne sparingly.

### 07 — Motion

Motion enhances the composition but never becomes the composition.

---

# 17. FINAL STITCH GENERATION DIRECTIVE

Generate Aurora Jewels as a **premium editorial jewelry house with commerce functionality**, not as a conventional online store.

The visual language must consistently communicate:

**quiet luxury, intimate sophistication, editorial confidence, timeless femininity and effortless shopping.**

The homepage should feel cinematic through **photography, typography and composition**, not through a cinematic loading sequence.

Marketing pages should breathe.

Commerce pages should become progressively more structured.

Product Detail should make the jewelry itself the hero.

Cart should remove distraction.

Checkout should remove almost everything except trust and completion.

Account screens should feel premium but functional.

Legal/support screens should prioritize reading clarity.

Use **Cormorant Garamond + Manrope**, **#123C36 emerald + #FAF8F3 ivory + #101412 near-black + #C6A56A champagne**, minimal line icons, 4:5 product photography, architectural low-radius geometry and restrained motion.

**No creative substitutions are permitted where this blueprint specifies an exact value, structure, hierarchy, interaction or visual treatment.**
