---
name: AI Agency Operating System Design System
theme: Dark Minimalist Enterprise AI
typography:
  display-lg:
    fontFamily: Geist, 'Plus Jakarta Sans', sans-serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist, 'Plus Jakarta Sans', sans-serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist, 'Plus Jakarta Sans', sans-serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist, 'Plus Jakarta Sans', sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter, sans-serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: 'JetBrains Mono', monospace
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
colors:
  background: '#080C14'
  surface: '#0B0F17'
  surface-raised: '#131B2A'
  surface-card: 'rgba(15, 23, 42, 0.75)'
  surface-variant: '#1E293B'
  surface-hover: '#2A374E'
  border-subtle: 'rgba(255, 255, 255, 0.08)'
  border-muted: '#1E293B'
  border-active: '#38BDF8'
  primary: '#006FC7'
  primary-glow: '#36A9F7'
  primary-container: '#064B84'
  secondary: '#6C3BFF'
  secondary-container: '#4B00D4'
  accent-teal: '#14D6A4'
  accent-gold: '#F59E0B'
  on-background: '#F1F5F9'
  on-surface: '#E2E8F0'
  on-surface-muted: '#94A3B8'
  ai-glow: '#7000FF'
  success: '#10B981'
  success-muted: 'rgba(16, 185, 129, 0.15)'
  warning: '#F59E0B'
  error: '#EF4444'
  error-alert: 'rgba(239, 68, 68, 0.15)'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
---

# AI Agency Operating System - Design System & UI Specs

## 1. Brand & Aesthetic Strategy
The **AI Agency Operating System** UI is engineered for high-velocity agencies, software studios, and enterprise consultancies. The visual language follows a **Dark Minimalist Enterprise AI** aesthetic inspired by *Linear, Notion, Vercel, and Stripe*.

### Key Design Pillars:
- **Precision Hierarchy**: Tight typographic lock-ups, mono metadata labels (`label-caps`), desaturated backgrounds (`#080C14`), and high contrast text (`#F1F5F9`).
- **Glassmorphism & Depth**: Multi-layered backdrop blurs (`backdrop-filter: blur(16px)`), subtle 1px translucent borders (`rgba(255, 255, 255, 0.08)`), and low-contrast elevation shadows.
- **AI-Native Feedback**: Ambient purple/electric-blue glows (`#7000FF` / `#36A9F7`), streaming pulse indicators, and instant micro-interactions.

---

## 2. Color Palette & Token Reference

| Token Name | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `background` | `#080C14` | Main page body canvas background |
| `surface` | `#0B0F17` | Sidebar, top header, and sticky container background |
| `surface-raised` | `#131B2A` | Elevated containers, dropdown menus, and command palettes |
| `surface-card` | `rgba(15, 23, 42, 0.75)` | Glassmorphic card containers |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Default container borders |
| `border-active` | `#38BDF8` | Focus ring and hover stroke state |
| `primary` | `#006FC7` | Primary action buttons and active navigation states |
| `primary-glow` | `#36A9F7` | Glowing accents and active indicators |
| `secondary` | `#6C3BFF` | AI generation buttons and assistant prompts |
| `accent-teal` | `#14D6A4` | Success status chips and positive revenue trends |
| `accent-gold` | `#F59E0B` | High priority badges and trial/pricing highlights |
| `error` | `#EF4444` | Danger actions, invalid fields, and system alerts |

---

## 3. Typography Hierarchy

- **Display Face**: `Geist` / `Plus Jakarta Sans` (Sharp, executive, engineered).
- **Body Workhorse**: `Inter` (Neutral, highly legible across all viewports).
- **Technical Metadata**: `JetBrains Mono` (Uppercase labels, currency metrics, API keys, JSON payloads).

---

## 4. Product Modules & Screen Inventory Mapping

Every module mapped to dedicated UI screen components and layout patterns:

1. **Landing**: High-converting marketing page with hero video, interactive 18-module feature grid, pricing tier cards ($29/$79/$199), and customer ROI calculator.
2. **Authentication**: Login, Signup, MFA verification, SSO (Google/GitHub/SAML), and Password Reset modals.
3. **Workspace Switcher**: Organization selector drawer with team seat count and plan indicators.
4. **Dashboard**: Executive KPI cards (MRR, active clients, generated proposals, hours saved), quick action shortcuts, active project progress bars, and real-time AI activity log.
5. **Clients**: 360° client CRM table, organization profiles, contact info, billing history, and document archive.
6. **Projects**: Kanban/List project views, sprint health, team avatar allocations, risk logs, and deliverable timelines.
7. **Proposal Generator**: Multi-step AI wizard (budget, timeline, stack, requirements) with live streaming synthesis.
8. **Proposal Preview**: Rich document reader with section navigation, client portal link generation, and PDF export.
9. **Proposal History**: Searchable archive of past proposals with win-rate analytics and status tags.
10. **Statement of Work (SOW)**: Legal SOW generator with scope breakdown, milestone payments, and acceptance criteria.
11. **Contract Generator**: Master Services Agreement (MSA) builder with custom IP clauses and e-signature links.
12. **Invoice Generator**: Line item invoice builder with tax calculation, status badges, and Stripe payment integration.
13. **Meeting Minutes**: Transcription to action item parser with owner assignments.
14. **Follow-up Email Generator**: AI client email drafter with tone controls (formal, persuasive, gentle reminder).
15. **Jira Story Generator**: Requirement-to-story converter with Gherkin acceptance criteria and story point estimates.
16. **Analytics**: Revenue charts, AI token usage metrics, proposal conversion funnels, and team capacity graphs.
17. **Billing**: Subscription tier management, payment card update, invoice receipts, and usage caps.
18. **Team Management**: Member list, role assignment (Owner, Admin, Manager, Dev, Client), and invitation links.
19. **Integrations**: OAuth connection hub for Stripe, Jira, Google Calendar, Slack, Resend, and AWS S3.
20. **AI Settings**: BYOK API key management (OpenAI, Anthropic Claude, Google Gemini), prompt templates, and guardrails.
21. **Organization Settings**: Agency name, logo, custom domain, white-label branding, and default currency.
22. **Admin Dashboard**: Multi-tenant tenant directory, global MRR analytics, feature flags, and system audit log.
23. **User Profile**: Personal avatar, bio, email preferences, security credentials, and GDPR data export.
24. **Error Pages**: Custom 404 Not Found, 403 Forbidden, 500 Internal Error, and Maintenance overlays.
