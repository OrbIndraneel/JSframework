# CampusConnect --- Product & Interface Design

> A practical placement workspace for a college community. Built around
> the work students, recruiters, placement teams, and alumni actually
> need to do.

## 1. Product intent

CampusConnect brings placement activity into one dependable place:
opportunities, applications, recruitment drives, outcomes, and alumni
guidance.

The interface should feel like a well-run university service---not a
generic startup landing page and not an AI-generated admin template.
Prioritize clarity, useful information density, predictable navigation,
and credible data presentation.

### Design principles

-   **Utility before spectacle.** Make the next action obvious; keep
    decoration secondary.
-   **Specific, not generic.** Use language from campus recruitment:
    eligibility, drive, application status, shortlist, interview, offer,
    mentorship.
-   **Show real state.** Counts, charts, and status labels must come
    from the API. Never invent activity to make a screen look busy.
-   **Respect each role.** Students need opportunities and next steps;
    recruiters need candidate workflows; placement officers need
    oversight; alumni need meaningful ways to contribute.
-   **Progressive disclosure.** Put common actions up front and detailed
    criteria in drawers, dialogs, or detail pages.
-   **Accessible by default.** Keyboard access, visible focus, adequate
    contrast, clear errors, and labels that do not rely on color alone.

## 2. Product personality

CampusConnect should feel:

-   **Trustworthy:** restrained color, consistent status language,
    transparent eligibility rules.
-   **Approachable:** plain English, helpful empty states, no
    institutional jargon where it adds no value.
-   **Organized:** clear hierarchy, stable layouts, aligned tables,
    predictable filters.
-   **Career-focused:** opportunities and progress take priority over
    decorative metrics.

Avoid: - Glowing gradients, glassmorphism, giant rounded cards
everywhere, and excessive pill-shaped controls. - Stock-photo hero
sections that say little about the product. - Repeated "AI-powered"
labels, robot illustrations, fake testimonials, and unsupported
claims. - Emoji used as interface icons. - Dashboard charts with no
clear question, fabricated percentages, or decorative metrics. - Long
marketing copy inside authenticated workflows.

## 3. Visual system

### Color tokens

Use a calm, campus-oriented palette. Blue is the primary interaction
color; green, amber, and red communicate state only.

  -------------------------------------------------------------------------
  Token                     Value                   Use
  ------------------------- ----------------------- -----------------------
  `--color-primary`         `#2457C5`               Primary actions, links,
                                                    active navigation

  `--color-primary-hover`   `#1D46A3`               Hover and pressed
                                                    states

  `--color-primary-soft`    `#EAF0FF`               Selected navigation and
                                                    subtle emphasis

  `--color-ink`             `#172033`               Main text and headings

  `--color-muted`           `#647084`               Supporting text and
                                                    metadata

  `--color-border`          `#DCE2EA`               Dividers, input
                                                    borders, table lines

  `--color-canvas`          `#F6F8FB`               Application background

  `--color-surface`         `#FFFFFF`               Cards, panels, menus

  `--color-success`         `#18794E`               Selected, verified,
                                                    completed

  `--color-success-soft`    `#E8F5EE`               Success status
                                                    backgrounds

  `--color-warning`         `#946200`               Pending action,
                                                    deadline warnings

  `--color-warning-soft`    `#FFF4D6`               Warning status
                                                    backgrounds

  `--color-danger`          `#B42318`               Rejected, failed,
                                                    destructive actions

  `--color-danger-soft`     `#FDECEA`               Error status
                                                    backgrounds
  -------------------------------------------------------------------------

Do not use color alone to communicate status. Pair it with a text label
and, where useful, an icon.

### Typography

Use a neutral, highly readable sans-serif. Prefer `Inter` if already
available; otherwise use the system stack:

``` css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Type scale: - Page title: 28--32px, weight 650--700. - Section heading:
18--22px, weight 600. - Card or table heading: 14--16px, weight 600. -
Body: 14--16px, weight 400. - Labels and metadata: 12--13px, weight
500. - Numbers in KPI summaries: 26--32px, weight 650; use tabular
numerals.

Keep line lengths comfortable. Do not make every label bold or every
heading oversized.

### Spacing and shape

Use a 4px base spacing scale: `4, 8, 12, 16, 24, 32, 40, 48`.

-   Standard panel padding: 20--24px desktop, 16px mobile.
-   Form field gap: 16px.
-   Section gap: 24--32px.
-   Input and button height: 40--44px.
-   Card radius: 10--12px.
-   Input radius: 8px.
-   Use thin borders and subtle shadows only when elevation helps
    distinguish layers.

Prefer a clear page grid and consistent alignment over many separate
floating cards.

## 4. Layout and navigation

### Authenticated application shell

Desktop: - Fixed-width left sidebar around 240px. - Top bar with page
context, global search where relevant, notifications, and user menu. -
Main content area with a comfortable maximum width and consistent page
padding. - Sidebar navigation grouped by task, not by implementation
module.

Mobile: - Compact top bar and a drawer or bottom navigation for the most
common destinations. - Tables become horizontally scrollable or switch
to structured list cards. - Filters open in a sheet or dialog. - Primary
actions remain visible without covering content.

### Role-based navigation

**Student** - Overview - Find opportunities - My applications - Career
recommendations - Resume & profile - Mentorship - Notifications

**Recruiter** - Overview - My job postings - Applicants - Interviews -
Company profile

**Placement officer** - Overview - Students - Recruiters & companies -
Jobs and placement drives - Applications & outcomes - Reports - Audit
log - Settings

**Alumni** - Overview - Alumni directory - Mentorship requests -
Events - My profile

Only show navigation items the current role can access. A hidden menu
item is not a security boundary; enforce the same permissions in the
API.

## 5. Page design requirements

### Public landing page

The landing page should explain the service quickly and direct each
audience to the correct next step.

Recommended order: 1. Compact header with product mark, "Explore
opportunities," "For recruiters," and sign-in. 2. A concise headline
about connecting campus talent with opportunities. 3. Two clear calls to
action: "Find opportunities" and "Recruit talent." 4. A small workflow
section explaining how students, recruiters, and placement teams use the
platform. 5. A current-opportunities preview populated from the API. 6.
A placement-office / alumni section describing coordination and
mentorship. 7. Footer with contact, help, and privacy links.

Do not show placement rates or company logos unless the underlying data
is real and approved for public display. If no jobs are available, show
a useful empty state rather than sample records disguised as live
openings.

### Student overview

The first screen should answer: - What should I do next? - What
applications need attention? - Which relevant opportunities are open? -
Is my profile ready to apply?

Suggested structure: - Greeting and one primary action: "Browse
opportunities." - Profile completion only if it is calculated from
actual required fields. - "Applications at a glance" with counts by
status. - A short list of recent application updates. - Recommended jobs
with a brief reason for each match. - Upcoming interviews or deadlines,
when present.

Do not fill the page with generic KPI cards. Keep the highest-value next
action visually dominant.

### Opportunity listing

Include: - Search by title, company, skill, or keyword. - Filters for
job type, location, department, deadline, and eligibility. - Sort by
newest and deadline. - Result count and pagination. - Job rows/cards
showing title, company, location or work mode, type, deadline, and
eligibility summary. - Clear saved/applied states where those features
exist.

Filters should persist while navigating between result pages. Empty
results should offer "Clear filters" and explain what was searched.

### Opportunity detail and application

Present the role description, responsibilities, required skills,
preferred skills, eligibility, compensation where supplied, location,
deadline, and recruiter/company details.

Keep the application action close to the role summary. Before
submission, show which resume will be shared and any eligibility
constraints. Prevent duplicate submissions on the server, not only in
the UI.

After submission, show a confirmation page or clear success message with
a link to the application record.

### Application tracking

Use explicit status labels: - Applied - Under review - Shortlisted -
Interview scheduled - Selected - Rejected - Withdrawn

Use a timeline on the application detail page when status history is
available. Do not imply that a status changed at a particular time
unless the system recorded that event.

### Recruiter dashboard

Prioritize operational work: - Active job postings and their
deadlines. - New applicants needing review. - Upcoming interviews. -
Recently updated recruitment activity.

The applicant table should support search, job filter, status filter,
sorting, pagination, and a clear path to candidate details. Candidate
data must be restricted to jobs owned by the recruiter or company.

### Placement officer dashboard

Prioritize coordination and oversight: - Current placement drives and
approaching deadlines. - Open roles and application volume. -
Applications by stage. - Placement outcomes by department or cohort. -
Recent administrative activity.

Every chart needs a title that explains what is being measured, a date
range, readable axes or labels, and an empty state. State the
denominator used for any placement-rate calculation. Do not compare
cohorts without making the time period clear.

### Alumni and mentorship

Make the directory useful without exposing unnecessary personal
information. Search by graduation year, department, industry, role, and
mentorship availability where those fields are public.

A mentorship request should show the mentor's expertise, the student's
request message, and a clear status. Do not reveal private email
addresses or phone numbers by default.

### AI recommendations

Treat recommendations as decision support, not as a verdict.

Each recommendation should display: - A match score with a short
explanation of how it was calculated. - Skills that match. - Skills or
criteria that are missing. - Eligibility status separately from skill
similarity. - A practical next step.

Use neutral language such as "Strong skill overlap" or "Missing one
listed skill," not "perfect candidate" or "guaranteed fit." Never use
protected characteristics or irrelevant personal attributes in ranking.
Do not automatically reject students based on a model score.

### Forms, dialogs, and tables

Forms: - Group fields into meaningful sections. - Mark required fields
and explain constraints before submission. - Preserve valid user input
when a request fails. - Place validation errors beside the relevant
field. - Disable duplicate submissions while a request is in progress.

Dialogs: - Use for short, focused actions only. - Use a full page for
complex editing or multi-step workflows. - Confirm destructive actions
and describe the consequence.

Tables: - Use clear column names and consistent alignment. - Right-align
numeric values. - Keep row actions predictable. - Provide pagination and
useful empty states. - Avoid putting every possible field into one
oversized table.

## 6. Component inventory

Build reusable components only where they provide consistent behavior:

-   `AppShell`, `Sidebar`, `Topbar`, `MobileNavigation`
-   `PageHeader`, `Breadcrumbs`
-   `Button`, `IconButton`, `TextField`, `SelectField`, `TextArea`,
    `FileUpload`
-   `StatusBadge`, `Alert`, `Toast`, `ConfirmDialog`
-   `DataTable`, `Pagination`, `FilterBar`, `SearchInput`
-   `MetricSummary`, `ChartPanel`, `EmptyState`, `LoadingSkeleton`
-   `JobCard`, `JobSummary`, `ApplicationTimeline`
-   `ProfileCompletion`, `MatchExplanation`, `MentorshipRequestCard`

Use a consistent icon library such as Lucide. Icons must have accessible
labels when they are the only content in a control. Avoid creating a new
component for every small wrapper.

## 7. Interaction states

Every data-driven component must handle the following states where
relevant:

1.  Initial loading.
2.  Loaded with results.
3.  Loaded with no results.
4.  Search or filter returned no matches.
5.  Validation error.
6.  Permission denied.
7.  Network or server failure.
8.  Successful mutation.
9.  Expired session.

Use skeletons for larger content regions and inline progress for local
actions. Do not replace the whole page with a spinner for every request.
Error messages should explain what happened and what the user can do
next, without exposing stack traces or internal service details.

## 8. Responsive behavior

Support: - Small mobile: 320--374px. - Standard mobile: 375--767px. -
Tablet: 768--1023px. - Desktop: 1024px and wider.

At small widths: - Stack form columns. - Keep page actions reachable. -
Avoid clipping dialogs and dropdowns. - Convert dense tables into
scrollable tables or meaningful row cards. - Preserve labels and
context; do not solve overflow by hiding critical information.

## 9. Accessibility and content

Target WCAG 2.2 AA practices where feasible.

-   Maintain sufficient text and control contrast.
-   Show a visible keyboard focus state.
-   Associate every form field with a label.
-   Announce asynchronous form errors and success messages accessibly.
-   Support keyboard operation for menus, dialogs, and navigation.
-   Respect reduced-motion preferences.
-   Use semantic headings and landmarks.
-   Do not communicate status by color alone.

Use concise, direct interface copy. Examples: - "No applications yet"
--- "When you apply for a role, its status will appear here." - "Profile
incomplete" --- "Add your skills and education to improve job
recommendations." - "No matching roles" --- "Try removing a filter or
searching for a broader term." - "Resume uploaded" --- "Your resume is
saved. Review your profile before applying."

Avoid vague copy such as "Oops, something went wrong!" when a more
useful explanation is available.

## 10. Data integrity and trust

The interface must reflect server truth.

-   Do not hardcode live dashboard totals.
-   Do not show fake company logos, testimonials, job postings, or
    placement statistics as real.
-   Clearly identify seeded development data.
-   Display timestamps in a consistent local format.
-   Show currency in INR when compensation is supplied in INR.
-   Distinguish "not provided" from zero.
-   Do not imply that a recruiter has viewed an application unless that
    event is tracked.
-   Use server-side authorization for every protected record.
-   Keep private student and alumni information hidden unless access is
    permitted.

## 11. Frontend implementation guidance

Use React with Vite and TypeScript. Use React Router for routes, Redux
Toolkit for shared state, and Axios through a centralized API client.
Use CSS variables for design tokens and CSS Modules or organized regular
CSS for component styling.

Suggested organization:

``` text
src/
  app/
  components/
  layouts/
  features/
    auth/
    opportunities/
    applications/
    students/
    recruiters/
    placement/
    alumni/
    mentorship/
    recommendations/
  pages/
  routes/
  services/
  styles/
  types/
  utils/
```

Keep API access out of presentational components. Separate loading and
error state from business logic. Avoid giant components, duplicated
style values, fake API fallbacks, and unnecessary global state.

## 12. Acceptance criteria

The design is successful when:

-   Each role can identify its main task within a few seconds.
-   The interface uses the same status labels and interaction patterns
    throughout.
-   All metrics and records come from real API responses or are clearly
    labeled development fixtures.
-   The student workflow from browsing a job to tracking an application
    is clear.
-   Recruiters can review applicants without seeing unauthorized
    records.
-   Placement officers can understand the current recruitment picture
    without interpreting decorative charts.
-   AI recommendations explain their reasoning and distinguish skill
    similarity from eligibility.
-   Empty, loading, error, and success states are designed---not left to
    browser defaults.
-   The interface remains usable on mobile and with a keyboard.
-   The product feels like one coherent campus service rather than a
    collection of unrelated dashboards.

## Final direction

Build CampusConnect as a calm, precise, career-focused workspace. The
interface should earn trust through clear information, accurate status,
and reliable workflows. Prefer one well-designed table that helps
someone complete a real task over a screen full of decorative cards.
Every visual choice should support the placement process or be removed.
