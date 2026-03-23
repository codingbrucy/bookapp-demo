# bookapp (demo) — Project Instructions

## Auto-Update Rule
Claude must update this file as the project evolves: when new tech is added, patterns are established, commands are confirmed, or conventions are decided. Keep it accurate and concise.

## User Context
The user is new to industrial-level software engineering practices. This means:
- **Proactively scan the repo** when starting new features, noticing unfamiliar patterns, or when something feels off — don't assume the current structure is intentional or optimal.
- **Apply professional standards** by default: proper project structure, separation of concerns, naming conventions, security hygiene, error handling, and scalability.
- **Always tell the user** when a repo scan was performed and briefly note what was checked and why. Example: _"I scanned the project structure before proceeding — noticed X, so I'm doing Y instead."_
- **Flag anti-patterns or gaps** proactively (e.g., missing .gitignore, exposed secrets, poor folder structure) even if not directly asked.
- **Explain the why** briefly when making decisions that reflect professional practice, so the user learns as we go.

## Project Overview
- **Name:** bookapp (demo)
- **Context:** Part of contigoU project family
- **Status:** In progress — facility panel frontend complete, backend transition next
- **Location:** `/Users/brubru/Desktop/contigoU/bookapp(demo)`

## Go-To-Market Strategy
**Supply-side first.** contigoU injects itself between facilities and people seeking them by onboarding facilities first. The facility admin panel is the wedge — a daily workflow tool that gives facilities immediate value (patient/bed management). Once facilities are in, the marketplace has inventory to show users.

- Phase 1: Facility panel — get facilities using it
- Phase 2: User-facing marketplace — powered by enrolled facilities
- Phase 3: Booking flow connects both sides

## Project Purpose
Pitch/demo app for contigoU — a marketplace connecting individuals seeking **detox/rehab services** with **treatment facilities**. Primary audience: potential users and investors. Must impress on UI/UX and feel premium.

## Two Panels

### Facility Worker Panel (`facility_panel/`)
- One login per facility; individual worker accounts can be added later
- Overview: rooms, beds, patients (the core SVG entities)
- Interactive, cartoonized SVGs representing facility layout and slot availability
- Entities: **Room → Beds → Patient** (hierarchical)

### User Panel (not yet started)
- Yelp-like: search, browse, filter, view facility detail pages
- Booking flow: request → confirmation
- Reviews TBD

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** Next.js API routes + Prisma ORM + PostgreSQL (single deploy target on Vercel)
- **Database:** Vercel Postgres (Neon) or any Postgres instance
- **SVG/Animation:** Custom SVGs, CSS animations (Framer Motion planned)
- **Deploy:** Vercel (frontend + API + DB all in one)

## Auth
- Two user types: `facility_staff`, `end_user`
- Facility staff share one facility-scoped account
- Individual worker roles to be added later

