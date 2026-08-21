# Aurora Jewels — Software Architecture Design (100% Free / COD Only)

This document details the production-ready architecture designed for **Aurora Jewels**, optimized for a premium editorial storefront, fast mobile performance in Pakistan, 50–100 initial products, and strict compliance with the **100% Free** and **COD Only** constraints.

---

## 1. Frontend & Backend Framework (Unified Edge Serverless)

* **What:** **Astro (Hybrid SSR Mode)** deployed on **Cloudflare Pages**.
* **Why:** 
  * Traditional Node.js hosts (e.g., Render, Railway) sleep on their free tiers, causing a 50+ second cold start delay that violates the mobile-performance requirement. 
  * Cloudflare Pages is **100% free** (unlimited bandwidth, 100k requests/day, 100 builds/month) and deploys our code to edge serverless functions (Cloudflare Workers) with **zero cold starts**. 
  * Astro handles fast static rendering for editorial pages (Home, About, Shop) and runs serverless API routes (`/api/checkout`, `/api/reviews`) at the edge for dynamic operations.
* **Alternatives:**
  * *Next.js on Vercel:* Next.js runs well on Vercel's free tier, but Astro produces lighter, faster page payloads for content-focused stores.
* **Trade-offs:** Serverless execution is limited to 10ms CPU time per request on the free tier, which is more than enough for database CRUD but prevents heavy compute tasks.
* **Cost:** \$0 (100% Free Tier).
* **Complexity:** Low (Single codebase for frontend and serverless APIs).
* **Risks:** Vendor lock-in to Cloudflare’s runtime, mitigated by writing standard JavaScript.

---

## 2. Database

* **What:** **Cloudflare D1** (Serverless SQLite at the Edge).
* **Why:** 
  * Standard free SQL databases (e.g., Render, Supabase) either expire after a trial period or sleep when inactive.
  * Cloudflare D1 is native to Cloudflare Pages, does not sleep, and has a highly generous free tier (5 million reads/day, 100k writes/day, and 5GB storage) that is more than sufficient for 50–100 products and thousands of monthly orders.
* **Alternatives:**
  * *Turso (Edge SQLite):* Excellent free tier, but requires importing external SDKs and managing an independent service.
* **Trade-offs:** D1 is SQLite-based, meaning it lacks advanced Postgres features, but e-commerce CRUD operations do not require them.
* **Cost:** \$0 (100% Free Tier).
* **Complexity:** Low (Integrates natively with Cloudflare configuration).
* **Risks:** None for a catalog of this scale.

---

## 3. ORM (Object-Relational Mapping)

* **What:** **Drizzle ORM**.
* **Why:** Drizzle provides a type-safe, lightweight mapping layer with first-class native support for Cloudflare D1. It compiles to direct SQL queries, ensuring zero performance overhead at runtime.
* **Alternatives:**
  * *Prisma:* Heavy engine file size that exceeds Cloudflare Worker deployment size limits and slows down startup.
* **Trade-offs:** Requires writing SQL-like queries, which is a performance benefit.
* **Cost:** \$0 (Open Source).
* **Complexity:** Low.
* **Risks:** None.

---

## 4. Authentication

* **What:** **JWT Token Sessions** via HTTP-only Cookies (signed using a Cloudflare environment secret).
* **Why:** Keeps authentication fast, stateless, serverless, and completely free. Avoids external dependencies.
* **Alternatives:**
  * *Clerk / Auth0:* Free tiers exist but introduce API latency and lock vendor lock-in.
* **Trade-offs:** Requires writing standard JWT signing logic in our API routes.
* **Cost:** \$0 (Built-in).
* **Complexity:** Low-to-Medium.
* **Risks:** Token hijacking, mitigated by setting `Secure`, `HttpOnly`, and `SameSite=Strict` cookie flags.

---

## 5. Authorization

* **What:** **Astro Serverless Middleware (RBAC)**.
* **Why:** Restricts access to `/admin/*` routes to authenticated admin tokens. Checked instantly at the edge.
* **Alternatives:** None needed.
* **Trade-offs:** None.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** Privilege escalation, prevented by signing administrative payload claims cryptographically.

---

## 6. API Architecture

* **What:** **Astro API Routes (REST)**.
* **Why:** Simple, lightweight endpoints (e.g., `/api/checkout`, `/api/wishlist`) placed in the same repository as the frontend, running on Cloudflare Workers.
* **Alternatives:**
  * *GraphQL:* Excessive schema compilation size for a basic COD order flow.
* **Trade-offs:** None.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 7. File Storage

* **What:** **Cloudflare R2** (S3-compatible Object Storage).
* **Why:** R2 provides a generous free tier (10GB storage, 1 million read actions/month, 10k write actions/month) and has **zero egress fees**. Highly optimized for serving high-res editorial product photos without ongoing costs.
* **Alternatives:**
  * *AWS S3:* Charges egress fees on all image downloads, violating the free constraint.
