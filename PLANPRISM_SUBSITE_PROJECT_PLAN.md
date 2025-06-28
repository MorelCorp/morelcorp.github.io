# PlanPrism Subsite Project Plan (English Only)

## Overview

This document outlines the detailed project plan for implementing the PlanPrism subsite at `https://morelcorp.ca/planprism/` using the [Bulma Clean Theme](https://github.com/chrisrhymes/bulma-clean-theme). The subsite will serve as the main hub for PlanPrism product information, guides, legal pages, and support, and will be English-only.

---

## 1. Site Architecture & Navigation

### 1.1. URL Structure

- `/planprism/` — Main landing page for PlanPrism
- `/planprism/setup/` — Setup Guide
- `/planprism/user-guide/` — User Guide
- `/planprism/privacy/` — Privacy Policy
- `/planprism/terms/` — Terms of Service
- `/planprism/support/` — Customer Support/Contact

### 1.2. Navigation

- Use a left sidebar navigation for all PlanPrism pages
- Top bar with PlanPrism logo and "Back to MorelCorp" link

### 1.3. Project Page Update

- `/projects/planprism/` will contain a short intro and a prominent link/button to `/planprism/`

---

## 2. Theme & Styling

### 2.1. Theme

- Use Bulma Clean Theme for all `/planprism/` pages
- Integrate Bulma via remote_theme or by copying theme files as needed

### 2.2. Customization

- Override Bulma variables to match MorelCorp's color scheme and fonts
- Add custom SCSS (e.g., `assets/css/planprism-custom.scss`)
- Import main site font (e.g., via Google Fonts) in PlanPrism layout
- Ensure visual connection to main site (logo, accent colors)

---

## 3. Content Structure

### 3.1. Pages

- `/planprism/index.md` — Overview (What is PlanPrism, features, screenshots, "Get Started" button)
- `/planprism/setup.md` — Step-by-step setup guide (with annotated screenshots, Jira integration, permissions, FAQ)
- `/planprism/user-guide.md` — User guide (logging in, dashboard, managing sprints/issues, configuration, tips)
- `/planprism/confidence-method.md` — **Confidence Computation Theory**
  - **For Scrum Masters/Agilists:**
    - Explain the "Confidence Ratio Method" in plain language
    - How to use it in sprint planning and estimation
    - Step-by-step guide to doing it "by hand" (formulas, examples, rationale)
    - Why it helps teams and managers (communication, risk, transparency)
  - **For Developers:**
    - Technical details of the confidence calculation
    - How the app implements the method (formulas, data flow)
    - Edge cases and defaults
- `/planprism/architecture.md` — **System Architecture**
  - High-level overview for all audiences
  - Technical details for developers and open source contributors
  - Security principles, deployment options, and diagrams
- `/planprism/privacy.md` — Privacy Policy (simple, clear, reflects no data storage outside Jira, contact info)
- `/planprism/terms.md` — Terms of Service (as-is, no warranty, limitation of liability)
- `/planprism/support.md` — Support/Contact (email/form, response time, link to MorelCorp support if needed)

### 3.2. Sidebar Navigation

- Implement as `_includes/planprism_sidebar.html` and include in PlanPrism layout
- **Update navigation to include:**
  - Overview
  - Setup Guide
  - User Guide
  - Confidence Method
  - Architecture
  - Privacy Policy
  - Terms of Service
  - Support/Contact

---

## 4. Technical Implementation

### 4.1. Jekyll Structure

- Create `/planprism/` folder for all subsite pages
- Create `_layouts/planprism.html` for custom PlanPrism layout (based on Bulma Clean Theme)
- Add custom SCSS for color/font overrides
- Add sidebar include and top bar

### 4.2. Theme Integration

- Add Bulma Clean Theme as a remote theme in `_config.yml` (if not global, copy necessary files)
- Import and override Bulma variables in custom SCSS
- Ensure only `/planprism/` pages use the new layout/theme

### 4.3. Deployment

- All changes are within the same Jekyll/GitHub Pages deployment
- No changes to the main site's theme/layout for other sections

---

## 5. Jira Marketplace Requirements

- Privacy Policy: `/planprism/privacy/`
- Terms of Service: `/planprism/terms/`
- Support: `/planprism/support/`
- These URLs will be provided in the Jira vendor console

---

## 6. Checklist

### Site Structure & Navigation

- [ ] Create `/planprism/` folder and all required Markdown pages
- [ ] Update `/projects/planprism/` with intro and link to subsite
- [ ] Implement sidebar navigation include
- [ ] Implement top bar with logo and back link

### Theme & Styling

- [ ] Add Bulma Clean Theme as remote theme or copy files
- [ ] Create `_layouts/planprism.html` using Bulma Clean Theme
- [ ] Add custom SCSS for color/font overrides
- [ ] Import main site font in PlanPrism layout
- [ ] Test and tweak for brand consistency

### Content

- [ ] Draft Overview page with features and screenshots
- [ ] Draft Setup Guide with annotated screenshots and Jira integration steps
- [ ] Draft User Guide with usage instructions and tips
- [ ] Draft **Confidence Method** page:
  - [ ] Section for Scrum Masters/Agilists (theory, by-hand method, rationale)
  - [ ] Section for Developers (technical details, implementation)
- [ ] Draft **Architecture** page (overview, technical details, security, deployment)
- [ ] Draft Privacy Policy (simple, clear, no data storage outside Jira)
- [ ] Draft Terms of Service (as-is, no warranty, limitation of liability)
- [ ] Draft Support/Contact page (email/form, response time)

### Technical

- [ ] Ensure only `/planprism/` uses Bulma Clean Theme
- [ ] Sidebar navigation works on all PlanPrism pages
- [ ] All links and navigation are correct
- [ ] Responsive design tested

### Jira Marketplace

- [ ] Confirm legal/support URLs are accessible and correct
- [ ] Provide URLs in Jira vendor console

### Confidence Computation & Architecture

- [ ] Create `/planprism/confidence-method.md` with detailed explanation for both agilists and developers
- [ ] Create `/planprism/architecture.md` with open-source-friendly architecture overview
- [ ] Add links to these new pages in the PlanPrism sidebar navigation

---

## 7. Implementation Notes

- The PlanPrism subsite is **English only**; no bilingual support is required.
- All content, navigation, and legal pages must be in English.
- Maintain a visual connection to the main site, but PlanPrism can have its own distinct look using Bulma.
- All work is to be done within the existing Jekyll/GitHub Pages structure.

---

## 8. References

- [Bulma Clean Theme on Jamstack Themes](https://jamstackthemes.dev/theme/bulma-clean-theme/)
- [Bulma Clean Theme GitHub](https://github.com/chrisrhymes/bulma-clean-theme)
- [Bulma Customization Docs](https://bulma.io/documentation/customize/variables/)
