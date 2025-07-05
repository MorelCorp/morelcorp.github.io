---
layout: planprism
permalink: /planprism/user-guide/
title: "User & Setup Guide"
description: "How to set up and use PlanPrism for sprint planning with Jira."
---

# PlanPrism User & Setup Guide

This guide will help you set up PlanPrism, connect it to your Jira instance, and use it for effective sprint planning.

---

## 1. Introduction

PlanPrism integrates with Jira to help you plan sprints with confidence, using range-based estimation and confidence metrics.

## 2. Prerequisites

- Access to a Jira Cloud instance (admin rights recommended)
- PlanPrism account or invitation
- Custom field permissions in Jira

## 3. Logging In

- Go to the PlanPrism login page.
- Click "Login with Jira" on the welcome screen.
- Authorize access and select your Jira site.

## 4. Authorizing PlanPrism with Jira

- You will be redirected to Atlassian to grant PlanPrism access to your Jira account.
- Select the appropriate Jira site and grant the requested permissions.

## 5. First-Time Configuration

- After authentication, you will be prompted to configure PlanPrism.
- Enter your Jira instance URL, Original Estimate Field ID, and Confidence Ratio Field ID.
- Set team capacity and default values as needed.

## 6. Navigating the Dashboard

- The main dashboard provides project, sprint, and issue selectors.
- Use the sidebar and menus to access configuration and user settings.

## 7. Managing Sprints and Issues

- View and select sprints from your Jira projects.
- Drag-and-drop to reorder issues within a sprint.
- Change issue status (e.g., In Progress, Done).
- Edit issue details such as estimate and confidence.

## 8. Using the Confidence Slider

- Adjust the "Desired Confidence" slider to set your team's risk tolerance.
- The cutline and sprint metrics update in real time as you adjust confidence.

## 9. Tips & Best Practices

- Use ranges to communicate uncertainty in estimates.
- Refine low-confidence tasks before committing to a sprint.
- Regularly review and adjust team capacity and defaults.

## 10. Troubleshooting & FAQ

### Troubleshooting

- Issues not appearing? Check Jira field configuration and permissions.
- Problems with login? Reauthorize PlanPrism in Jira.
- If you can't see your projects or issues, check field IDs and permissions.
- For OAuth errors, verify callback URLs and client credentials.

### FAQ

- _Q: What permissions does PlanPrism need?_
  - A: Read/write access to issues, projects, and custom fields in Jira.
- _Q: Can I use PlanPrism with multiple Jira instances?_
  - A: Not currently, but support is planned.

## Understanding the Confidence Ratio

PlanPrism uses a sophisticated **capacity-aware confidence ratio** to help you make informed sprint planning decisions. This method takes into account your team's actual capacity, not just the estimates.

### How It Works

The confidence ratio is calculated using three key inputs:

- **Total Optimistic Estimate**: The sum of all optimistic estimates for issues above the cutline
- **Total Pessimistic Estimate**: The sum of all pessimistic estimates for issues above the cutline
- **Team Capacity**: Your team's available hours for the sprint

### The Formula

**If your capacity ≥ total pessimistic estimate:**

- Confidence = 100% (you're guaranteed to complete the work)

**If your capacity ≤ total optimistic estimate:**

- Confidence = 0% (you cannot complete the work)

**If your capacity is between optimistic and pessimistic:**

- Confidence = (capacity - optimistic) ÷ (pessimistic - optimistic) × 100%

### Example

Let's say you have three issues above the cutline:

- Issue A: 8 hours original, 80% confidence → 6.4h optimistic, 10h pessimistic
- Issue B: 12 hours original, 60% confidence → 7.2h optimistic, 20h pessimistic
- Issue C: 6 hours original, 90% confidence → 5.4h optimistic, 6.7h pessimistic

**Totals:** 19 hours optimistic, 36.7 hours pessimistic  
**Team Capacity:** 32 hours

Since 32 is between 19 and 36.7:
Confidence = (32 - 19) ÷ (36.7 - 19) × 100% = 73.4%

This means you have a 73.4% chance of completing all the work with your current capacity.

### What This Tells You

- **High confidence (80%+):** You're likely to complete all the work
- **Medium confidence (50-80%):** You have a reasonable chance, but consider removing one issue
- **Low confidence (below 50%):** You're unlikely to complete all the work; remove some issues

The confidence ratio updates in real-time as you move the cutline, helping you find the optimal balance between ambition and achievability.

---

## 11. Walkthrough Screenshots

![Login to PlanPrism](/images/planprism/login-screen.png)
_Login to PlanPrism with your Jira account._

![Authorize PlanPrism in Atlassian](/images/planprism/atlassian-oauth-consent.png)
_Authorize PlanPrism to access your Atlassian Jira account._

![Authentication Successful](/images/planprism/authentication-success.png)
_Authentication successful – continue to the application._

![Configuration Screen](/images/planprism/configuration-screen.png)
_Configure your Jira connection and sprint defaults in PlanPrism._

![PlanPrism Dashboard](/images/planprism/screenshot.png)
_PlanPrism sprint planning dashboard: visualize capacity, confidence, and manage sprint issues._

---
