# Agent Developer Guidelines — Aurora Jewels

Welcome. This document serves as the absolute rulebook, constraint boundary, and coding standard for all AI agents modifying or extending this codebase.

---

## 🔒 CRITICAL: Architecture Status is LOCKED

The approved architecture is frozen. You are strictly forbidden from modifying the core framework, backend, database, authentication, or deployment environments without explicit human approval.

> [!IMPORTANT]
> If you discover an architectural flaw, limitation, or dependency conflict, **do not attempt to fix or work around it silently**. You must **STOP immediately** and create a formal **Architecture Change Request** in the chat context.

---

## 1. Project Purpose
Aurora Jewels is a premium jewelry brand targeting Pakistan first. The website is designed to be a quiet-luxury digital editorial store that provides an immersive brand experience while delivering fast, frictionless, and highly responsive shopping.

---

## 2. Approved Architecture & Tech Stack
All codebase components must operate under the following locked stack configurations:
* **Frontend**: Astro (Hybrid SSR mode) running on Cloudflare Pages.
* **Backend APIs**: Astro API Serverless Routes (runs natively at the Edge via Cloudflare Workers).
* **Database**: Cloudflare D1 (Serverless SQLite).
* **ORM**: Drizzle ORM (runs migrations via Drizzle Kit).
* **Storage**: Cloudflare R2 (S3-compatible bucket, zero bandwidth/egress fees).
* **Payments**: **Cash on Delivery (COD) Only** (No online gateway integrations allowed).
* **Emails**: Resend API (triggered asynchronously using serverless `ctx.waitUntil()` to bypass messaging queue caps).
* **2D Animations**: GSAP (GreenSock) + ScrollTrigger.
* **3D rendering**: None at launch (strictly excluded).
* **Hosting / CI-CD**: Cloudflare Pages connected directly to GitHub repositories.

---

## 3. Folder Structure
Maintain the following directory layout:
```text
├── database/
│   └── schema.ts           # Relational schema mapping (Drizzle SQLite table exports)
├── app/
│   ├── astro.config.mjs    # Astro hybrid edge configurations
│   ├── tailwind.config.mjs # Tailwind design token setups
│   ├── tsconfig.json       # TypeScript path aliases
│   ├── .eslintrc.json      # Code quality rules
│   ├── .prettierrc         # Format preferences
│   └── src/
│       ├── components/     # Reusable React UI elements / Astro UI islands
│       ├── layouts/        # Base layout templates
│       ├── pages/          # Static layout pages and serverless API endpoints
│       │   ├── api/        # Serverless API routes (e.g. checkout, reviews)
│       │   └── admin/      # JWT-guarded store administrative CRUD routes
│       └── styles/         # global.css with design token variable bindings
```

---

## 4. Coding & Naming Conventions
* **Language**: TypeScript only. Enforce strict type checking; avoid the use of `any`.
* **Filenames**: 
  * Astro pages & components: PascalCase (e.g., `ProductCard.astro`, `Layout.astro`).
  * API endpoints and scripts: kebab-case or camelCase (e.g., `checkout.ts`, `schema.ts`).
* **Variables / Functions**: camelCase for variables/functions, PascalCase for classes/types, UPPER_SNAKE_CASE for environment secrets.
* **Formatting**: 2 spaces indent, single quotes, semi-colons enforced. Files must compile cleanly without ESLint warnings.

---

## 5. Component Rules
* **Islands Architecture**: Maximize static Astro rendering. Only load React components (`client:load`, `client:visible`) where real-time client-side interactivity is required (e.g., Cart drawers, Checkout address validation, dynamic Wishlist counts).
* **Sharp Corners**: All UI elements must have a strict `0px` border radius (`rounded-none`). Rounded borders, inputs, buttons, cards, or containers are prohibited.
* **State Management**: Cart state must reside in lightweight, edge-compatible local storage wrappers (e.g., client-side reactive variables) instead of heavy state manager packages.

---

## 6. API Rules
* **Edge-Native**: All endpoints under `src/pages/api/*` must run in the edge serverless environment. Mark files with `export const prerender = false`.
* **JSON Schema**: Always validate incoming request structures. Return explicit error responses:
  * `400 Bad Request` with structured field messages for validation failures.
  * `401 Unauthorized` / `403 Forbidden` for failed JWT/role checks.
  * `500 Internal Server Error` without leaking database schema internals.
* **REST Standards**: Use POST/PUT for resource state changes and GET for data queries.

---

## 7. Database Rules
* **Schema Integrity**: Declare all mappings inside `database/schema.ts` using Drizzle SQLite builders.
* **Types**: Store prices as Integers in cents (e.g. 5000 = Rs. 50.00) to prevent precision errors. Store timestamps as Integers (epoch seconds).
* **Relational Actions**: Enforce `onDelete: 'cascade'` on associated product relations (`product_images`, `product_variants`).

---

## 8. Authentication & Authorization Rules
* **Stateless Edge Sessions**: Restrict administrator routing via Signed JWTs stored in secure client cookies (`HttpOnly`, `Secure`, `SameSite=Strict`).
* **Middleware checks**: Authenticate admin routes (`/admin/*`) globally inside Astro edge middleware before executing page-rendering.

---

## 9. Design-System & Motion Rules (Quiet Luxury)
* **Visual Palette**: Dominant Ivory background (`#FAF8F3`), Deep Emerald structures (`#0D302B`), Champagne accents (`#C6A56A`), and Near Black text (`#171A18`).
* **Accents**: Gold must remain an accent (underlines, highlights) and never visually dominate.
* **Elevation**: Flat design only. Drop shadows, box blurs, and metallic gradients are prohibited.
* **Motion Constraints**: Keep animations subtle and slow (duration 600ms–900ms). Animations should only trigger on page transition, initial entry, or scroll-reveals. Avoid explosive, spring, or bouncing movements.

---

## 10. 3D Rules
* **Strict Prohibition**: 3D rendering (WebGL, Three.js) is excluded. Do not install 3D rendering packages or write interactive 3D script tags.

---

## 11. Accessibility (a11y) & SEO Rules
* **A11y**: Use semantic HTML markup (headers, main, section). Provide screen-reader alt text for all photography. Respect system preferences by disabling GSAP animations via media queries (`prefers-reduced-motion`).
* **SEO**: Inject product JSON-LD schemas automatically on all product detail page loads. Output dynamic XML sitemaps and ensure meta description headers are present on all editorial pages.

---

## 12. Testing & Security Rules
* **Testing**: Write unit tests for checkout validation models and price calculation helpers using Vitest.
* **Security Constraints**: Cloudflare Free WAF is limited to basic DDoS. You must validate input structures and enforce verification steps inside the custom backend code.

---

## 13. Git Rules
* **Flow**: Commit small, logical changes. Write clean, descriptive imperative commit messages (e.g. `feat: implement shipping form validations`).
* **Secrets**: Never commit `.env` files or API secrets. Ensure `.gitignore` ignores Wrangler and SQLite database outputs.
