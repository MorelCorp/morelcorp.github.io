# Handoff — Gym in a Box feature work

## TL;DR — the one thing that still needs doing

**PR #12 is still open and must be merged.** It contains the fix that the user
actually wants in production (the "I deployed but don't see my changes" fix).
It is exactly one commit ahead of `main`, parent == `main` HEAD, **zero
conflicts, fast-forward mergeable as-is** — no rebase needed.

- PR #12: https://github.com/MorelCorp/morelcorp.github.io/pull/12
- Branch: `claude/gym-box-version-stamp`

The user must approve the merge (merging is their call). Last turn ended on
that exact question: "Do you want me to merge #12 now, or will you?"

## Project / file scope

Single-file PWA. All work is confined to:
- `resources/tools/gym-in-a-box/gym-in-a-box.html` (~1500 lines: markup + CSS + JS, exercise registry, save system)
- `resources/tools/gym-in-a-box/service-worker.js` (offline cache + fetch strategy)

GitHub access is scoped to `morelcorp/morelcorp.github.io` only.

## Current repo state (verified)

- `main` HEAD = `328a2b3` = "Merge pull request #11". It **contains** the
  feature work but **does NOT contain** PR #12's version stamp / network-first
  service worker.
- PR #11 (feature) is **MERGED**; its branch `claude/gym-box-save-features-004bfs`
  was **deleted**.
- PR #12 (version stamp + caching fix) is **OPEN**, branch `claude/gym-box-version-stamp`
  exists at `00cebc4`.

### Important mix-up to be aware of
The user believed they merged #12, but they actually merged **#11** and deleted
**#11's** branch. So `main` shipped the features without the caching fix. This
is why the deployed site still serves stale content via the old cache-first
service worker until #12 lands. Do not re-do or re-rebase #11 — it is already in
`main`.

## What was built (see commits/PRs for detail, not duplicated here)

Two logical units, both described fully in their PR bodies:
1. **PR #11** — countdown beeps, re-roll dice (3/quest, same broad muscle
   group), new Squire tier with slower XP pacing, +100 exercises (now 200
   total). Full rationale + the tier XP table are in the PR #11 description and
   commit `c0e0b7c`.
   https://github.com/MorelCorp/morelcorp.github.io/pull/11
2. **PR #12** — `BUILD <ver> · <N> TRIALS` stamp in the Codex, service worker
   switched to network-first for HTML (cache-first kept for fonts/icons),
   `APP_VERSION` + SW `CACHE` bumped to `v6`. Full rationale in the PR #12
   description and commit `00cebc4`.
   https://github.com/MorelCorp/morelcorp.github.io/pull/12

## Conventions established this session (don't relearn the hard way)

- **Version bumps go together:** every deploy should bump `APP_VERSION` in
  `gym-in-a-box.html` AND the `CACHE` name in `service-worker.js` in lockstep.
  Current value is `v6`.
- **Exercise registry integrity:** entries are authored via `mkEx({...})` and
  validated at boot by `buildPool()` — bad/duplicate entries are dropped with a
  console warning, not thrown. Adding any new tier id requires adding that id to
  `DEFAULT_SETS`, `DEFAULT_REPS`, `DEFAULT_TIMED`, and every `W` weight table,
  or exercises silently fail validation.
- **Save format is forward-compatible** (see the big comment block above
  `SCHEMA_VERSION` in the HTML). `normalize()` preserves unknown keys; never
  rename/delete persisted fields, migrate instead. Tier ids are additive —
  `squire` was inserted without renaming existing ids, so old saves keep working.
- **Local validation that was run and should be re-run after edits:**
  - `node --check` on the extracted `<script>` block and on `service-worker.js`.
  - A throwaway node script that regex-scans every `mkEx({...})` for unique ids
    and valid equipment/rank/category tokens (confirmed 200 entries, all valid).

## After #12 merges — verification steps

1. Let the GitHub Pages action deploy.
2. Open the tool, open the Codex (gear icon), confirm it reads `BUILD v6 · 200 TRIALS`.
3. Old service worker still controls open tabs: fully close/reopen the PWA or
   hard-refresh twice for v6 to take over (one-time). After this, network-first
   means future deploys appear on next reload.

## Suggested skills for the next agent

- **`verify`** — after #12 merges and deploys, drive the app to confirm the
  `BUILD v6` stamp shows and that re-roll/countdown/tier behaviour works in the
  real app, not just in tests.
- **`code-review`** — if any further changes are made to the single-file app,
  review the working diff before pushing (this codebase has subtle
  registry/save-format invariants noted above).
- **`add-principle`** — only relevant if the user pivots back to site content
  (`_principles/`); not needed for the gym tool work.

## Open questions / decisions already settled

- Re-roll scope = **same broad type** (upper=push/pull, lower=hinge/squat, core,
  fullbody). Settled by the user.
- Tier pacing = escalating, harder higher tiers (≈10 → 15 → 25 → 40 sessions).
  Settled by the user; numbers live in `RANKS` in the HTML.
- No sensitive data involved anywhere in this work.
