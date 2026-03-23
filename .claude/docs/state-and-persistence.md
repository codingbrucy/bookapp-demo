# State & Persistence — How Data Flows in the Facility Panel

## TL;DR

**Nothing persists right now.** Every piece of state lives in React `useState` inside two context providers. Refreshing the page resets everything to hardcoded mock data. This is by design — the app is a frontend demo with no backend yet.

---

## The Two State Providers

### 1. `FacilityContext` (`lib/FacilityContext.tsx`)

Holds all facility operational data.

```
FacilityContextValue {
  intakes: IntakeRequest[]    // all intake requests (pending, accepted, declined)
  rooms: Room[]               // all rooms, each with a beds[] array
  acceptIntake(intakeId, roomId, bedIndex)   // mutates both intakes + rooms
  declineIntake(intakeId)                     // mutates intakes only
}
```

**Initialized from:** `lib/mockData.ts` — 5 intake requests + 6 rooms with bed arrays.

**What mutates it:**

| Action | What changes | Where triggered |
|---|---|---|
| Accept intake | `intake.status → "accepted"`, target bed `.occupied → true`, `.patientName → intake.name` | `BedAssignmentModal` confirm button |
| Decline intake | `intake.status → "declined"` | `/intakes/[id]` Decline button |

**Derived values (computed on render, not stored):**

| Value | Derivation | Used in |
|---|---|---|
| Active patients | `rooms.flatMap(r → r.beds).filter(b → b.occupied).length` | Navbar badge, stat card |
| Available beds | `rooms.flatMap(r → r.beds).filter(b → !b.occupied).length` | Stat card |
| Pending intakes | `intakes.filter(i → i.status === "pending")` | Stat card, dashboard sidebar, `/intakes` page |
| Room occupancy % | `occupiedCount / totalCount` per room | RoomCard capacity bar |

**How patient count changes:**
1. User navigates to `/intakes/[id]`
2. Clicks "Accept & Assign Bed" → `BedAssignmentModal` opens
3. Selects room → selects bed → clicks "Confirm Admission"
4. `acceptIntake()` runs:
   - Finds the intake by ID, sets `status: "accepted"`
   - Finds the room by ID, finds the bed by index
   - Sets `bed.occupied = true`, `bed.patientName = intake.name`
5. New state array references trigger re-renders
6. Dashboard navbar shows +1 active patient, -1 pending intake, -1 available bed

**How pending intakes change:**
- Accept → `status` becomes `"accepted"` → disappears from pending filters
- Decline → `status` becomes `"declined"` → disappears from pending filters, appears in "Processed" section on `/intakes`

### 2. `ThemeContext` (`lib/ThemeContext.tsx`)

Holds appearance/theme state.

```
ThemeContextValue {
  isDark: boolean                    // light or dark mode
  toggle()                           // flip isDark
  lightColors: { primary, accent }   // customizable light palette
  darkColors: { primary, accent }    // customizable dark palette
  setLightColors(partial)            // merge into lightColors
  setDarkColors(partial)             // merge into darkColors
  settingsOpen: boolean              // settings panel visibility
  openSettings() / closeSettings()
}
```

**Initialized from:** Hardcoded defaults:
- Light: `primary: #0D7377`, `accent: #F4A261`
- Dark: `primary: #38BDF8`, `accent: #A78BFA`

**What mutates it:**

| Action | What changes | Where triggered |
|---|---|---|
| Click sun/moon toggle | `isDark` flips | `SunMoonToggle` in navbar |
| Pick light primary color | `lightColors.primary` updates | `SettingsPanel` color picker |
| Pick light accent color | `lightColors.accent` updates | `SettingsPanel` color picker |
| Pick dark primary color | `darkColors.primary` updates | `SettingsPanel` color picker |
| Pick dark accent color | `darkColors.accent` updates | `SettingsPanel` color picker |

**How colors reach the DOM:**

