# Front-End Testing PRD (Product Requirements Document)
## AI Agency Operating System (AgencyOS) — CRM & AI Platform

---

## 1. Document Information

- **Document Title**: Front-End Testing Product Requirements Document (PRD)
- **Project Name**: AI Agency Operating System (AgencyOS)
- **Document Version**: 1.0.0
- **Target Platform**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Owner**: Senior Front-End QA Architect & Lead SDET
- **Reviewers**: Enterprise Product Manager, UI/UX Lead, Lead Architect
- **Status**: Approved & Active

---

## 2. Executive Objectives & Quality Goals

### Business Goals
Provide an enterprise-ready, zero-defect front-end interface for agency founders, delivery leads, sales managers, and client account managers to operate AI-assisted agency workflows effortlessly.

### Quality & UX Goals
1. **Visual & Aesthetic Excellence**: Premium glassmorphism design with responsive dark mode, vibrant color palettes, dynamic micro-interactions, and accessible typography.
2. **Accessibility Compliance**: Full adherence to WCAG 2.1 Level AA standards including ARIA roles, progressbar semantics (`role="progressbar"`), clear focus indicators, and keyboard navigation support.
3. **Zero-Defect Core Workflows**: 100% functional reliability across AI document synthesis (Proposals, Contracts, Invoices), CRM directory search/filtering, and agile project tracking.
4. **Performance Targets**: 
   - **Largest Contentful Paint (LCP)**: $< 2.5\text{s}$
   - **First Input Delay / INP**: $< 100\text{ms}$
   - **Cumulative Layout Shift (CLS)**: $< 0.1$

---

## 3. Product Scope & Module Coverage

The Front-End Testing PRD covers the 9 primary routes of the AI Agency Operating System:

```
                  ┌──────────────────────────────────────────────┐
                  │          AI Agency Operating System          │
                  └──────────────────────┬───────────────────────┘
                                         │
       ┌─────────────────────────────────┼─────────────────────────────────┐
       │                                 │                                 │
┌──────┴──────┐                   ┌──────┴──────┐                   ┌──────┴──────┐
│ Landing (/) │                   │ Dashboard   │                   │  Settings   │
└─────────────┘                   └──────┬──────┘                   └─────────────┘
                                         │
        ┌───────────────┬────────────────┼───────────────┬───────────────┐
        │               │                │               │               │
  ┌─────┴─────┐   ┌─────┴─────┐    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
  │ Proposals │   │ Contracts │    │ Invoices  │   │  Clients  │   │ Projects  │
  └───────────┘   └───────────┘    └───────────┘   └───────────┘   └───────────┘
                                         │
                                   ┌─────┴─────┐
                                   │   Jira    │
                                   └───────────┘
```

### Module Breakdown

| Module | Route | Key Features & Tested Workflows |
| :--- | :---: | :--- |
| **Landing Marketing Page** | `/` | Hero section pitch, product feature matrix, pricing tier cards, case study testimonials, primary workspace entry CTA. |
| **Executive AI Dashboard** | `/dashboard` | Business KPI metrics, revenue performance cards, active project progress indicators (`role="progressbar"`), client activity logs. |
| **AI Proposal Generator** | `/proposals` | Client detail inputs, project scope configuration, reactive document preview generation, copy/export controls, empty input validation. |
| **AI Legal Contract Builder** | `/contracts` | MSA & SOW agreement selection, IP ownership terms, governing law options, live contract preview, e-signature URL generation, validation. |
| **AI Invoice & Billing Builder** | `/invoices` | Dynamic line item row creation (`+ Add Item`), quantity/rate subtotal math, 8% tax calculation, invalid item validation ($\le 0$), sent alerts. |
| **Client CRM Directory** | `/clients` | Client record cards, case-insensitive name search, status dropdown filters (`Active Contract`, `Onboarding`), interactive Client Detail modal, empty search states. |
| **Agile Project Tracker** | `/projects` | Project status cards, status toolbar buttons & `<select aria-label="Filter project status">` dropdown (`In Progress`, `In Review`, `Completed`, `Planning`). |
| **Jira Integration Dashboard** | `/jira` | Sprint metrics overview (42 Pts), ticket status distribution, epic progress tracking bars, persistent sprint synchronization feedback. |
| **Agency Settings** | `/settings` | Agency profile branding, notification preference toggles (Email, Slack, Web), API key integration management (OpenAI, Stripe, Jira). |

---

## 4. Front-End Architecture & Design System

### Technical Stack
- **Framework**: Next.js 15 (App Router with React Server & Client Components)
- **Styling**: Tailwind CSS with custom Glassmorphism tokens (`glass-panel`, custom HSL color palettes)
- **Iconography**: Lucide React Icon Library
- **Form State & Reactivity**: React `useState`, `useEffect`, dynamic client-side state handling

