# Replit.md

## Overview

This is a **retail store management system** (Japanese retail context) with two distinct role views: **HQ (Headquarters)** and **Store-level** operations. The app allows headquarters staff to manage weekly floor plans, view dashboards, and track store lists, while store staff can submit product scans, view layout analyses, manage capacity, and check store summaries.

Key capabilities:
- **Plan management**: HQ creates weekly plans assigning products to store locations
- **Scan submission**: Store staff scan products to record actual locations
- **Analysis**: Compares planned vs. actual product placement, flagging correct/wrong/missing/extra items
- **Location grid**: A 3×4 grid of named blocks (A1–C4) representing store sections
- **Product catalog**: Pre-seeded brands/product groups for Japanese retail (AIR, SUN, GB, JD, etc.)

The app is a combined single deployment serving both HQ and Store role views via different URL routes, intended as a demonstration/prototype.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite
- **Routing**: `wouter` (lightweight client-side router)
  - HQ routes: `/hq/dashboard`, `/hq/plan`, `/hq/stores`, `/hq/sv-capacity`
  - Store routes: `/store/:id/summary`, `/store/:id/analysis`, `/store/:id/capacity`, `/store/:id/layout`, `/store/:id/scan`
- **UI Library**: shadcn/ui (New York style) with full Radix UI primitive set
- **Styling**: Tailwind CSS with CSS custom properties for theming; DM Sans + Outfit fonts
- **State/Data fetching**: TanStack React Query v5 with custom hooks per resource (`use-locations`, `use-products`, `use-plans`, `use-scans`, `use-analysis`)
- **Forms**: react-hook-form + @hookform/resolvers + zod validation
- **Charts**: Recharts (via shadcn chart wrapper)
- **Layout**: Persistent sidebar (`AppSidebar`) wrapped in a `Shell` component with collapsible behavior; sidebar dynamically shows HQ or store-level nav based on current route

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, run via `tsx` in dev; compiled to CJS bundle via esbuild for production
- **API pattern**: REST endpoints defined in `shared/routes.ts` as a typed contract object (`api.*`) shared between client and server
- **Route registration**: `server/routes.ts` registers all API handlers and seeds the database on startup if empty
- **Storage layer**: `IStorage` interface with `DatabaseStorage` implementation (easily swappable)
- **Static serving**: In production, serves Vite-built assets from `dist/public`; in development, uses Vite middleware

### Shared Schema & Validation
- **`shared/schema.ts`**: Single source of truth for DB tables and TypeScript types using Drizzle ORM + drizzle-zod
- **`shared/routes.ts`**: Typed API contract (paths, methods, request/response schemas) consumed by both client hooks and server handlers — ensures type safety end-to-end
- **Types exported**: `Location`, `Product`, `Plan`, `Scan`, `AnalysisResult` with corresponding `Insert*` variants

### Database Schema
Four tables in PostgreSQL:
| Table | Key Fields |
|-------|-----------|
| `locations` | `id`, `name` (e.g. "Block A1") |
| `products` | `id`, `name`, `product_group` |
| `plans` | `id`, `location_id`, `product_id` |
| `scans` | `id`, `location_id`, `product_id`, `timestamp` |

**Seeding**: On startup, if no locations/products exist, the server auto-seeds 12 grid locations (A1–C4) and 18 product brands.

### Analysis Logic
The analysis compares `plans` vs `scans` to produce `AnalysisResult[]` with statuses:
- `correct` — product found at planned location
- `wrong_location` — product scanned but at wrong location
- `missing` — planned product not scanned anywhere
- `extra` — scanned product not in any plan

### Build System
- **Dev**: `tsx server/index.ts` (Vite middleware handles client HMR)
- **Production build**: Custom `script/build.ts` runs Vite build then esbuild for server, bundling a curated allowlist of dependencies for faster cold starts
- **Output**: `dist/public/` (client) + `dist/index.cjs` (server)

## External Dependencies

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable (required)
- **Drizzle ORM** (`drizzle-orm/node-postgres`) for query building and migrations
- **drizzle-kit** for schema push (`npm run db:push`)
- **connect-pg-simple** available for session storage (not currently wired up for auth)

### UI / Frontend Libraries
- **Radix UI** — full primitive set for accessible components
- **shadcn/ui** — component library built on Radix (New York style, CSS variables theme)
- **TanStack React Query v5** — server state management
- **wouter** — client-side routing
- **react-hook-form** — form state management
- **Recharts** — charting library
- **Embla Carousel** — carousel component
- **Vaul** — drawer component
- **cmdk** — command palette
- **date-fns** — date utilities
- **lucide-react** — icon set
- **clsx + tailwind-merge** — conditional class utilities

### Development Tools
- **Vite** with `@vitejs/plugin-react`
- **@replit/vite-plugin-runtime-error-modal** — error overlay in dev
- **@replit/vite-plugin-cartographer** and **vite-plugin-dev-banner** — Replit-specific dev tools (only loaded when `REPL_ID` is set)
- **tsx** — TypeScript execution for dev server and build scripts
- **esbuild** — server bundling for production

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string (mandatory; app throws on startup without it)
- `NODE_ENV` — `development` or `production` (controls Vite middleware vs. static serving)
- `REPL_ID` — auto-set on Replit; enables Replit-specific Vite plugins

No authentication system, external APIs, email services, or payment integrations are currently implemented (though `connect-pg-simple`, `express-session`, `passport`, and other auth-adjacent packages appear in the build allowlist, suggesting these may be planned).