When `isDark` or any color changes, a `useEffect` runs:
1. Toggles `.dark` class on `<html>` (for the CSS `:root.dark` block)
2. Calls `applyColors()` which sets inline CSS variables on `document.documentElement.style`:
   - `--primary` = chosen primary
   - `--primary-hover` = primary darkened by 8% (HSL math)
   - `--accent` = chosen accent
   - `--navbar-bg` = primary (light) or primary darkened by 35% (dark)
   - `--navbar-text-secondary` = primary lightened by 30% (light) or 15% (dark)
3. All components reference these variables via inline `style={{ color: "var(--primary)" }}` or CSS rules in `globals.css`

**Derived CSS variables (auto-computed from primary):**

| Variable | Light mode derivation | Dark mode derivation |
|---|---|---|
| `--primary-hover` | `darken(primary, 0.08)` | `darken(primary, 0.08)` |
| `--navbar-bg` | `= primary` | `darken(primary, 0.35)` |
| `--navbar-text-secondary` | `lighten(primary, 0.30)` | `lighten(primary, 0.15)` |

---

## Provider Hierarchy

```
<html>
  <body>
    <ThemeProvider>          ← isDark, colors, settings
      <FacilityDataProvider> ← intakes, rooms, mutations
        <Navbar />           ← reads both contexts
        {children}           ← pages read FacilityContext
      </FacilityDataProvider>
    </ThemeProvider>
  </body>
</html>
```

Defined in `app/layout.tsx`. ThemeProvider wraps FacilityDataProvider so theme is available everywhere including the facility provider itself (if ever needed).

---

## What Persists Across Navigation (But NOT Refresh)

Because both providers live in `layout.tsx` and Next.js App Router preserves layout state during client-side navigation:

- Accepting an intake on `/intakes/[id]` → navigating to `/` → dashboard reflects the change ✓
- Switching to dark mode → navigating to `/intakes` → dark mode persists ✓
- Picking a custom color → navigating anywhere → color persists ✓

**But refreshing the browser (F5) resets everything to defaults.**

---

## What Does NOT Persist (Resets on Refresh)

| Data | Resets to |
|---|---|
| Intake statuses | All 5 back to their `mockData.ts` defaults (mostly "pending") |
| Bed assignments | Back to `mockData.ts` defaults |
| Patient count | Back to mock occupied bed count |
| Dark/light mode | Light mode |
| Custom colors | Default palettes |
| Settings panel state | Closed |
| Expanded room cards | All collapsed |

---

## Future Persistence Strategy

When the Laravel backend is wired in:

1. **Facility data** → REST API calls replace mock data. `acceptIntake` / `declineIntake` become `POST` / `PATCH` requests. Context becomes a cache layer with optimistic updates.

2. **Theme preferences** → `localStorage` for immediate persistence without a backend. Structure:
   ```json
   {
     "isDark": true,
     "lightColors": { "primary": "#0D7377", "accent": "#F4A261" },
     "darkColors": { "primary": "#38BDF8", "accent": "#A78BFA" }
   }
   ```
   ThemeContext would read from localStorage on mount and write on every change.

3. **Per-user settings** → Once auth exists, theme preferences could sync to the user's profile via API so they follow across devices.

---

## File Map

| File | Role |
|---|---|
| `lib/types.ts` | TypeScript interfaces (`IntakeRequest`, `Bed`, `Room`) |
| `lib/mockData.ts` | Hardcoded initial data (5 intakes, 6 rooms) |
| `lib/FacilityContext.tsx` | Facility state provider + mutation functions |
| `lib/ThemeContext.tsx` | Theme state provider + color derivation + CSS variable sync |
| `app/layout.tsx` | Wraps app in both providers |
| `app/globals.css` | CSS variable defaults (`:root` and `:root.dark`) — overridden at runtime by ThemeContext |
| `components/SettingsPanel.tsx` | UI for theme customization |
| `components/SunMoonToggle.tsx` | Light/dark mode toggle button |
