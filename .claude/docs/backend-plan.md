# Backend Plan — Next.js API Routes + Prisma + PostgreSQL

## Why This Stack

The original plan was Laravel 11 as a separate backend. We pivoted to Next.js API routes + Prisma for the demo because:

- **Single deploy target** — Vercel hosts the frontend, API routes, and connects to Postgres. No second server to manage.
- **Shared types** — Prisma generates TypeScript types from the database schema. The same types flow from DB → API → frontend with zero manual syncing.
- **Zero infra for demo** — No Docker, no PHP runtime, no CORS config. `vercel deploy` and it's live.
- **Laravel is not off the table** — If the project outgrows Next.js API routes (queues, complex auth, heavy server logic), Laravel can be introduced later. The API contract (REST endpoints) stays the same.

---

## What We Have Now (Before)

```
Browser → React Context (useState) → Mock data (lib/mockData.ts)
```

- All state lives in `FacilityContext` and `ThemeContext` — both use `useState`
- Data is hardcoded in `lib/mockData.ts` (5 intakes, 6 rooms)
- Mutations (`acceptIntake`, `declineIntake`) modify local state arrays
- Refreshing the browser resets everything
- Theme preferences (dark mode, custom colors) also reset on refresh

---

## What We're Building (After)

```
Browser → React Context (fetch + cache) → API Routes → Prisma → PostgreSQL
```

- API routes handle reads and writes
- Prisma ORM talks to Postgres
- React Context becomes a **fetch-on-mount + cache** layer with optimistic updates
- Theme preferences persist via `localStorage` (no DB needed — it's UI preference, not facility data)

---

## Database

### Provider Options

| Option | Cost | Setup | Best For |
|---|---|---|---|
| **Vercel Postgres** (powered by Neon) | Free tier available | One click in Vercel dashboard | Deploying on Vercel |
| **Neon** (direct) | Free tier: 0.5 GB | Create project at neon.tech | Local dev + any host |
| **Supabase** | Free tier: 500 MB | Create project at supabase.com | If you want a dashboard UI for the DB |
| **Local Postgres** | Free | `brew install postgresql` or Docker | Offline dev |

For demo: **Neon free tier** (works with Vercel Postgres and locally). Connection string goes in `.env`:

```
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
```

### Schema

Maps directly to our existing `lib/types.ts` interfaces:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Room {
  id   String @id          // "101", "102", etc.
  wing String              // "East Wing", "West Wing"
  beds Bed[]
}

model Bed {
  id          Int     @id @default(autoincrement())
  index       Int                    // 0-based position within room
  occupied    Boolean @default(false)
  patientName String?
  room        Room    @relation(fields: [roomId], references: [id])
  roomId      String

  @@unique([roomId, index])          // no duplicate bed positions per room
}

model IntakeRequest {
  id               String   @id @default(cuid())
  name             String
  initials         String
  dob              String
  phone            String

  // Emergency contact (flat — no need for a separate table in a demo)
  ecName           String
  ecPhone          String
  ecRelationship   String

  // Insurance (flat)
  insProvider      String
  insPlanType      String
  insMemberId      String
  insAuthStatus    String   @default("pending")  // "pending" | "approved" | "denied"

  program          String
  admittingReason  String
  substances       String[]                       // Postgres supports string arrays
  lastUseDate      String
  medicalFlags     String[]

  referralType     String                         // "doctor" | "hotline" | "self" | "family"
  referringSource  String

  requestDate      String
  priority         String   @default("normal")    // "high" | "normal"
  status           String   @default("pending")   // "pending" | "accepted" | "declined"

  createdAt        DateTime @default(now())
}
```

**Design decisions:**
- Emergency contact and insurance are **flat fields** (not separate tables). For a demo with no multi-insurance or multi-contact needs, joins add complexity with no benefit.
- `Room.id` is a `String` ("101", "102") matching our current mock data — not an auto-increment. Room numbers are meaningful identifiers.
- `Bed` has a compound unique constraint on `[roomId, index]` — prevents duplicate bed positions.
- `substances` and `medicalFlags` are `String[]` (Postgres native arrays) — simpler than join tables for a demo.
- `insAuthStatus`, `priority`, `status` are strings, not enums. Prisma enums work but add migration friction when values change. Strings are fine for a demo; validation happens in the API layer.

---

## API Routes

All routes live in `facility_panel/app/api/`. Next.js App Router uses the `route.ts` convention.

### `GET /api/rooms`

Returns all rooms with their beds.

```
Response: Room[] (each with nested beds[])
```

```ts
// app/api/rooms/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { beds: { orderBy: { index: "asc" } } },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rooms);
}
```

### `GET /api/intakes`

Returns all intake requests.

```
Response: IntakeRequest[]
```

```ts
// app/api/intakes/route.ts
export async function GET() {
  const intakes = await prisma.intakeRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(intakes);
}
```

### `PATCH /api/intakes/[id]`

Accept or decline an intake. If accepting, also assigns the patient to a bed.

```
Request body:
  { action: "accept", roomId: "101", bedIndex: 2 }
  OR
  { action: "decline" }

