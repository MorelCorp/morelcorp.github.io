# Gym in a Box — v2 PRD

## Vision

A single-page HTML Progressive Web App (PWA) for phone-first home fitness, styled as a pixel-art fantasy RPG. Sessions are "quests", exercises are "trials", history is a "chronicle". Every design decision prioritizes one-thumb mobile use.

---

## Architecture Constraints

- **Single HTML file** for all UI and logic (`gym-in-a-box.html`)
- **Companion files** for PWA only: `manifest.json`, `service-worker.js`, icon assets
- **No server, no build step, no external runtime dependencies**
- External CDN references allowed: Press Start 2P (Google Fonts), Tabler Icons
- **localStorage** for all persistence (works on iOS Safari and Android Chrome)
- **Web Audio API** for all sounds (no external audio files)

---

## Navigation

Bottom nav bar with 3 tabs + a gear icon:

| Tab | Label | Icon |
|-----|-------|------|
| 1 | **Quest** | ⚔️ sword |
| 2 | **Chronicle** | 📜 scroll |
| 3 | **Inventory** | 🎒 backpack |

**Gear icon** (top-right corner of every screen) → Settings drawer/modal.

---

## PWA

- **App name**: Gym in a Box
- **Icon**: Pixel art dumbbell crossed with a sword (SVG-based, embedded)
- **Service worker**: Caches all assets for full offline use
- **Installable** on iOS (Add to Home Screen), Android (Install prompt), desktop Chrome

---

## Visual Design

### Style
- **Font**: Press Start 2P (Google Fonts) — pixel art, all UI text
- **Theme**: Dark background (`#0A0A0F`)
- **Accent palette**:
  - Gold (`#FFD700`) — XP, achievements, level-up
  - Deep red (`#CC2200`) — action buttons (Begin Quest, Set Complete)
  - Teal (`#00D9A3`) — secondary accents, timers
  - Purple (`#6C63FF`) — retained from v1 for continuity

### UI Elements
- Pixel art borders on cards, buttons, and modals (chunky 2–4px pixel corners)
- Pixel art icons throughout
- RPG language everywhere (see table below)

### RPG Language Map

| Fitness term | RPG term |
|---|---|
| Workout / Session | Quest |
| Exercise | Trial |
| History | Chronicle |
| Equipment | Inventory |
| Done / Complete | Victory |
| Rest between sets | Recovery |
| Begin session | Begin Quest |
| Session complete | Quest Complete! |
| Level | Rank |
| Settings | Codex |

---

## Levels (Ranks)

Four ranks, unlocked manually. XP multiplier increases with each rank.

| Rank | XP Multiplier | Default at start |
|------|--------------|-----------------|
| Apprentice | 1× | ✅ |
| Adventurer | 2× | |
| Champion | 3× | |
| Legend | 4× | |

### XP Per Session (Base)

| Duration | Base XP |
|----------|---------|
| 30 min | 100 XP |
| 45 min | 150 XP |
| 60 min | 200 XP |

**Effective XP = Base XP × Rank Multiplier**

### XP Thresholds to Rank Up (cumulative total XP)

| To reach | XP required | Approx. sessions from previous rank (30 min) |
|----------|-------------|----------------------------------------------|
| Adventurer | 200 XP | 2 sessions as Apprentice |
| Champion | 2,200 XP | ~10 sessions as Adventurer |
| Legend | 17,200 XP | ~50 sessions as Champion |

### Rank-Up Flow
- App tracks total XP earned (cumulative, never resets)
- When XP crosses a threshold, a notification appears: "You are ready to advance to [Rank]!"
- User manually confirms rank-up in Settings → Codex
- Rank change takes effect immediately on the next quest

---

## Quest Screen (Tab 1)

### State 1: Pre-Quest Config

Shown before starting a session. Remembers last settings.

**Controls:**
1. **Session type toggle**: Balanced ↔ Targeted
   - If Targeted: secondary 3-button selector appears → Upper Body / Legs / Core
2. **Duration selector**: 30 min / 45 min / 60 min (pills, tap to select)
3. **XP Progress display**: Current rank name + pixel-art progress bar + XP to next rank
4. **"Begin Quest" button** (deep red, full width)

### State 2: Active Quest

Exercise flow — same pattern as v1 but with these changes:

**Exercise card layout:**
- Rank badge + "Trial X of N" counter
- Segmented progress bar (done / active / pending)
- Exercise name, reps/sets/weight pills, note
- Info button → instruction modal (retained from v1)
- Countdown timer for timed exercises (replacing rep counter)

**Between-set rest (same exercise):**
- 60s countdown timer (teal)
- Skip button
- Current exercise card stays visible

**Between-exercise rest (last set of exercise N, moving to N+1):**
- 60s countdown timer (teal)
- **Full card swap**: next exercise card is shown (name, reps, weight, info button available)
- Timer label: "Prepare for next trial..."

**Last set of last exercise:**
- No rest timer — immediately go to Quest Complete screen

**Sounds:**
- Set complete → short 8-bit chime
- Timer (rest/timed exercise) done → 8-bit bell
- Quest complete → 8-bit victory fanfare

### State 3: Quest Complete

- "Quest Complete!" header with pixel art trophy
- Stats: trials completed, total sets, XP earned this session, duration
- "Return to Camp" button → back to Pre-Quest Config

---

## Session Generator

