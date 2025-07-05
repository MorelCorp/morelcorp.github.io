---
layout: planprism
permalink: /planprism/confidence-method/
title: "The Confidence Ratio Method"
description: "Theory and implementation details of the confidence-based estimation approach used in PlanPrism."
---

# The Confidence Ratio Method

PlanPrism uses a unique confidence-based estimation approach to help teams plan sprints with realistic expectations and actionable insights. This page explains the theory behind the method and how it is implemented in the app.

---

## For Scrum Masters & Agilists: Understanding the Theory

### Why Confidence-Based Estimation?

Traditional single-point estimates (hours or story points) often fail to capture the uncertainty inherent in software development. The Confidence Ratio Method bridges the gap between concrete hours and the need to express uncertainty, making planning more transparent and actionable.

### How It Works (By Hand)

1. **Original Estimate (Hours):** Your team's best guess for a task.
2. **Confidence % (1–100%):** How sure you are about that estimate.
   - 90%: "Pretty sure, few unknowns."
   - 50%: "Lots of uncertainty."
   - 20%: "Total guess."
3. **Calculate the Range for Each Issue:**
   - **Optimistic Estimate** = Original × Confidence%
   - **Pessimistic Estimate** = Original ÷ Confidence%
   - Example: A 10-hour task at 50% confidence gives a range from 5 to 20 hours.
4. **Sum the Ranges:**
   - Add up all optimistic estimates for the sprint.
   - Add up all pessimistic estimates for the sprint.
5. **Calculate Sprint Confidence Ratio:**
   - **If team capacity ≥ pessimistic total:** Confidence = 100%
   - **If team capacity ≤ optimistic total:** Confidence = 0%
   - **If in between:** Confidence = (capacity - optimistic) / (pessimistic - optimistic) × 100%

#### Step-by-Step Example

Let's say your team has 32 hours of capacity and three issues:

**Issue 1:** 8 hours at 80% confidence

- Optimistic: 8 × 0.80 = 6.4 hours
- Pessimistic: 8 ÷ 0.80 = 10 hours

**Issue 2:** 12 hours at 60% confidence

- Optimistic: 12 × 0.60 = 7.2 hours
- Pessimistic: 12 ÷ 0.60 = 20 hours

**Issue 3:** 6 hours at 90% confidence

- Optimistic: 6 × 0.90 = 5.4 hours
- Pessimistic: 6 ÷ 0.90 = 6.67 hours

**Totals:**

- Optimistic total: 6.4 + 7.2 + 5.4 = 19 hours
- Pessimistic total: 10 + 20 + 6.67 = 36.67 hours
- Team capacity: 32 hours

**Confidence Ratio:**

- Capacity (32) is between optimistic (19) and pessimistic (36.67)
- Confidence = (32 - 19) / (36.67 - 19) × 100%
- Confidence = 13 / 17.67 × 100% = 73.6%

This means your team has about 74% confidence they can complete the sprint within their 32-hour capacity.

#### Benefits

- **For Managers:** Concrete hours and realistic confidence levels.
- **For Teams:** Express uncertainty without seeming unprofessional.
- **For Planning:** Make informed trade-offs between scope and risk.
- **For Communication:** Stakeholders understand "74% confidence" better than a single 5-point story.

---

## For Developers: Technical Details & Implementation

### Core Formulas

- **Optimistic Estimate (Opt):** Opt = Original × (Confidence% / 100)
- **Pessimistic Estimate (Pess):** Pess = Original ÷ (Confidence% / 100)
- **Sprint Confidence Ratio:**
  - If capacity ≥ pessimistic total: Confidence = 100%
  - If capacity ≤ optimistic total: Confidence = 0%
  - If in between: Confidence = (capacity - optimistic) / (pessimistic - optimistic) × 100%

### Example Calculation

- Original: 8 hours
- Confidence: 75%
- Opt: 8 × 0.75 = 6 hours
- Pess: 8 ÷ 0.75 ≈ 10.67 hours

### Data Flow in PlanPrism

- Estimates and confidence % are pulled from Jira fields.
- Calculations are performed in the frontend (React) and visualized for the user.
- The backend provides the confidence ratio calculation via API endpoint.
- The app visualizes the range for each issue and the overall sprint confidence.

### Edge Cases & Defaults

- If confidence is missing, a default (e.g., 80%) is used.
- Confidence must be between 1 and 100 (validated in UI and backend).
- If original estimate is missing, a default value is used (configurable).
- If team capacity is not set, the confidence ratio cannot be calculated.

### Additional Notes

- The app visualizes the range for each issue and for the sprint as a whole.
- The "Desired Confidence" slider helps teams plan sprints at their preferred risk level.
- The cutline auto-positions to achieve the closest possible match to the desired confidence ratio.

---

For more on the theory, see the [original blog post](/en/post/confidence-ratio-method/). For implementation details, see the [Architecture](/planprism/architecture/) section.
