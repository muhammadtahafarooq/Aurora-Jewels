---
name: Aurora Editorial
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#414846'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#717976'
  outline-variant: '#c1c8c5'
  surface-tint: '#43655e'
  primary: '#001a17'
  on-primary: '#ffffff'
  primary-container: '#0d302b'
  on-primary-container: '#769992'
  inverse-primary: '#aacec6'
  secondary: '#755a27'
  on-secondary: '#ffffff'
  secondary-container: '#ffdb9c'
  on-secondary-container: '#795e2b'
  tertiary: '#290e08'
  on-tertiary: '#ffffff'
  tertiary-container: '#41221a'
  on-tertiary-container: '#b5877b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6eae2'
  primary-fixed-dim: '#aacec6'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#2c4d47'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#e5c284'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5b4311'
  tertiary-fixed: '#ffdbd2'
  tertiary-fixed-dim: '#eebbae'
  on-tertiary-fixed: '#2f140c'
  on-tertiary-fixed-variant: '#623e34'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  editorial-italic:
    fontFamily: ebGaramond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  functional-sm:
    fontFamily: manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system is rooted in the "Quiet Luxury" aesthetic—a philosophy that prioritizes material quality, architectural precision, and understated confidence. It is designed for high-end jewelry e-commerce and editorial storytelling, where the product photography is the protagonist.

The visual style is **Minimalist-Architectural**. It rejects the soft, bubbly trends of common UI in favor of sharp edges, expansive white space, and a strict adherence to a grid. The emotional response is one of calm authority and timelessness. There are no shadows, no gradients, and no decorative flourishes; every element serves a functional or structural purpose.

## Colors
The palette is a sophisticated interplay of organic light and deep, saturated tones.
- **Primary (#0D302B):** A Deep Emerald used for brand moments, primary calls to action, and high-impact containers.
- **Secondary/Accent (#C6A56A):** A Champagne gold used sparingly for highlights, active states, or rare interactive accents.
- **Neutral/Background (#FAF8F3):** An Ivory base that provides a warmer, more premium feel than pure white.
- **Surface Alt (#F5F0E7):** Warm Ivory for subtle section differentiation or secondary containers.
- **Text/Contrast (#101412):** A Near Black used for maximum legibility and heavy editorial weight.

## Typography
The typography strategy relies on the tension between the classicism of the Serif and the modernity of the Sans-serif.
- **ebGaramond (Headlines):** Used for all editorial statements and product titles. High-scale displays should utilize the "italic" variants to emphasize the "Luxury" narrative.
- **Manrope (UI/Body):** Provides a clean, functional counterpoint. It is used for all technical data, price points, navigation, and long-form descriptions.
- **Editorial Contrast:** Large display headings should use tighter letter spacing, while small labels should use generous tracking (uppercase) to create a sense of breath.

## Layout & Spacing
This design system uses a **Fixed Grid** model for desktop to maintain editorial control over image composition. 
- **Grid:** A 12-column grid with 24px gutters.
- **Asymmetry:** Layouts should intentionally break symmetry. For example, a hero image may occupy 7 columns while the text occupies 4, leaving a 1-column vacuum to create visual tension.
- **Vertical Rhythm:** Generous section gaps (120px+) are encouraged to prevent the interface from feeling cluttered or "standard e-commerce." 
- **Mobile:** Reflow to a single column with 20px margins, maintaining the large Garamond headlines but scaling down the font size for readability.

## Elevation & Depth
This design system is strictly **Flat**. 
- **No Shadows:** Depth is never communicated through drop shadows or blurs.
- **Tonal Layering:** Hierarchy is achieved solely through color blocking (e.g., a Deep Emerald section following an Ivory section) and hair-line borders.
- **Structural Lines:** Use 1px solid borders in `#101412` (at low opacity, 10-15%) or `#C6A56A` to define areas without creating "weight."
- **Focus:** Selection and hover states are communicated via color fills or text underlines rather than elevation.

## Shapes
The shape language is **Square/Sharp**. 
- Every button, input field, card, and image container must have a 0px border radius. 
- This reinforces the architectural and precision-driven nature of the brand.
- **Icons:** Icons should use 1.25px stroke weight with rounded caps (to prevent them from appearing too aggressive) but the containers they sit in remain strictly rectangular.

## Components
- **Buttons:** Primary buttons are solid Deep Emerald with Ivory text, sharp corners, and no border. Secondary buttons are transparent with a 1px Near Black border. Hover states should involve a subtle color shift (e.g., Emerald to a slightly lighter tint).
- **Input Fields:** Minimalist design—only a bottom border (1px) in Near Black. Labels use the `label-caps` style sitting above the line.
- **Cards:** No background or shadow. Cards are defined by the product image. Titles sit below the image in ebGaramond, with price/metadata in Manrope.
- **Navigation:** Top-tier navigation uses Manrope Medium in uppercase. The active state is indicated by a simple 1px underline.
- **Chips/Filters:** Rectangular boxes with 1px borders. Active states fill the box with Deep Emerald.
- **Lists:** Clean, hair-line separators between items. High contrast between primary text and secondary metadata.
- **Editorial Callouts:** Large-scale Garamond quotes or statements centered with significant padding (160px+) above and below.