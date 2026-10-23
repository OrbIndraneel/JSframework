---
version: alpha
name: CampusConnect
description: Visual design system and design tokens for CampusConnect - College Placement & Alumni Portal
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  on-primary: "#ffffff"
  secondary: "#475569"
  secondary-bg: "#ffffff"
  background: "#f8fafc"
  surface: "#ffffff"
  surface-muted: "#f1f5f9"
  text: "#0f172a"
  text-muted: "#64748b"
  success: "#065f46"
  success-bg: "#ecfdf5"
  warning: "#92400e"
  warning-bg: "#fffbeb"
  danger: "#991b1b"
  danger-bg: "#fef2f2"
  info: "#1e40af"
  info-bg: "#eff6ff"
typography:
  h1:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
  h2:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
  h3:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  label-caps:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.secondary-bg}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.sm}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 24px
  container-main:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    padding: 24px
  table-header:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.secondary}"
    padding: 12px
  text-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-danger:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    rounded: "{rounded.full}"
    padding: 4px
---

## Overview

CampusConnect is a college placement, recruitment, and alumni networking portal designed for academic institutions, graduating students, corporate recruiters, and alumni mentors.

The visual identity embodies **Academic Professionalism and Clarity**. The user interface uses a crisp slate and royal blue aesthetic reminiscent of modern enterprise educational suites and institutional career centers. Clean cards, prominent metric badges, and clear visual hierarchy reduce cognitive overload for students reviewing job listings and placement officers managing bulk student workflows.

## Colors

The CampusConnect color palette is engineered for high contrast, trustworthy institutional presence, and WCAG AA accessibility compliance across both dense data tables and executive dashboards.

- **Primary (`#2563eb`):** Royal Blue (`--primary-600`), driving primary actions, active navigation items, and conversion funnels.
- **Primary Hover (`#1d4ed8`):** Deepened Royal Blue (`--primary-700`) for tactile interaction feedback.
- **On-Primary (`#ffffff`):** Pure white text for high contrast on primary buttons and badges.
- **Secondary (`#475569`):** Slate grey (`--text-secondary`) for supporting labels, secondary buttons, table headers, and subheadings.
- **Secondary Background (`#ffffff`):** Clean white backing for secondary controls.
- **Background (`#f8fafc`):** Subtle cool off-white (`--surface-bg`) canvas that minimizes eye fatigue during extended usage.
- **Surface (`#ffffff`):** Pure white container surfaces (`--surface-card`) providing crisp content separation.
- **Surface Muted (`#f1f5f9`):** Soft grey (`--surface-muted`) for data-table headers and inactive tab strips.
- **Text (`#0f172a`):** Deep navy ink (`--text-main`) providing strong typographic contrast.
- **Text Muted (`#64748b`):** Balanced mid-slate (`--text-muted`) for metadata, timestamps, and helper descriptions.
- **Success (`#065f46`) / Success BG (`#ecfdf5`):** Forest emerald accents for shortlisted candidates and verified statuses.
- **Warning (`#92400e`) / Warning BG (`#fffbeb`):** Amber tone for pending approvals and deadline reminders.
- **Danger (`#991b1b`) / Danger BG (`#fef2f2`):** Crimson for rejected applications and destructive actions.
- **Info (`#1e40af`) / Info BG (`#eff6ff`):** Navy blue tone for informational callouts and round schedules.

## Typography

The typography uses a native system font stack optimized for instantaneous rendering and cross-platform fidelity across macOS, Windows, and Linux.

- **Headings (`h1`, `h2`, `h3`):** Semibold and bold weights provide authoritative hierarchy for page headers, profile banners, and analytics charts.
- **Body (`body-md`, `body-sm`):** 14px regular body text for high readability within complex tables, candidate cards, and resume views.
- **Labels (`label-caps`):** 12px semibold for badges, statuses, and metric cards.

## Layout

CampusConnect utilizes a responsive 12-column fluid grid with maximum containment width:

- **Desktop Containment:** Max-width 1280px container centered with `1.5rem` (`24px`) responsive horizontal padding.
- **Navigation:** Persistent sidebar or top navigation bar fixed at 64px height with structured elevation.
- **Card Spacing:** 16px to 24px rhythm separating stat widgets, application tracking feeds, and alumni directory cards.
- **Grid Systems:** Standard `.grid-2`, `.grid-3`, and `.grid-4` layouts that collapse smoothly to 1 or 2 columns on tablet and mobile viewports.

## Elevation & Depth

Visual hierarchy is primarily communicated through subtle borders (`#e2e8f0`) and layered surface tones rather than heavy drop shadows:

- **Surface Level:** Canvas `#f8fafc` hosts elevated `#ffffff` cards.
- **Card Shadows:** Minimal ambient shadow (`0 1px 2px 0 rgb(0 0 0 / 0.05)`) with interactive elevation (`0 4px 6px -1px rgb(0 0 0 / 0.08)`) upon hover.
- **Modal Depth:** Centered dialog backdrop with subtle overlay blur and z-index containment.

## Shapes

The interface employs consistent rounded boundaries for a polished, approachable software experience:

- **Inputs & Buttons (`6px`):** Subtle rounding (`rounded.sm`) maintains an engineered, professional feel without being boxy.
- **Cards & Containers (`10px`):** Moderate corner radius (`rounded.md`) softens information containers and data widgets.
- **Status Badges & Avatars (`9999px`):** Full pill rounding (`rounded.full`) distinguishes status indicators and user profile chips.

## Components

CampusConnect components are designed for clarity and fast data scanning:

- **Buttons:**
  - `button-primary`: Royal Blue with high contrast white text.
  - `button-secondary`: Crisp white with slate border and text.
- **Cards:**
  - `card`: White surface with 10px rounded corners and 24px padding.
- **Status Badges:**
  - `badge-success`: Candidate placed / verified.
  - `badge-warning`: Application pending / under review.
  - `badge-danger`: Application rejected.
  - `badge-info`: Test / interview scheduled.
- **Data Tables:**
  - `table-header`: Soft grey muted background with slate uppercase column labels.

## Do's and Don'ts

### Do's
- Do use `primary` (`#2563eb`) exclusively for primary call-to-actions (e.g., "Apply for Drive", "Export Report", "Submit Review").
- Do maintain WCAG AA contrast (4.5:1 minimum) on all text and badge combinations.
- Do keep card internal padding consistent at 24px (`padding: 24px`).
- Do use semantic status badges (`badge-success`, `badge-warning`, `badge-danger`) consistently across student and recruiter portals.

### Don'ts
- Don't use saturated primary blue for full card backgrounds or table rows.
- Don't mix mismatched border radiuses (e.g., 20px corners with 4px buttons in the same container).
- Don't use light grey text on light grey backgrounds.
- Don't hardcode arbitrary colors outside the tokens defined in `DESIGN.md`.