## Project Structure (Actual)
```
bookapp(demo)/
├── facility_panel/          # Next.js 16 app — facility admin panel
│   ├── app/
│   │   ├── layout.tsx       # Fonts + ThemeProvider + FacilityDataProvider + Navbar
│   │   ├── globals.css      # CSS variables (light/dark), animations, room card effects
│   │   ├── page.tsx         # Dashboard: stats, rooms/beds grid, pending intakes
│   │   └── intakes/
│   │       ├── page.tsx     # Intake queue (filter: all/urgent/normal)
│   │       └── [id]/
│   │           └── page.tsx # Intake detail + bed assignment
│   ├── components/
│   │   ├── Navbar.tsx             # Shared navbar (live stats, sun/moon toggle, settings gear)
│   │   ├── SunMoonToggle.tsx      # Animated sun↔moon dark mode toggle with rotation
│   │   ├── SettingsPanel.tsx      # Theme customization (primary/secondary per mode + presets)
│   │   ├── BedAssignmentModal.tsx # Two-step room → bed picker modal
│   │   ├── RoomCard.tsx           # Expandable room card (hover effects, accent bar, amber fill)
│   │   ├── BedGrid.tsx            # Bed visualization (compact + detailed modes)
│   │   └── PersonFigure.tsx       # Cartoonized person SVG placeholder
│   └── lib/
│       ├── types.ts           # TypeScript interfaces: IntakeRequest, Room, Bed
│       ├── mockData.ts        # Mock data (5 intakes, 6 rooms) — will become prisma/seed.ts
│       ├── FacilityContext.tsx # React Context — shared state, acceptIntake/declineIntake
│       └── ThemeContext.tsx    # Theme state — dark mode, custom colors, CSS variable sync
├── .claude/
│   └── docs/
│       ├── npm.md
│       ├── dev_log_2026-03-16.md    # Intake workflow
│       ├── dev_log_2026-03-18.md    # Room cards + hover effects
│       ├── dev_log_2026-03-19.md    # Dark mode + theme system
│       ├── css-text-fill-effect.md  # Educational: room number hover animation
│       ├── state-and-persistence.md # How data flows, what persists, what doesn't
│       └── backend-plan.md          # Full backend plan (Prisma + Postgres + API routes)
└── CLAUDE.md
```
> User-facing panel to be added as a separate Next.js app later.

## Visual Identity
- **Primary (light):** Deep teal `#0D7377` — customizable via settings
- **Primary (dark):** Sky blue `#38BDF8` — customizable via settings
- **Accent (light):** Amber `#F4A261` — customizable via settings
- **Accent (dark):** Violet `#A78BFA` — customizable via settings
- **Background:** Warm off-white `#FAF7F2` (light) / `#1a1f2e` (dark)
- **Display font:** Playfair Display (headings, facility name, numbers)
- **UI font:** Nunito (all body/UI text)
- Direction: warm, hopeful, premium. Not clinical. Cartoonized but polished.
- Full CSS variable system — all colors derived from `--primary` and `--accent`

## Common Commands
```bash
# Facility panel dev server
cd facility_panel && npm run dev   # → localhost:3000
```

## Conventions & Patterns
- Tailwind CSS only — no external UI component libraries
- Inline `style={{ fontFamily: "var(--font-playfair)" }}` for display font usage in JSX (Tailwind v4 limitation)
- All colors via CSS variables (`--primary`, `--accent`, `--card-bg`, etc.) — no hardcoded hex in components
- Opacity variants via `color-mix(in srgb, var(--primary) X%, transparent)`
- Derived colors (hover, navbar bg, secondary text) computed from primary via HSL math in ThemeContext
- Mock data lives in `lib/mockData.ts` — will be replaced by Prisma seed + API routes
- TypeScript interfaces in `lib/types.ts` — will be replaced by Prisma-generated types
- Shared state via React Context (`FacilityContext` for data, `ThemeContext` for appearance)
- All pages are `"use client"` (they consume context); layout wraps in both providers
- Components extracted to `components/` when reused across pages
- Navbar + SettingsPanel in layout (shared across all routes)

## Notes / Decisions
- Demo-first approach: frontend with mock data first, now transitioning to Prisma + Postgres
- **Backend pivot (2026-03-19):** Dropped Laravel in favor of Next.js API routes + Prisma + Postgres. Reason: single deploy target on Vercel, zero infra complexity for a demo. Laravel can be reconsidered for production if needed.
- **Theme system:** Full dark mode + customizable colors. Settings panel with color pickers + presets. Sun/moon toggle in navbar. See `.claude/docs/dev_log_2026-03-19.md`.
- **Persistence (current):** Nothing persists on refresh — all in-memory React state. See `.claude/docs/state-and-persistence.md`.
- **Persistence (next):** Facility data → Postgres via Prisma. Theme prefs → localStorage. See `.claude/docs/backend-plan.md`.
- HIPAA not in scope for demo but flag if real data handling comes up
- contigoU main website is not a reference — establishing fresh visual direction here
