# 🚀 AI Agency Operating System (AgencyOS)

An enterprise-grade, full-stack **AI Operating System** designed for modern digital web, design, and software engineering agencies. Synthesize client proposals, generate compliant Statements of Work (SOWs) and contracts with e-signature links, manage itemized client billing with Stripe, track agile project milestones, sync Jira sprints, and manage client CRM directories—all in one unified, high-performance platform.

---

## ⚡ Tech Stack & Architecture

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design Tokens**: [Tailwind CSS](https://tailwindcss.com/) with a custom Glassmorphism dark design system
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Automated Testing Engine**: [TestSprite AI Testing Engine (MCP)](https://www.testsprite.com/) + [Playwright](https://playwright.dev/)
- **Accessibility Compliance**: WCAG 2.1 Level AA (`role="progressbar"`, ARIA attributes, keyboard navigation)

---

## 🌟 Core Modules & Features

### 1. 📊 Executive AI Dashboard (`/dashboard`)
- Real-time agency KPI metrics: Monthly Recurring Revenue (MRR), active client accounts, proposals delivered, win rates, and AI labor hours saved.
- Active agency project progress cards with WCAG-compliant progress bar indicators (`role="progressbar"`).
- Real-time AI system activity log and core module status grid.

### 2. 📝 AI Proposal Generator (`/proposals`)
- Input project parameters (Client Name, Budget, Timeline, Industry, Tech Stack, Scope).
- Reactive live document preview synthesis with markdown support.
- Built-in form validation error feedback when required details are missing (`Validation Error: Client Name is required`).
- Copy text and export functionality.

### 3. 📄 AI Legal SOW & Contract Generator (`/contracts`)
- Seamless generation of Statements of Work (SOW) and Master Service Agreements (MSA).
- Customizable IP ownership clauses and governing law options.
- Dynamic e-signature URL generation and readiness status badges.

### 4. 🧾 AI Invoice & Stripe Billing Builder (`/invoices`)
- Itemized invoice creation with dynamic `+ Add Item` line additions.
- Automated subtotal, 8% tax calculation, and grand total math.
- Input validation blocking invalid rates/quantities ($\le 0$).
- Invoice sent state management with persistent confirmation alert banners (`Invoice INV-2026-0042 Created and Sent`).

### 5. 👥 360° Client CRM Directory (`/clients`)
- Search clients by name, contact, or email with real-time case-insensitive filtering.
- Status dropdown filters (`All`, `Active Contract`, `Onboarding`).
- Interactive Client Detail Modal displaying linked project delivery metrics and account records.
- Clean empty search state handling (`No client records match your search`).

### 6. 💼 Agile Project Tracker (`/projects`)
- Milestone status cards with budget consumption indicators and deadline dates.
- Status filter toolbar buttons and `<select aria-label="Filter project status">` dropdown (`All`, `In Progress`, `In Review`, `Completed`, `Planning`).

### 7. 🎯 Jira Integration Dashboard (`/jira`)
- Sprint health metrics (42 Story Points) and ticket status distribution (To Do, In Progress, Done).
- Jira Epic progress breakdown bars (e.g., `Enterprise Auth & Profile: 75%`).
- Sprint status synchronization feedback (`Sprint status updates synchronized with Atlassian Cloud!`).

### 8. ⚙️ Agency Settings & BYOK AI Configuration (`/settings`)
- Agency profile branding and currency settings.
- BYOK (Bring Your Own Key) model configuration (Anthropic Claude, OpenAI, Google Gemini).
- Team Members & Role Access panel with dynamic role selection dropdowns (`Owner / Admin`, `Lead Architect`, `Senior Engineer`, `UX Designer`, `Viewer`).
- Notification preference checkboxes (Email Digest, Slack/Jira Webhooks, Executive Summaries).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Vinod-Nex/AI-Agency-Operating-System.git
   cd AI-Agency-Operating-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Launch**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Testing & Quality Assurance

This repository includes a standardized testing suite and PRDs verified using the **TestSprite MCP AI Testing Engine**:

- **Front-End Testing PRD**: [frontend_testing_prd.md](frontend_testing_prd.md)
- **Backend Testing PRD**: [backend_testing_prd.md](backend_testing_prd.md)
- **TestSprite Execution Report**: [testsprite_tests/testsprite-mcp-test-report.md](testsprite_tests/testsprite-mcp-test-report.md)

### Running TestSprite Suite
```bash
# Execute frontend test plan via TestSprite MCP server
node node_modules/@testsprite/testsprite-mcp/dist/index.js generateCodeAndExecute
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
