---
layout: post
title: "The Confidence Ratio Method"
subtitle: "A New (?) Approach to Software Estimates"
teaser: "A New (?) Approach to Software Estimates"
author: "@morelcorpjeff"
date: 2025-06-03
lang: en
show_meta: true
comments: true
permalink: en/post/confidence-ratio-method/
cover_image:
  src: /images/posts/planning.jpg
  alt: "Photo by Jason Goodman on Unsplash"
  author: "Jason Goodman"
  author_url: "https://unsplash.com/fr/@jasongoodman_youxventures"
  source: "Unsplash"
  source_url: "https://unsplash.com/"
categories: [agile, planning, estimation]
tags: [sprint-planning, confidence-ratio, capacity-planning]
---

Let's talk about estimates. This topic has sparked more heated debates in software teams than vi vs emacs (okay, maybe not quite, but you get the idea).

Story points? They seemed like the perfect solution: abstract, relative, immune to the dreaded hour-based micromanagement. And honestly? I still love story points. But let's be real—they're incredibly hard to master, and most organizations fall into the same trap: using them as a metric to judge team performance. "Why did you only deliver 23 points this sprint when you committed to 30?"

Then there's the Kanban approach (ditch estimation, use task history and Monte Carlo simulations). It's mathematically sound, but it takes a leap of faith from stakeholders. Try telling a project manager you can't give them a timeline because "the numbers will emerge from the data." Good luck with that.

The #NoEstimates movement? I'm a fan. Let a small, autonomous team do their best work and you'll get magic.

BUT there are real advantages to big organizations: stability, resources, the ability to tackle bigger problems. And here's the uncomfortable truth: you can't be more Agile than your environment allows. Most managers think in hours. Not because they're dinosaurs, but because that's the language of business planning.

> you can't be more Agile than your environment allows

So what if we could bridge that gap?

## The Confidence Ratio Method

Most estimation methods in software development ignore uncertainty or hide it behind abstract numbers. The confidence ratio method puts uncertainty front and center, allowing you to plan a sprint with a clear, quantified view of risk.

## The Basics

For each task:

1. **Estimate the work in hours** (e.g., 10h)
2. **Assign a confidence percentage** (e.g., 80% if you're pretty sure, 50% if there are unknowns, etc.)

With this, you get:

- **Optimistic estimate** = Original estimate × Confidence%
- **Pessimistic estimate** = Original estimate ÷ Confidence%

But how do you calculate the **confidence ratio for the entire sprint** while considering team capacity?

## The Confidence Ratio Formula

The sprint confidence ratio takes into account the team's actual capacity to give you a precise measure of success probability.

**Formula:**

**If capacity ≥ total pessimistic:** Confidence = 100%  
**If capacity ≤ total optimistic:** Confidence = 0%  
**If capacity is between optimistic and pessimistic:** Confidence = (capacity - optimistic) ÷ (pessimistic - optimistic) × 100%

This number tells you, for the entire set of tasks, what the real probability of success is given your capacity.

---

## Step-by-Step Example

Let's walk through a simple example with 3 issues and a team capacity of 32 hours.

| Issue | Original Estimate (h) | Confidence (%) | Optimistic (h) | Pessimistic (h) |
| ----- | --------------------- | -------------- | -------------- | --------------- |
| A     | 8                     | 80             | 6.4            | 10              |
| B     | 12                    | 60             | 7.2            | 20              |
| C     | 6                     | 90             | 5.4            | 6.7             |

**Team Capacity:** 32 hours

**1. Calculate optimistic and pessimistic for each issue**

- A: 8h × 0.8 = 6.4h (optimistic), 8h ÷ 0.8 = 10h (pessimistic)
- B: 12h × 0.6 = 7.2h (optimistic), 12h ÷ 0.6 = 20h (pessimistic)
- C: 6h × 0.9 = 5.4h (optimistic), 6h ÷ 0.9 = 6.7h (pessimistic)

**2. Add up the totals**

- Total optimistic: 6.4 + 7.2 + 5.4 = **19h**
- Total pessimistic: 10 + 20 + 6.7 = **36.7h**

**3. Compare to team capacity**

- Capacity (32h) is between optimistic (19h) and pessimistic (36.7h)
- So we use the interpolation formula: (32 - 19) ÷ (36.7 - 19) × 100%
- Sprint confidence ratio = 13 ÷ 17.7 × 100% ≈ **73.4%**

**4. What does this mean?**

- You have **73.4% confidence** that the team can complete all three issues in the sprint, given a 32-hour capacity.
- This method gives you a precise measure of success probability!

---

## Key Takeaways

- The sprint confidence ratio gives you a precise measure of success probability
- This method makes risk visible and actionable
- You can adjust scope or refine tasks to reach your desired confidence level

---

**Try it in your next sprint!**  
And if you want to see this math done automatically, check out [PlanPrism](/planprism/), our app that brings this method to life.

Thanks for reading,
JF

Have a great week!
