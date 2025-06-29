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