* **Trade-offs:** Requires simple setup of a custom domain to cache R2 images via Cloudflare CDN.
* **Cost:** \$0 (100% Free Tier).
* **Complexity:** Low.
* **Risks:** None.

---

## 8. Search

* **What:** **SQL Full-Text Search / SQL `LIKE` Queries**.
* **Why:** With a launch catalog of only 50–100 products, external indexers (like Algolia) are completely unnecessary. Relational text queries inside SQLite are sub-millisecond fast and cost \$0.
* **Alternatives:**
  * *Algolia:* Paid search tool.
* **Trade-offs:** Lacks advanced typo correction, which is irrelevant for a small catalog.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 9. Payments (MANDATORY CONSTRAINT)

* **What:** **Cash on Delivery (COD) Only**.
* **Why:** Fully complies with the Payments Constraint. Eliminates setup fees, transaction percentages, bank/business verification delays, and integration complexity.
* **Alternatives:** None allowed under the constraint.
* **Trade-offs:** COD orders require manual verification (e.g., WhatsApp confirmation) by the store owner to prevent fake orders.
* **Cost:** **Transaction Fees: \$0**.
* **Complexity:** Low.
* **Risks:** Order return-to-origin (RTO) rate, managed operationally via phone verification.

---

## 10. Email Service

* **What:** **Resend** (for transactional emails) + **Mailerlite** (for newsletter).
* **Why:** Resend provides an elegant API with 3,000 free emails/month (ideal for sending automated invoice notifications to customers). Mailerlite handles marketing campaigns free up to 1,000 subscribers.
* **Alternatives:**
  * *SendGrid:* High cost and complex dashboard setup.
* **Trade-offs:** Requires the client to purchase a custom business email domain (e.g., `@aurorajewels.pk`), which is an **unavoidable cost** of running a professional store.
* **Cost:** 
  * Integration & Service API: **\$0**.
  * Domain Name Purchase: **Unavoidable Commercial Cost** (approx. \$10–\$15/year).
* **Complexity:** Low.
* **Risks:** Deliverability issues, mitigated by configuring SPF, DKIM, and DMARC.

---

## 11. Admin Panel

* **What:** **Astro-based Admin Dashboard (`/admin/*`)**.
* **Why:** Since MedusaJS cannot be hosted for free without database expiration and cold starts, a lightweight custom admin panel is implemented directly inside the Astro project. It provides simple CRUD UI screens to add/edit products, update inventory, and mark orders as "shipped" directly in Cloudflare D1.
* **Alternatives:**
  * *Supabase Studio:* Relies on Supabase hosting, which has cold-start database limitations.
* **Trade-offs:** Requires building basic UI pages for CRUD operations, but Tailwind makes this fast (approx. 2–3 days of work).
* **Cost:** \$0.
* **Complexity:** Low-to-Medium.
* **Risks:** Security configuration, mitigated by placing strict middleware authentication on all `/admin/` routes.

---

## 12. 2D Animation & Motion

* **What:** **GSAP (GreenSock)** + **Astro View Transitions**.
* **Why:** GSAP provides standard scroll-linked animations for luxury storytelling, while Astro View Transitions handles smooth page navigation morphing.
* **Alternatives:**
  * *Framer Motion:* Tied to React layout shifts.
* **Trade-offs:** Adds a 25KB script to the frontend.
* **Cost:** \$0 (Standard GreenSock License).
* **Complexity:** Medium.
* **Risks:** Jank on low-end devices, mitigated by using GSAP only for transform-based CSS animations.

---

## 13. 3D Rendering

* **What:** **None at launch** (as explicitly defined by the SRS and design system).
* **Why:** Maximizes mobile load speed and keeps bundle sizes minimal.
* **Alternatives:** None.
* **Cost:** \$0.
* **Complexity:** None.
* **Risks:** None.

---

## 14. Caching

* **What:** **Cloudflare CDN caching (Edge Cache)**.
* **Why:** Cloudflare automatically caches compiled HTML pages and R2 image assets at edge nodes nearest to the shoppers in Pakistan, bypassing D1 reads for repeat visits.
* **Alternatives:**
  * *Redis:* Free tiers exist but add API connection latency and complexity.
* **Trade-offs:** Requires purging the CDN cache when product prices or stock are updated, which is simple to trigger via Cloudflare APIs.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** Cache mismatch, managed by using short TTLs on price-critical files.

---

## 15. Background Jobs

* **What:** **Asynchronous Workers via `ctx.waitUntil()`**.
* **Why:** 
  * Cloudflare Queues' free tier has extremely low limits (typically capped at 10,000 messages/month), which could throttle during sales.
  * Instead, we use Cloudflare’s native `ctx.waitUntil()` feature. This allows serverless Workers/Pages to instantly return an HTTP response to the client while keeping the worker thread alive in the background to finish executing asynchronous tasks (e.g., triggering a Resend email or updating stock counts).