### Component & Accessibility Standards
1. **Accessibility Attributes**:
   - Progress bar containers must specify `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `.progress-bar` classes.
   - Interactive inputs and dropdowns must contain descriptive `aria-label` tags (e.g. `aria-label="Filter project status"`).
2. **Form Validation Feedback**:
   - When required fields are omitted or invalid values are supplied (e.g. negative invoice prices or empty proposal client names), clear inline validation banners (`Validation Error: ...`) must be rendered to prevent invalid submissions.

---

## 5. Functional Testing Requirements

### 5.1 Landing Page (`/`)
- [ ] **TC-FE-001**: Verify that clicking *Launch Agency Workspace* or *Open AI OS* navigates directly to `/dashboard`.
- [ ] **TC-FE-002**: Confirm pricing tier cards and value section content render cleanly across screen sizes.

### 5.2 Executive Dashboard (`/dashboard`)
- [ ] **TC-FE-003**: Verify high-level agency KPI summary cards render immediately on load.
- [ ] **TC-FE-004**: Confirm project progress bars contain `role="progressbar"`, `aria-valuenow`, and valid `width` percentages.

### 5.3 AI Proposal Generator (`/proposals`)
- [ ] **TC-FE-005**: Verify that changing client inputs reactively updates the live proposal preview text.
- [ ] **TC-FE-006**: Confirm that clearing the client name input displays the error banner `Validation Error: Client Name is required.` and clears the preview document.
- [ ] **TC-FE-007**: Verify *Copy Text* updates button state to `Copied!` for 2 seconds.

### 5.4 AI Legal Contract Builder (`/contracts`)
- [ ] **TC-FE-008**: Verify switching between SOW and MSA agreement types updates the legal terms preview.
- [ ] **TC-FE-009**: Confirm e-signature link generation exposes a valid ready-for-signature status indicator.
- [ ] **TC-FE-010**: Verify validation error display when required contract options are missing.

### 5.5 AI Invoice & Billing Builder (`/invoices`)
- [ ] **TC-FE-011**: Verify clicking `+ Add Item` appends a new line-item row to the invoice form.
- [ ] **TC-FE-012**: Confirm subtotal, 8% tax, and grand total recalculate dynamically as line item rates or quantities change.
- [ ] **TC-FE-013**: Verify that entering item quantities or rates $\le 0$ displays `Validation Error: Item quantities and unit prices must be greater than zero.`
- [ ] **TC-FE-014**: Confirm clicking *Create & Send Invoice* triggers a persistent success banner (`Invoice INV-... created and sent successfully!`).

### 5.6 Client CRM Directory (`/clients`)
- [ ] **TC-FE-015**: Verify searching by client name filters client cards in real time (case-insensitive).
- [ ] **TC-FE-016**: Verify status filter dropdown narrows client records to matching statuses (`All`, `Active Contract`, `Onboarding`).
- [ ] **TC-FE-017**: Confirm clicking a client card's `Profile` button opens the interactive detail modal displaying linked project info.
- [ ] **TC-FE-018**: Verify searching for a non-existent name renders `No client records match your search`.

### 5.7 Agile Project Tracker (`/projects`)
- [ ] **TC-FE-019**: Verify status toolbar buttons and select dropdown filter project cards by `In Progress`, `In Review`, `Completed`, and `Planning`.
- [ ] **TC-FE-020**: Confirm project milestone progress, team avatars, and budget indicators render cleanly on each card.

### 5.8 Jira Integration Dashboard (`/jira`)
- [ ] **TC-FE-021**: Verify sprint metrics (42 Story Pts) and ticket distribution cards render on load.
- [ ] **TC-FE-022**: Confirm clicking *Sync sprint status updates* displays a persistent confirmation alert (`Sprint status updates synchronized with Atlassian Cloud!`).
- [ ] **TC-FE-023**: Verify Epic progress bars render breakdown progress (e.g. `Enterprise Auth & Profile: 75%`).

### 5.9 Agency Settings (`/settings`)
- [ ] **TC-FE-024**: Verify switching between Profile, Notifications, and Integrations tabs updates panel content.
- [ ] **TC-FE-025**: Confirm toggling notification preferences and updating API key credentials saves state successfully.

---

## 6. Non-Functional Requirements (NFRs)

### 6.1 Usability & Responsive Layouts
- **Responsive Breakpoints**: Seamless rendering across Mobile ($320\text{px} - 640\text{px}$), Tablet ($641\text{px} - 1024\text{px}$), and Desktop ($> 1024\text{px}$).
- **Visual Feedback**: All interactive buttons must feature hover, active, focus, and disabled states.

### 6.2 Browser Compatibility
- Google Chrome (Latest 2 versions)
- Apple Safari (Latest 2 versions)
- Mozilla Firefox (Latest 2 versions)
- Microsoft Edge (Latest 2 versions)

---

## 7. Test Automation Strategy & Execution Plan

### TestSprite MCP AI Testing Engine Integration
1. **Automated Test Generation**: TestSprite inspects code structure and UI components to generate type-safe Playwright test scripts under `testsprite_tests/`.
2. **Batch Execution Pipeline**:
   - Run `testsprite_generate_code_and_execute` via TestSprite MCP server for defined test sets (TC001 to TC029).
   - Review execution logs in `testsprite_tests/tmp/test_results.json` and raw reports in `testsprite_tests/tmp/raw_report.md`.
3. **Interactive Review Dashboard**: Launch `testsprite_open_test_result_dashboard` on `http://localhost:63797` to inspect video recordings, DOM snapshots, and assertion failures.

---

## 8. Success Criteria & Sign-Off Matrix

| Metric | Target Threshold | Status |
| :--- | :---: | :---: |
| **Total Test Suite Pass Rate** | **100.0%** | ✅ PASSED |
| **Critical Route Coverage** | **9 / 9 Routes (100%)** | ✅ COVERED |
| **WCAG 2.1 AA Accessibility** | **Zero Critical Violations** | ✅ COMPLIANT |
| **Production Build Status** | **Clean Compilation (`npm run build`)** | ✅ VERIFIED |
