---
description: "Interview-driven generator for new principle pages in _principles/"
allowed-tools: Bash, Read, Write, Glob, mcp__github__create_pull_request
---

You are helping the site owner add a new principle page to this Jekyll site. The principle to create is: **$ARGUMENTS**

Work through this in three phases. Do not skip ahead — each phase depends on the previous one.

---

## Phase 1: Interview

Tell the user: "I'm going to ask you 7 quick questions to build a high-quality principle page. Answer in rough notes — I'll shape the prose."

Ask these questions **one at a time**, waiting for a full response before asking the next:

1. **Core claim:** In 1–2 sentences, what is the actual belief you're asserting? State it bluntly, as an opinion — not as a neutral observation.

2. **Origin story:** What personal experience, project, or turning point made you believe this? Be specific — name the situation, not just the abstract lesson.

3. **What you're arguing against:** What is the common mistake or wrong way of thinking that this principle pushes back on? What do people do instead, and why does it fail?

4. **Supporting arguments (your H2 sections):** List 2–4 sub-points you want to make. Write each as a position statement, not a neutral label. Example: "Timeboxing forces decisions" not "About timeboxing." These become your section headings.

5. **Memorable one-liner:** Give me one sentence so sharp and complete it belongs in a blockquote — the sentence a reader would screenshot.

6. **How you apply this in practice:** List 2–5 concrete, specific things you do differently because of this belief. Behavioral and specific, not abstract.

7. **Teaser:** Write one sentence (under 140 characters) for this principle — the kind of line that makes someone want to read it. State the tension or the twist.

---

## Phase 2: Draft and Review

Once you have all 7 answers:

**Derive the filename slug:**
- Take the principle title words from `$ARGUMENTS`
- Drop all function words: a, an, the, is, are, was, were, for, and, or, but, in, on, of, to, at, by, with, from
- Lowercase everything
- Join remaining words with hyphens
- Example: "Scrum is the Least Bad Framework" → `scrum-least-bad-framework`

**Get today's date:**
```bash
date +%Y-%m-%d
```

**Write the complete markdown** following this structure exactly:

```markdown
---
title: "<title from $ARGUMENTS>"
teaser: "<answer to Q7>"
date: <today's date>
---

# <title>

<Opening paragraph — state the core claim (Q1) and connect it briefly to the origin (Q2). 2–4 sentences. No hedging. First person.>

## <H2 position statement from Q4, point 1>

<2–4 paragraphs developing this argument. First-person, opinionated. Draw on Q1–Q3 as relevant.>

## <H2 position statement from Q4, point 2>

<2–4 paragraphs.>

## <Additional H2 sections from Q4 as needed — minimum 3 H2s total, maximum 5>

## <H2 that names the mistake from Q3 — write as a position, e.g. "Where This Goes Wrong" or a more specific heading>

<Names the common wrong approach, why it fails. Draw from Q3.>

## How I [Use / Apply] This

<Bulleted list from Q6. Each bullet: **Bold action or term** — 1–2 sentences of specifics.>

> <The one-liner from Q5>
```

**Style rules — follow these strictly:**
- First-person throughout ("I", "my", "I've found")
- Every H2 is a position, not a topic label
- Bold key terms in bullet lists
- No hedge words ("perhaps", "might", "could be argued") — state things directly
- Blockquote appears at the very end, after the "How I" section
- Length: 600–1000 words
- Do NOT include `layout:` or `lang:` in frontmatter — they are injected automatically by `_config.yml`

**Show the complete draft** to the user and say: "Here is the full draft. Tell me any changes — wording, sections to expand or cut, tone — before I create the branch and commit."

Apply any requested changes. Once the user confirms the draft looks good, proceed to Phase 3.

---

## Phase 3: Branch, Commit, and PR

Perform these steps in order:

**1. Check the file does not already exist:**
```bash
test -f _principles/<slug>.md && echo "EXISTS" || echo "OK"
```
If it EXISTS, stop: "A principle with this slug already exists at `_principles/<slug>.md`. Please choose a different title or edit the existing file directly."

**2. Start from an up-to-date main:**
```bash
git checkout main && git pull origin main
```

**3. Create the branch:**
```bash
git checkout -b claude/add-principle-<slug>
```

**4. Write the confirmed draft** to `_principles/<slug>.md` using the Write tool.

**5. Stage and commit:**
```bash
git add _principles/<slug>.md
git commit -m "Add principle: <title from $ARGUMENTS>"
```

**6. Push:**
```bash
git push -u origin claude/add-principle-<slug>
```

**7. Create the PR** using the `mcp__github__create_pull_request` tool with:
- `owner`: `MorelCorp`
- `repo`: `morelcorp.github.io`
- `title`: `Add principle: <title>`
- `head`: `claude/add-principle-<slug>`
- `base`: `main`
- `body`:

```
## New Principle: <title>

**Teaser:** <teaser from Q7>

### What this adds
A new entry to the `_principles/` collection: <one-sentence summary of the core claim>.

### File created
- `_principles/<slug>.md`

### Review checklist
- [ ] Frontmatter valid (title, teaser, date — no layout or lang)
- [ ] H1 matches title exactly
- [ ] 3–5 H2 sections, each a position statement
- [ ] Closing "How I use/apply this" section present
- [ ] Blockquote at the very end
- [ ] Length 600–1000 words

### Preview
Visit `/principles/<slug>/` after merge to see the rendered page.
```

After the PR is created, share the PR URL with the user.
