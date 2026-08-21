# Agent Instructions — Aurora Jewels Developer Guidelines

Welcome, AI Agent. This document outlines the constraints, rules, and workspace architecture you must respect when modifying or extending this codebase.

---

## 🔒 Mandatory Constraints

1. **Architecture Status**: **LOCKED**. Refer to [docs/ARCHITECTURE_STATUS.md](file:///d:/Projects/%5BAurora%20Jewels%5D/docs/ARCHITECTURE_STATUS.md) for detail. You are strictly forbidden from changing the core stack (Astro, Cloudflare Pages, Cloudflare D1/R2, Drizzle ORM, Resend).
2. **Payments**: **Cash on Delivery (COD) Only**. Do not write, integrate, or import any online card/wallet processing library.
3. **100% Free Tier Compliance**:
   - Host all assets/pages entirely on **Cloudflare Pages/D1/R2** (which cost \$0 at this scale).
   - Do not request or implement integrations with any paid databases or container hosts (e.g. Render, Railway, Supabase).
   - Use **Astro's compile-time image pipeline (`astro:assets` and Sharp)** for image optimization. Do not use Cloudflare Polish or paid dynamic edge compression.
   - Use **`ctx.waitUntil()`** to run background jobs asynchronously on Cloudflare serverless (e.g., sending emails). Do not import queues or use BullMQ.

---

## 🎨 Visual Guidelines (Quiet Luxury)

All frontend components must respect the style directions in [docs/design-system.md](file:///d:/Projects/%5BAurora%20Jewels%5D/docs/design-system.md):
- **Borders & Shapes**: Strict `0px` border radius (`rounded-none`). No rounded buttons, forms, cards, or inputs.
- **Colors**: Rely on Ivory background (`#FAF8F3`), Deep Emerald structures (`#0D302B`), and Champagne accents (`#C6A56A`). Gold/Champagne must never dominate.
- **Elevation**: Flat design. No drop shadows. Use 1px thin solid borders (`#DDD9D0` at low opacity) for structural divisions.
- **Fonts**:EB Garamond for serif headings/italics; Manrope for sans-serif prices, UI buttons, forms, and metadata.

---

## 📂 Core Directory Structure

- `/app/src/pages/` - Store pages (e.g., editorial lists, checkout forms, and `/admin` routes).
- `/app/src/pages/api/` - Serverless edge API endpoints (SSR).
- `/app/src/styles/global.css` - Global CSS variables mapped to design system tokens.
- `/database/schema.ts` - Drizzle database definitions. Modify this file if database structure modifications are required.

---

## 💻 Commands

Navigate into `/app/` and run:
- Dev server: `npm run dev`
- Build check: `npm run build`
- Drizzle migrations: `npm run db:generate` / `npm run db:migrate`
