# SuperMemo2 Acronym & Concept Trainer — Project Plan

## 1. Vision & Objectives
- Provide a progressive web app (PWA) that helps learners master acronyms and concepts using the SuperMemo2 spaced repetition algorithm.
- Operate fully offline after initial load, persisting card progress in `localStorage`.
- Allow learners to point to a remotely hosted CSV file as their dynamic content source and support switching sources or resetting progress later.

## 2. Success Criteria
1. Learners can import cards from a remote CSV (HTTP/HTTPS) with columns: `Acronym`, `Full name`, `Explanation` (header row ignored).
2. The app implements the SM-2 algorithm, tracking bidirectional prompts among the three fields while tolerating missing values.
3. Progress, deck configuration, and metadata persist across sessions using `localStorage`.
4. The UI is a single-page PWA with install prompt, offline caching, and responsive design.
5. Config page enables changing source URL, resetting learning data, and setting the maximum number of active non-mastered cards (default 20).
6. Tools listing pages (`pages/resources/tools.md` and `.en.md`) include the new app entry linked from `/resources/tools/`.

## 3. Key Features & User Flows
### 3.1 First-Time Setup
1. Prompt user to enter or select a CSV URL.
2. Fetch CSV, parse rows, build card entities (skip blank rows and tolerate missing fields).
3. Initialize SM-2 metadata per card (EF=2.5, interval, repetitions, next review date).
4. Activate up to `maxActive` new cards (default 20) for review queue.

### 3.2 Daily Review Cycle
- Present card prompts generated from field pairs: 
  - Acronym ↔ Full name
  - Acronym ↔ Explanation
  - Full name ↔ Explanation
- Skip prompt types when one side is missing; ensure variety by shuffling prompts per session.
- Provide response reveal and grade buttons (0–5) to feed SM-2 calculation.
- Update `localStorage` after each review.

### 3.3 Deck Maintenance
- Automatically pull additional cards from CSV when mastered count drops below `maxActive` threshold.
- Detect CSV updates by caching `etag/last-modified` if available, with manual refresh trigger in Config.
- Support append-only CSV updates by remembering the highest processed row index/hash so that newly appended rows become new cards without reprocessing existing progress.
- Handle fetch failures gracefully and notify users.

### 3.4 Config Page
- Accessible via header menu/gear icon.
- Fields:
  - Source CSV URL input with validation + fetch test.
  - Max active (non-mastered) cards numeric input.
  - Buttons: `Refresh Data`, `Reset Progress`, `Export Progress` (optional stretch).
- Display metadata: last sync date, total cards, mastered count.

### 3.5 PWA & Offline Support
- Service worker pre-caches shell assets and last-known CSV snapshot.
- Offer manual "Download latest" control to update cached data.
- Provide install prompt info and fallback instructions.

## 4. Data Model
```ts
interface Card {
  id: string;            // hash of row content
  acronym?: string;
  fullName?: string;
  explanation?: string;
  rowIndex: number;      // used to detect newly appended rows
}

interface Prompt {
  id: string;            // `${cardId}|${direction}`
  question: string;
  answer: string;
  cardId: string;
  direction: 'A2F' | 'F2A' | 'A2E' | 'E2A' | 'F2E' | 'E2F';
}

// Prompts are generated only for field pairs that exist; rows missing fields still form partial decks.

interface Sm2State {
  repetitions: number;
  interval: number;      // in days
  easiness: number;      // EF
  nextReview: string;    // ISO date
}

interface StoredProgress {
  version: 1;
  sourceUrl: string;
  maxActive: number;
  prompts: Record<string, Sm2State>;
  knownCsvSignature: string; // e.g., etag+length hash
  lastRowProcessed: number;  // append-only sync marker
  lastSync: string;
}
```

## 5. Technical Stack & Architecture
- **Framework**: Vanilla JS or lightweight framework (e.g., Svelte, Vue) — preference for lightweight vanilla + Alpine.js style to minimize build setup, aligning with other tools.
- **Build**: Use existing Jekyll pipeline; place final app under `resources/tools/supermemo2/` with static assets.
- **Styling**: Reuse site’s utility classes (`assets/css`) or create scoped styles.
- **CSV Parsing**: Use Papa Parse (via CDN) or custom parser for small size.
- **State Management**: Single store module managing prompts, review queue, and persistence.
- **PWA**: Register service worker scoped to app directory, using Workbox CDN or custom caching logic.

## 6. Implementation Phases
1. **Scaffolding**
   - Create tool directory with HTML shell, CSS, JS modules, service worker, manifest.
   - Add navigation entry to `tools.md` and `tools.en.md`.
2. **CSV Import & Parsing**
   - Build source selection UI; handle fetch, parse, and transformation into prompts.
3. **Local Storage Persistence**
   - Implement storage layer with versioning and migration placeholders.
4. **Review Engine**
   - Implement SM-2 logic, prompt scheduling, and review UI components.
5. **Config Page**
   - Build settings modal/page with actions.
6. **PWA Enhancements**
   - Add manifest, service worker caching, offline messaging.
7. **Testing & QA**
   - Focus on structured manual QA sessions covering CSV append updates, missing-field cards, offline mode, and device breakpoints.
8. **Documentation & Launch**
   - Update README/tools docs, provide usage instructions, sample CSV.

## 7. Open Questions & Risks
- Should CSV refresh automatically on app load or rely on manual refresh? (Plan: attempt auto-refresh with grace period, allow manual override.)
- Access control for CSV? If behind authentication, browser fetch may fail; document requirement for public URLs.
- Large CSV performance: consider lazy activation or chunked fetch if >2k rows.

## 8. Deliverables
- Single-page PWA hosted at `/resources/tools/supermemo2/`.
- Updated tool listings and documentation.
- Sample CSV hosted alongside the tool for quick testing.
- Technical notes summarizing SM-2 grading scales and how to reset progress.

## 9. Timeline (Estimate)
- Week 1: Scaffolding, CSV import, persistence skeleton.
- Week 2: Review engine, config page, styling.
- Week 3: PWA enhancements, QA, documentation.

## 10. Future Enhancements (Post-MVP)
- Tag filtering or category-based study sessions.
- Import from Google Sheets or GitHub gist automatically.
- Progress analytics dashboard (graphs, streaks).
- Optional spaced repetition algorithm tweaking (e.g., FSRS).
- Support for multimedia fields (images/audio) if CSV expands.