* **Alternatives:**
  * *BullMQ:* Requires a paid or external Redis instance, violating the free constraint.
* **Trade-offs:** If a serverless function crashes, the pending background promise might be lost; however, this is a negligible risk for non-financial COD order notification emails.
* **Cost:** \$0 (Included natively in Cloudflare Workers/Pages free execution limits).
* **Complexity:** Low.
* **Risks:** None.

---

## 16. Hosting

* **What:** **Cloudflare Pages**.
* **Why:** Completely free static + serverless hybrid hosting with unlimited bandwidth, global CDN delivery, and zero cold starts.
* **Alternatives:**
  * *Vercel:* Excellent free tier, but bandwidth is capped at 100GB/month (Cloudflare has no bandwidth cap on Pages).
* **Trade-offs:** None.
* **Cost:** \$0 (100% Free Tier).
* **Complexity:** Low.
* **Risks:** None.

---

## 17. CI/CD

* **What:** **GitHub Actions + Cloudflare Pages Integration**.
* **Why:** Commits to GitHub automatically trigger Cloudflare builds. Free, fast, and requires zero configuration.
* **Alternatives:** None needed.
* **Trade-offs:** None.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 18. Security

* **What:** **Application-Level Middleware Route Protection + Cloudflare Baseline DDoS Mitigation**.
* **Why:** 
  * Cloudflare's free plan only includes basic DDoS protection and automatic security rules; custom WAF rules (e.g. rate-limiting specific paths, custom firewall rules for `/api/checkout` or `/admin/*`) require a paid Pro tier.
  * To remain 100% free, we enforce security at the application level. Astro Edge Middleware intercepts all `/admin/*` requests to cryptographically verify JWT signatures, and checkout endpoints validate payload structures and apply serverless rate-limiting helpers.
* **Alternatives:**
  * *Cloudflare Pro WAF:* Paid plan ($20/month).
* **Trade-offs:** Puts the responsibility of endpoint security validation on the application code rather than delegating it to the DNS edge proxy.
* **Cost:** \$0.
* **Complexity:** Low-to-Medium.
* **Risks:** Vulnerabilities in custom authentication/middleware code, mitigated by using audited crypto libraries (e.g., Jose) and thorough verification paths.

---

## 19. SEO

* **What:** **Astro Static Generation + XML Sitemaps + JSON-LD Schemas**.
* **Why:** Astro outputs fully compiled static HTML for crawlers, and the sitemap updates on build.
* **Alternatives:** None needed.
* **Trade-offs:** None.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 20. Accessibility (a11y)

* **What:** **Semantic HTML + prefers-reduced-motion queries**.
* **Why:** Ensures luxury visual aesthetics are usable by everyone.
* **Alternatives:** None.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 21. Performance Optimization

* **What:** **Build-Time AVIF/WebP Conversion via Astro Image Pipeline (`astro:assets` & Sharp) + Lazy Loading**.
* **Why:** 
  * Cloudflare's automatic image conversion (Polish) is a paid Pro feature (\$20/mo), and the free tier does not compress assets.
  * Since jewelry photography is our highest visual priority, we perform all image formatting and optimization at build-time using Astro's built-in asset pipeline. This automatically converts high-res source images to next-gen formats (AVIF/WebP) and resizes them for different screens, outputting highly optimized static images at \$0 cost.
* **Alternatives:**
  * *Cloudflare Polish:* Paid.
  * *Runtime Serverless Image Optimizers:* Introduce latency and cold starts.
* **Trade-offs:** Increases project build times slightly, which is fully acceptable.
* **Cost:** \$0 (Build-time compilation).
* **Complexity:** Low (native Astro APIs).
* **Risks:** None.

---

## 22. Monitoring

* **What:** **Sentry** (Error tracking) + **UptimeRobot** (Liveness checks).
* **Why:** Sentry’s free tier (5,000 events/month) captures frontend and serverless runtime exceptions. UptimeRobot monitors page availability.
* **Alternatives:**
  * *Datadog:* Not free.
* **Trade-offs:** Sentry adds a small script to the client.
* **Cost:** \$0.
* **Complexity:** Low.
* **Risks:** None.

---

## 23. Frontend & Utility Libraries

* **What:** **Tailwind CSS** (Styling), **React Hook Form** (Form validation), **Lucide React** (Icons).
* **Why:** Tailwind compiles to highly optimized styling for the sharp-edge UI. React Hook Form is lightweight and prevents re-renders during inputs. Lucide React matches the 1.25px stroke design system rules.
* **Alternatives:** Heavy component libraries (e.g. Bootstrap) which bloat page size.
* **Trade-offs:** None.
* **Cost:** \$0 (Open Source).
* **Complexity:** Low.
* **Risks:** None.
