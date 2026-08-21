# Aurora Jewels — Premium Pakistan-First Jewelry E-Commerce

This is the codebase for **Aurora Jewels**, a premium, quiet-luxury jewelry e-commerce website optimized for mobile performance in Pakistan, static/serverless edge execution, and 100% free hosting.

---

## 🛠️ Technology Stack

* **Frontend**: Astro (Hybrid SSR Mode)
* **Backend APIs**: Astro Edge API Routes (deploys to Cloudflare Workers)
* **Database**: Cloudflare D1 (Edge SQLite)
* **ORM**: Drizzle ORM
* **Storage**: Cloudflare R2 (S3-compatible, zero egress fees)
* **Payments**: Cash on Delivery (COD) Only
* **Style System**: Tailwind CSS (Minimalist-Architectural design tokens)
* **Hosting**: Cloudflare Pages

---

## 📁 Repository Structure

```text
├── database/
│   └── schema.ts           # Relational schema declaration (Drizzle ORM)
├── app/
│   ├── astro.config.mjs    # Astro hybrid edge configurations
│   ├── tailwind.config.mjs # Tailwind design token setups
│   ├── tsconfig.json       # TypeScript path aliases
│   ├── .eslintrc.json      # Code quality lint rules
│   ├── .prettierrc         # Format preferences
│   ├── .env.example        # Environment variable checklist
│   └── src/
│       ├── components/     # Visual components & React islands
│       ├── layouts/        # Page structures with web fonts
│       ├── pages/          # Static layout folders & dynamic APIs
│       └── styles/         # Global styles with CSS tokens
├── docs/
│   ├── architecture.md     # Architecture design document
│   ├── ARCHITECTURE_STATUS.md # Architecture approval lock status
│   ├── database.md         # SQLite schemas and structural diagrams
│   └── [Design / Specs]    # Brand rules, sitemaps, and SRS
├── drizzle.config.ts       # Drizzle Kit CLI migrations configuration
└── README.md
```

---

## 💻 Development Commands

Navigate into the `app/` directory to run development scripts:

```bash
cd app

# Install dependencies (Approved packages list in package.json)
npm install

# Run the local Astro development server
npm run dev

# Build the project for Cloudflare Pages production deployment
npm run build
```

Database schema migrations:
```bash
# Generate SQL migration scripts
npm run db:generate

# Apply migrations to local SQLite / Cloudflare D1 database
npm run db:migrate
```

---

## 🔒 Architecture Constraints

The architecture is **LOCKED** (approved on 2026-08-21). No additional dependencies or architectural structural adjustments are allowed without human review. For details, refer to `docs/ARCHITECTURE_STATUS.md`.
