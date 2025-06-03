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
---

<figure>
  <img src="/images/posts/planning.jpg" alt="Photo by Jason Goodman on Unsplash" style="width:100%;max-width:700px;display:block;margin:0 auto;">
  <figcaption style="text-align:center;font-size:0.95em;">Photo par <a href="https://unsplash.com/fr/@jasongoodman_youxventures" target="_blank" rel="noopener ugc nofollow">Jason Goodman</a> sur <a href="https://unsplash.com/" target="_blank" rel="noopener ugc nofollow">Unsplash</a></figcaption>
</figure>

Let's talk about estimates for a minute. This topic has sparked more debates in software development teams than vi vs emacs (okay, maybe not quite, but close...).

Story points seemed like the perfect solution, abstract, relative, immune to the dreaded hour-based micromanagement. And honestly? I still love story points. But they're incredibly hard to master, and most organizations fall into the same trap: using them as metrics to judge team performance. "Why did you only deliver 23 points this sprint when you committed to 30?"

Then there's the Kanban approach (forego estimation altogether, use task history and Monte Carlo simulations). It's mathematically sound but requires blind faith from stakeholders. Try explaining to a project manager that you can't give them a timeline because "the numbers will emerge from the data."

The #NoEstimates movement? I'm quite fond of it. Let a small autonomous team do their best work, and you'll get gold.

BUT there are real advantages to larger organizations: stability, resources, the ability to tackle bigger problems. And here's the uncomfortable truth: you can only be as Agile as your environment will allow. Most managers think in terms of hours. Not because they're dinosaurs, but because that's the language of business planning.

> you can only be as Agile as your environment will allow

So what if we could bridge this gap?

## The Confidence Ratio Method

I've been thinking about what I'm calling the "confidence ratio" approach, a best-of-both-worlds solution. Traditional managers get their hours, agilists can express uncertainty quantifiably.

Here's how it works:

**Step 1: Make Your Original Estimate**
Start with a time estimate in hours. Your team's best guess (not a commitment, just your most honest assessment).

**Step 2: Add Your Confidence Percentage**
Express how confident you are in that estimate (1-100%):

- 90%: "Pretty sure about this, barring huge surprises"
- 50%: "Could go either way, lots of unknowns"
- 20%: "Total shot in the dark"

**Step 3: Calculate Your Range**

- **Optimistic estimate** = Original × Confidence%
- **Pessimistic estimate** = Original ÷ Confidence%

Example: 10-hour task with 50% confidence = 5 to 20 hour range.

**Step 4: Plan with Ranges**
Instead of committing to exactly X hours, you commit to a range. Sprint planning becomes: "Given our 80-hour capacity, we're 70% confident we can complete this scope." It will be up to each teams and each manager to define their comfort levels with regards to confidence (risk) depending on the current state of things.

## Why This Should Work

**For Managers:** Concrete hours and realistic ranges. No more surprise revelations that the "3-point story" took three weeks.

**For Teams:** Express uncertainty without seeming unprofessional. That gnawing feeling about unknown complexity? Now it's quantified.

**For Planning:** Make informed trade-offs. Want higher confidence? Reduce scope. Tight deadline? Accept lower confidence and the risk that comes with it or better yet, reduce scope.

**For Communication:** Stakeholders understand "15-40 hours" better than "5-point story."

## Trying This Manually

Here's how you could experiment with this in your next planning session:

1. For each task, ask: "How many hours?" and "How confident are you?"
2. Calculate ranges using the formulas above
3. Sum optimistic and pessimistic totals
4. Compare against team capacity
5. Adjust scope based on your comfort with the confidence level
6. Compute the interation total confidence ratio according to available time.

A great and beautiful thing is it forces honest conversations. That 4-hour task with 30% confidence? Time to talk about what's creating the uncertainty. From this will probably emerge refinement tasks which will focus on raising the confidence level of the estimate up to acceptable levels.

## Let's Experiment

Confession time: I haven't tried this with any team yet, but I'm convinced it should work. The math is straightforward, but robust enough for complex planning. You could even run Monte Carlo simulations on the ranges if you want to get fancy.

The challenge is doing all this calculation manually. Spreadsheets work, but they're clunky for visualizing ranges, comparing capacity, and making it intuitive for everyone.

I'd love to see teams experiment with this approach. Maybe it evolves into something completely different. Maybe it fails spectacularly. But I think there's something here worth exploring.

If only someone were to create an app that could handle all this math automatically and integrate with existing project management tools... (To Be Continued)

Thanks for reading,
JF

Have a great week!