Response: updated IntakeRequest
```

```ts
// app/api/intakes/[id]/route.ts
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  if (body.action === "accept") {
    // Transaction: update intake status + mark bed as occupied
    const [intake] = await prisma.$transaction([
      prisma.intakeRequest.update({
        where: { id },
        data: { status: "accepted" },
      }),
      prisma.bed.update({
        where: { roomId_index: { roomId: body.roomId, index: body.bedIndex } },
        data: { occupied: true, patientName: /* intake name from DB */ },
      }),
    ]);
    return NextResponse.json(intake);
  }

  if (body.action === "decline") {
    const intake = await prisma.intakeRequest.update({
      where: { id },
      data: { status: "declined" },
    });
    return NextResponse.json(intake);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
```

**Why a transaction for accept?** Two tables are mutated (IntakeRequest + Bed). If one write fails, both should roll back. Without a transaction, you could end up with a bed marked occupied but no corresponding accepted intake (or vice versa).

---

## Seed Script

`lib/mockData.ts` becomes `prisma/seed.ts`. Same data, just written to the database instead of held in memory.

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.intakeRequest.deleteMany();

  // Create rooms + beds (same data as current mockData.ts)
  await prisma.room.create({
    data: {
      id: "101",
      wing: "East Wing",
      beds: {
        create: [
          { index: 0, occupied: true, patientName: "James Wilson" },
          { index: 1, occupied: true, patientName: "Maria Santos" },
          { index: 2, occupied: false },
          { index: 3, occupied: false },
        ],
      },
    },
  });
  // ... repeat for all 6 rooms

  // Create intake requests (same 5 from current mockData.ts)
  await prisma.intakeRequest.create({
    data: {
      name: "Robert Chen",
      initials: "RC",
      // ... all fields
    },
  });
  // ... repeat for all 5 intakes
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
```

Run with: `npx prisma db seed`

Configured in `package.json`:
```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

---

## Prisma Client Singleton

Next.js hot-reloads in dev, which would create a new Prisma client on every reload (exhausting DB connections). Standard pattern: cache the client on `globalThis`.

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## FacilityContext Changes

Currently:
```ts
const [intakes, setIntakes] = useState<IntakeRequest[]>(INITIAL_INTAKES);
const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
```

After:
```ts
const [intakes, setIntakes] = useState<IntakeRequest[]>([]);
const [rooms, setRooms] = useState<Room[]>([]);
const [loading, setLoading] = useState(true);

// Fetch on mount
useEffect(() => {
  Promise.all([
    fetch("/api/rooms").then(r => r.json()),
    fetch("/api/intakes").then(r => r.json()),
  ]).then(([roomsData, intakesData]) => {
    setRooms(roomsData);
    setIntakes(intakesData);
    setLoading(false);
  });
}, []);

// acceptIntake becomes:
async function acceptIntake(intakeId, roomId, bedIndex) {
  // Optimistic update (instant UI response)
  setIntakes(prev => prev.map(i =>
    i.id === intakeId ? { ...i, status: "accepted" } : i
  ));
  setRooms(prev => prev.map(r =>
    r.id === roomId ? {
      ...r,
      beds: r.beds.map(b =>
        b.index === bedIndex ? { ...b, occupied: true, patientName: intakeName } : b
      ),
    } : r
  ));

  // Persist to DB
  await fetch(`/api/intakes/${intakeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "accept", roomId, bedIndex }),
  });
}
```

**Optimistic updates**: The UI updates immediately (same as now), then the API call persists it. If the API fails, we'd revert — but for a demo, the happy path is fine.

---

## Theme Persistence (localStorage)

Theme preferences don't belong in the database — they're per-browser, not per-facility. `ThemeContext` gets a small addition:

```ts
// On mount: read from localStorage
useEffect(() => {
  const saved = localStorage.getItem("theme-prefs");
  if (saved) {
    const { isDark, lightColors, darkColors } = JSON.parse(saved);
    setIsDark(isDark);
    setLightColorsState(lightColors);
    setDarkColorsState(darkColors);
  }
}, []);

// On change: write to localStorage
useEffect(() => {
  localStorage.setItem("theme-prefs", JSON.stringify({
    isDark, lightColors, darkColors,
  }));
}, [isDark, lightColors, darkColors]);
```

This survives page refreshes and even closing/reopening the browser.

---

## Type Changes

Currently `lib/types.ts` has hand-written interfaces. After Prisma:

- **Delete** `lib/types.ts`
- **Import from Prisma** everywhere:
  ```ts
  import type { Room, Bed, IntakeRequest } from "@prisma/client";
  ```
- Prisma generates these types from the schema — they're always in sync with the DB
- For the "Room with beds" shape, define a utility type:
  ```ts
  import type { Prisma } from "@prisma/client";

  type RoomWithBeds = Prisma.RoomGetPayload<{ include: { beds: true } }>;
  ```

---

## Files to Create

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Seed script (current mock data → DB) |
| `lib/prisma.ts` | Prisma client singleton |
| `app/api/rooms/route.ts` | GET all rooms with beds |
| `app/api/intakes/route.ts` | GET all intakes |
| `app/api/intakes/[id]/route.ts` | PATCH accept/decline |
| `.env` | `DATABASE_URL` (gitignored) |

## Files to Modify

| File | Change |
|---|---|
| `lib/FacilityContext.tsx` | Fetch from API on mount, mutations call API |
| `lib/ThemeContext.tsx` | Add localStorage read/write |
| `package.json` | Add `prisma`, `@prisma/client`, seed config |
| `.gitignore` | Add `.env` if not already there |

## Files to Delete

| File | Reason |
|---|---|
| `lib/types.ts` | Replaced by Prisma-generated types |
| `lib/mockData.ts` | Replaced by `prisma/seed.ts` |

---

## Implementation Order

1. Install dependencies: `npm install prisma @prisma/client` + `npm install -D tsx`
2. `npx prisma init` — creates `prisma/schema.prisma` + `.env`
3. Write the schema (Room, Bed, IntakeRequest)
4. Set up a Postgres database (Neon free tier or local)
5. `npx prisma migrate dev --name init` — creates tables
6. Write `prisma/seed.ts` from existing `mockData.ts`
7. `npx prisma db seed` — populate database
8. Create `lib/prisma.ts` singleton
9. Create API routes (rooms, intakes, intakes/[id])
10. Update `FacilityContext` to fetch from API + optimistic mutations
11. Update `ThemeContext` to persist to localStorage
12. Delete `lib/types.ts` and `lib/mockData.ts`
13. Test: accept intake → refresh → state persists
14. Test: switch theme → refresh → theme persists

---

## Commands Cheat Sheet

```bash
# Install
npm install prisma @prisma/client
npm install -D tsx

# Init Prisma (one-time)
npx prisma init

# After editing schema.prisma
npx prisma migrate dev --name describe_the_change

# Seed the database
npx prisma db seed

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Regenerate client after schema changes
npx prisma generate

# Dev server (unchanged)
npm run dev
```

---

## What This Gets Us

| Before | After |
|---|---|
| Refresh resets everything | Data persists in Postgres |
| Theme resets on refresh | Theme persists in localStorage |
| Mock data only | Real CRUD operations |
| Can't demo to investors live | Live demo with real persistence |
| Need separate Laravel server | Single Vercel deploy |
| Manual type syncing | Prisma auto-generates types |
