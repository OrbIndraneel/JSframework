---
version: alpha
name: CampusConnect
description: A practical placement workspace for a college community. Built around the work students, recruiters, placement teams, and alumni actually need to do.
colors:
  primary: "#2457C5"
  primary-hover: "#1D46A3"
  primary-soft: "#EAF0FF"
  on-primary: "#FFFFFF"
  ink: "#172033"
  muted: "#647084"
  border: "#DCE2EA"
  canvas: "#F6F8FB"
  surface: "#FFFFFF"
  success: "#18794E"
  success-soft: "#E8F5EE"
  warning: "#946200"
  warning-soft: "#FFF4D6"
  danger: "#B42318"
  danger-soft: "#FDECEA"
typography:
  page-title:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  section-heading:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  card-heading:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  metadata:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  kpi-number:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
rounded:
  input: 8px
  card: 10px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.input}"
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: 40px
  nav-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: 24px
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
    padding: 4px
  text-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
  divider-label:
    backgroundColor: "{colors.border}"
    textColor: "{colors.ink}"
---

## Overview

CampusConnect brings placement activity into one dependable place: opportunities, applications, recruitment drives, outcomes, and alumni guidance.

The interface feels like a well-run university service — not a generic startup landing page and not an AI-generated admin template. It prioritizes clarity, useful information density, predictable navigation, and credible data presentation.

### Principles
- **Utility before spectacle**: Make the next action obvious; keep decoration secondary. Avoid glowing gradients, glassmorphism, giant rounded cards, and excessive pill-shaped controls.
- **Specific, not generic**: Use language from campus recruitment — eligibility, drive, application status, shortlist, interview, offer, mentorship.
- **Show real state**: Counts, charts, and status labels come from the API. Never invent activity or stock metrics to make a screen look busy.
- **Accessible by default**: High text contrast, visible keyboard focus, clear field-level errors, and labels that never rely on color alone.

## Colors

A calm, campus-oriented palette. Blue is the primary interaction color; green, amber, and red communicate state only.

- **Primary (`#2457C5`):** Calm campus blue for primary actions, active tabs, and focused controls.
- **Primary Hover (`#1D46A3`):** Darkened blue for tactile hover and active button states.
- **Primary Soft (`#EAF0FF`):** Soft blue tint for active navigation backgrounds and subtle selections.
- **On-Primary (`#FFFFFF`):** High-contrast pure white text for solid buttons and badges.
- **Ink (`#172033`):** Deep charcoal navy for headers, table data, and primary reading text.
- **Muted (`#647084`):** Supporting slate for labels, helper text, and timestamp metadata.
- **Border (`#DCE2EA`):** Crisp neutral borders for cards, table dividers, and inputs.
- **Canvas (`#F6F8FB`):** Calm off-white application background.
- **Surface (`#FFFFFF`):** Pure white container surfaces for cards, panels, and tables.
- **Success (`#18794E`) / Success Soft (`#E8F5EE`):** Forest green for selected, verified, and completed statuses.
- **Warning (`#946200`) / Warning Soft (`#FFF4D6`):** Warm amber for pending actions and deadline warnings.
- **Danger (`#B42318`) / Danger Soft (`#FDECEA`):** Crimson red for rejected applications, errors, and destructive actions.

## Typography

The typography uses `Inter` with system sans-serif fallback for maximum readability, tabular numerals for analytics, and comfortable line lengths.

- **Page Title (`page-title`):** 28–32px, font-weight 700 for page headings.
- **Section Heading (`section-heading`):** 18–22px, font-weight 600 for dashboard sections and card groupings.
- **Card Heading (`card-heading`):** 14–16px, font-weight 600 for card headers and modal titles.
- **Body (`body`):** 14–15px, font-weight 400 for standard content and table cells.
- **Metadata (`metadata`):** 12–13px, font-weight 500 for timestamps, field labels, and badges.
- **KPI Number (`kpi-number`):** 26–32px, font-weight 700 with tabular numerals for accurate data scanning.

## Layout

- **Authenticated Shell:** Fixed-width 240px left sidebar, persistent top bar with user context, and a contained main content container (max-width 1280px).
- **Page Spacing:** Consistent 4px scale rhythm (`4, 8, 12, 16, 24, 32, 40, 48px`). Panel padding is 20–24px on desktop, 16px on mobile.
- **Responsive Layout:** Clean CSS grids (`grid-2`, `grid-3`, `grid-4`) that collapse gracefully to 1 or 2 columns on mobile devices without clipping.

## Elevation & Depth

Visual hierarchy is conveyed through crisp borders (`#DCE2EA`) and tonal layer contrast (`#F6F8FB` canvas vs `#FFFFFF` surface) rather than heavy drop shadows:

- **Border-First Architecture:** Clean 1px solid dividers define panels, table cells, and navigation.
- **Subtle Elevation:** Cards use minimal ambient shadows (`0 1px 3px rgba(23, 32, 51, 0.05)`) to cleanly separate from the canvas background.

## Shapes

- **Inputs & Buttons (`8px`):** Precise 8px corner radius (`rounded.input`) for modern, professional controls.
- **Cards & Panels (`10px`):** Structured 10px corner radius (`rounded.card`) to frame data density comfortably.
- **Status Badges (`9999px`):** Pill-rounded status badges pairing semantic backgrounds with text labels and status icons.

## Components

- **Buttons:**
  - `button-primary`: `#2457C5` background, `#FFFFFF` text, 40px height, 8px radius.
  - `button-secondary`: `#FFFFFF` background with `#DCE2EA` border, `#172033` text, 40px height.
- **Status Badges:**
  - `badge-success`: `#E8F5EE` background, `#18794E` text.
  - `badge-warning`: `#FFF4D6` background, `#946200` text.
  - `badge-danger`: `#FDECEA` background, `#B42318` text.
- **Data Tables:**
  - Crisp header with `#DCE2EA` bottom border, uppercase tracking, clear alignment, right-aligned numbers, and predictable row actions.

## Do's and Don'ts

### Do's
- Do use calm campus blue (`#2457C5`) for primary interactive controls.
- Do accompany every status color with a visible text label and clear status state.
- Do preserve real API data integrity — display real numbers and helpful empty states.
- Do keep input heights consistently between 40px and 44px with 8px radius.

### Don'ts
- Don't use glowing gradients, neon glows, glassmorphism, or floating decorative elements.
- Don't invent fake placement rates, mock statistics, or stock marketing testimonials.
- Don't use emoji as interface icons; use Lucide icons.
- Don't rely on color alone to communicate application status or verification.
