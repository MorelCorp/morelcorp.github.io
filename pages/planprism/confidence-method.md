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
3. **Calculate the Range:**
   - **Optimistic Estimate** = Original × Confidence%
   - **Pessimistic Estimate** = Original ÷ Confidence%
   - Example: A 10-hour task at 50% confidence gives a range from 5 to 20 hours.
4. **Plan with Ranges:**
   - Instead of committing to a single number, you plan for a range.
   - Sum optimistic and pessimistic totals for the sprint.
   - Compare against team capacity and adjust scope or confidence as needed.

#### Benefits

- **For Managers:** Concrete hours and realistic ranges.
- **For Teams:** Express uncertainty without seeming unprofessional.
- **For Planning:** Make informed trade-offs between scope and risk.
- **For Communication:** Stakeholders understand 15–40 hours better than a single 5-point story.

---

## For Developers: Technical Details & Implementation

### Core Formulas

- **Optimistic Estimate (Opt):** Opt = Original × (Confidence% / 100)
- **Pessimistic Estimate (Pess):** Pess = Original ÷ (Confidence% / 100)

### Example Calculation

- Original: 8 hours
- Confidence: 75%
- Opt: 8 × 0.75 = 6 hours
- Pess: 8 ÷ 0.75 ≈ 10.67 hours

### Data Flow in PlanPrism

- Estimates and confidence % are pulled from Jira fields.
- Calculations are performed in the frontend (React) and visualized for the user.
- The backend persists configuration and cutline positions, but the core math is client-side for responsiveness.

### Edge Cases & Defaults

- If confidence is missing, a default (e.g., 80%) is used.
- Confidence must be between 1 and 100 (validated in UI and backend).
- If original estimate is missing, a default value is used (configurable).

### Additional Notes

- The app visualizes the range for each issue and for the sprint as a whole.
- The "Desired Confidence" slider helps teams plan sprints at their preferred risk level.
- The cutline auto-positions to achieve the closest possible match to the desired confidence ratio.

---

For more on the theory, see the [original blog post](/en/post/confidence-ratio-method/). For implementation details, see the [Architecture](/planprism/architecture/) section.