### Inputs
- Rank (Apprentice / Adventurer / Champion / Legend)
- Session type (Balanced / Targeted: Upper / Legs / Core)
- Duration (30 / 45 / 60 min)
- Inventory (what equipment is available)

### Duration → Exercise Count Formula

Each exercise's estimated duration:
```
exercise_time = (sets × reps × 3s) + (sets × 60s rest)
```
For timed exercises, substitute `duration_seconds` for `reps × 3s`.

Algorithm:
1. Determine target total session time in seconds
2. Pull candidate exercises from pool (filtered by rank + inventory + session type)
3. Shuffle candidates
4. Add exercises one by one until adding the next one would exceed target time
5. Minimum 4 exercises, maximum 10

### Session Type Composition

**Balanced**: One exercise from each of Push, Pull, Hinge/Squat, Core, then fill remaining slots with any category.

**Targeted — Upper Body**: ~80% upper (Push + Pull + Shoulders), 1 Core exercise.

**Targeted — Legs**: ~80% lower (Hinge + Squat + Glutes), 1 Core exercise.

**Targeted — Core**: ~80% core (Plank variations, anti-rotation, carries), 1 full-body exercise.

---

## Exercise Pool

Deep pool of ~80–120 exercises. Each exercise has:

```
{
  id: string,
  name: string,
  category: "push" | "pull" | "hinge" | "squat" | "core" | "fullbody",
  ranks: ["apprentice", "adventurer", ...],   // ranks that can draw this exercise
  equipment: ["bodyweight", "dumbbell_light", "dumbbell_medium", "dumbbell_heavy", "bench", "step", "barbell_light"],
  sets: { apprentice: 3, adventurer: 3, champion: 4, legend: 4 },
  reps: { apprentice: 10, adventurer: 12, champion: 15, legend: 20 },  // OR duration in seconds for timed
  timed: false,  // true for plank-type exercises
  weight_note: { apprentice: "5–10 lb", adventurer: "10–20 lb", ... },
  instructions: ["Step 1...", "Step 2...", ...]
}
```

**Minimum viable inventory** (floor + light dumbbells) must have ≥ 5 exercises per rank across multiple categories.

Equipment unlocks progressively add variety, not gated content — users with more equipment get more variety, not harder exercises.

### Seeded exercises (carried over from v1, to be expanded)
- Pushups, Romanian Deadlift, One-Arm DB Row, Goblet Squat, Dead Bug
- Floor Press, Hip Thrust, Seated OHP, Curl-to-Press, Plank

---

## Inventory (Tab 3)

### Equipment Toggles

**Bodyweight** — always on, cannot be toggled off.

**Step** — on/off toggle.

**Bench** — on/off toggle.

**Dumbbells** — multi-select weight ranges (checkboxes):
- Light (5–15 lb)
- Medium (15–30 lb)
- Heavy (30–60 lb)
- Very Heavy (60 lb+)

**Barbells** — multi-select weight ranges (all unchecked by default):
- Light (45–95 lb)
- Medium (95–185 lb)
- Heavy (185 lb+)

Changes saved immediately to localStorage.

---

## Chronicle (Tab 2)

### Calendar View
- **Month view** by default, with previous/next month navigation
- Completed session days show a pixel-art sticker (trophy icon)
- Sticker color-coded by session type:
  - Gold = Balanced
  - Red = Upper Body
  - Blue = Legs
  - Green = Core

### Session Detail
- Tap any sticker → modal showing:
  - Date + duration
  - Session type
  - Exercises completed (names only)
  - XP earned
  - Rank at time of session

---

## Settings (Gear Icon → Drawer)

### Codex (Settings) Contents

**Rank**
- Current rank display
- "Advance Rank" button (enabled when XP threshold reached)
- XP to next rank shown

**Sound**
- Toggle: On / Off

**Backup & Restore**
- "Export Chronicle" button → downloads `gym-in-a-box-backup-YYYY-MM-DD.json`
- "Restore from File" button → file picker → replaces all localStorage data

### Export format
```json
{
  "version": 2,
  "exportedAt": "2026-06-20T...",
  "data": {
    "rank": "apprentice",
    "xp": 0,
    "inventory": { ... },
    "sessionHistory": [ ... ],
    "settings": { "sound": true, "lastDuration": 30, "lastSessionType": "balanced" }
  }
}
```

---

## localStorage Schema

```
gib_rank          "apprentice" | "adventurer" | "champion" | "legend"
gib_xp            number (cumulative, never decreases)
gib_inventory     JSON object (equipment toggles + weight ranges)
gib_history       JSON array of session records
gib_settings      JSON object (sound, last duration, last session type)
```

---

## Timers

| Timer | Type | Duration | Sound on end |
|-------|------|----------|--------------|
| Between sets (same exercise) | Countdown | 60s | Bell |
| Timed exercise (plank etc.) | Countdown | Exercise-defined | Bell |
| Between exercises | Countdown | 60s | — |
| After last set of last exercise | None | — | Victory fanfare |

---

## Out of Scope (v2)

- Character sprite / avatar
- Barbell-specific exercise programming (barbell exercises will be in pool but the main UX isn't designed around loading plates)
- Social / sharing features
- Cloud sync
- Weekly streak bonus XP
- Notifications / reminders

---

## Open Questions Deferred to Build Phase

- Exact exercise pool (80–120 entries): to be designed during implementation
- PWA icon pixel art: to be created during implementation
- Exact XP threshold wording for rank-up notification
- Exact 8-bit sound synthesis parameters (frequency, envelope)
