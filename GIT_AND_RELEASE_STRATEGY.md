# Master Git Strategy, 30-Milestone Plan, & Release Management
## AI Agency Operating System (AgencyOS)

---

# PART 1: Git Repository & Branching Strategy

```
  main (Production v1.0.0) ----------------------------------------------------*---> (Release Tag v1.0.0)
     ^                                                                        |
     | (PR Merge via Release Branch)                                           |
  release/v1.0.0 --------------------------------------------*                |
     ^                                                      |                |
     | (Feature Integration)                                v                |
  develop -------------------*-------------------*----------*----------------*---> (Dev Branch)
                             |                   |
                             v                   v
                     feature/proposals    feature/contracts
```

### 1.1 Branch Taxonomy
- **`main`**: Production-ready code only. Tagged with Semantic Versioning (`v1.0.0`). Direct pushes forbidden; changes merged strictly via Pull Requests with 2 approvals.
- **`develop`**: Integration branch for upcoming release features.
- **`feature/{feature-name}`**: Short-lived branches branched off `develop` for specific feature tasks (e.g. `feature/proposal-generator`).
- **`release/v{X.Y.Z}`**: Final hardening branch for pre-production testing and CHANGELOG compilation.
- **`hotfix/{issue-description}`**: Urgent production patches branched directly off `main` and back-merged into `develop`.
- **`ai/{experiment-name}`**: Experimental AI prompt engineering and RAG optimization branches.

---

# PARTS 2 & 3: Conventional Commit Specification & Template

### 2.1 Commit Message Structure
```
<type>(<scope>): <short summary in imperative mood>

[optional body explaining WHY the change was made, technical decisions, and trade-offs]

[optional footer(s) for breaking changes, issue references, and PR links]
```

### 2.2 Allowed Commit Types
- `feat`: A new feature for the user or platform.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Formatting, missing semi-colons, CSS design token tweaks without logic changes.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Code change that improves performance.
- `test`: Adding missing unit, integration, or Playwright tests.
- `build`: Changes affecting build system or dependencies (`package.json`, `pom.xml`).
- `ci`: Changes to CI/CD workflows (`.github/workflows`).
- `chore`: Maintenance tasks.
- `revert`: Reverting a previous commit.

### 2.3 Example Conventional Commit Message
```
feat(proposals): implement SSE real-time streaming for AI proposal deck generation

Integrate Vercel AI SDK and Anthropic Claude 3.5 Sonnet to stream generated proposal markdown chunks directly to the UI preview panel over Server-Sent Events (SSE). Includes prompt prefix caching and prompt injection defense.

Closes #104
PR: #142
BREAKING CHANGE: The legacy non-streaming endpoint POST /api/v1/proposals/generate-sync is deprecated.
```

---

# PART 4: The 30 Development Milestones & Release Roadmap

Below is the complete, 30-phase production development milestone plan:

| Phase | Milestone Name | Branch Name | Conventional Commit Message | Tag Name | Release Notes Summary | Target Env | Rollback Point |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Project Initialization | `feature/init-repo` | `build(repo): initialize Next.js 15, Tailwind CSS, & Spring Boot 3.3 project structure` | `v0.1.0` | Initial monorepo configuration | Dev | `HEAD~1` |
| **Phase 2** | Architecture Specs | `docs/architecture-specs` | `docs(arch): add ARCHITECTURE.md, TECH_STACK.md, & DESIGN.md specifications` | `v0.2.0` | 30-section architecture docs | Dev | `v0.1.0` |
| **Phase 3** | Frontend Foundation | `feature/ui-foundation` | `feat(ui): configure shadcn/ui components, global design tokens, & dark mode theme` | `v0.3.0` | Glassmorphic UI foundation | Staging | `v0.2.0` |
| **Phase 4** | Backend Foundation | `feature/backend-core` | `feat(backend): configure Spring Boot 3.3, Fastify, & PgBouncer database pool` | `v0.4.0` | Core backend setup | Staging | `v0.3.0` |
| **Phase 5** | Authentication Engine | `feature/auth-engine` | `feat(auth): implement JWT authentication, MFA TOTP, & OAuth2 social sign-in` | `v0.5.0` | Authentication & security | Staging | `v0.4.0` |
| **Phase 6** | Multi-Tenant Orgs | `feature/tenant-orgs` | `feat(tenant): implement multi-tenant organizations & PostgreSQL Row-Level Security` | `v0.6.0` | Multi-tenant isolation | Staging | `v0.5.0` |
| **Phase 7** | Workspaces Management | `feature/workspaces` | `feat(workspace): add organization workspace switcher & sub-workspace scope` | `v0.7.0` | Workspace context switcher | Staging | `v0.6.0` |
| **Phase 8** | Executive Dashboard | `feature/dashboard-ui` | `feat(dashboard): build executive metrics KPI cards & real-time AI activity feed` | `v0.8.0` | Executive dashboard UI | Staging | `v0.7.0` |
| **Phase 9** | 360° Client CRM | `feature/client-crm` | `feat(client): implement 360 client CRM directory, contact profiles, & search` | `v0.9.0` | Client CRM management | Staging | `v0.8.0` |
| **Phase 10** | Agile Project Kanban | `feature/agile-projects` | `feat(project): implement project sprint kanban boards, milestones, & progress bars` | `v0.10.0` | Agile project management | Staging | `v0.9.0` |
| **Phase 11** | AI Proposal Generator | `feature/proposal-generator` | `feat(ai-proposal): add AI proposal generator with Claude 3.5 Sonnet SSE streaming` | `v0.11.0` | AI RFP Proposal Generator | Staging | `v0.10.0` |
| **Phase 12** | Proposal Preview & PDF | `feature/proposal-preview` | `feat(proposal): add markdown proposal preview panel & Puppeteer PDF export` | `v0.12.0` | Proposal preview & PDF | Staging | `v0.11.0` |
| **Phase 13** | Proposal History | `feature/proposal-history` | `feat(proposal): add proposal history datatable, win rate metrics, & status filters` | `v0.13.0` | Proposal history & win rates | Staging | `v0.12.0` |
| **Phase 14** | Statement of Work | `feature/sow-builder` | `feat(sow): add SOW generator converting proposals to milestone payment phases` | `v0.14.0` | Statement of Work builder | Staging | `v0.13.0` |
| **Phase 15** | Contract Generator | `feature/contract-builder` | `feat(contract): implement MSA legal contract generator & e-signature links` | `v0.15.0` | Legal MSA & E-Signatures | Staging | `v0.14.0` |
| **Phase 16** | Invoice & Stripe Sync | `feature/invoice-builder` | `feat(invoice): add milestone invoice generator & Stripe Billing Checkout integration` | `v0.16.0` | Invoice & Stripe Checkout | Staging | `v0.15.0` |
| **Phase 17** | Meeting Minutes Parser | `feature/meeting-parser` | `feat(meeting): add AI meeting transcript parser using Gemini 1.5 Pro` | `v0.17.0` | Meeting minutes parser | Staging | `v0.16.0` |
| **Phase 18** | Follow-up Email Generator | `feature/email-generator` | `feat(email): implement follow-up email generator with tone controls & Resend API` | `v0.18.0` | Email generator & Resend | Staging | `v0.17.0` |
| **Phase 19** | Jira Story Generator | `feature/jira-backlog` | `feat(jira): add AI Jira backlog generator with Gherkin scenarios & story points` | `v0.19.0` | Jira Backlog Engine | Staging | `v0.18.0` |
| **Phase 20** | Business Analytics | `feature/analytics-dash` | `feat(analytics): add Recharts business intelligence dashboards for MRR & AI cost` | `v0.20.0` | Analytics dashboards | Staging | `v0.19.0` |
| **Phase 21** | Subscription Billing | `feature/billing-plans` | `feat(billing): implement subscription tier billing, usage progress, & webhooks` | `v0.21.0` | Stripe Subscriptions | Staging | `v0.20.0` |
| **Phase 22** | Team Management | `feature/team-management` | `feat(team): add team invitations, seat limits, & RBAC role assignment dropdowns` | `v0.22.0` | Team seat & role manager | Staging | `v0.21.0` |
| **Phase 23** | Integrations Hub | `feature/integrations-hub` | `feat(integrations): add OAuth integration manager for Slack, Jira, S3, & Google` | `v0.23.0` | Integrations Ecosystem | Staging | `v0.22.0` |
| **Phase 24** | AI Settings & BYOK | `feature/ai-settings` | `feat(ai-settings): implement BYOK key manager & prompt template customization` | `v0.24.0` | BYOK Key Management | Staging | `v0.23.0` |
| **Phase 25** | User Profile & GDPR | `feature/user-profile` | `feat(profile): add avatar upload, password changes, & GDPR data export ZIP` | `v0.25.0` | User Profile & GDPR | Staging | `v0.24.0` |
| **Phase 26** | Organization Settings | `feature/org-settings` | `feat(org-settings): add white-label agency branding, custom domains, & logo upload` | `v0.26.0` | Organization Branding | Staging | `v0.25.0` |
| **Phase 27** | Admin Dashboard | `feature/admin-panel` | `feat(admin): implement Super Admin platform panel, tenant status, & feature flags` | `v0.27.0` | Super Admin Platform Panel | Staging | `v0.26.0` |
| **Phase 28** | Test Suite Coverage | `feature/test-suite` | `test(qa): add Playwright E2E smoke tests, REST Assured API tests, & Jest suites` | `v0.28.0` | Comprehensive Test Suite | Staging | `v0.27.0` |
| **Phase 29** | Production Infrastructure| `feature/infrastructure-iac`| `ci(infra): add Terraform EKS blueprints, Helm deployment charts, & Trivy scans` | `v0.29.0` | Terraform & Kubernetes IaC | Pre-Prod | `v0.28.0` |
| **Phase 30** | Production Launch | `release/v1.0.0` | `chore(release): release production v1.0.0 GA platform build` | `v1.0.0` | Production Launch GA | **Prod** | `v0.29.0` |

---

# PARTS 5 & 6: Branch Naming & Annotated Tag Conventions

- **Branch Naming Standard**: `category/short-description` (e.g. `feature/proposal-generator`, `hotfix/stripe-webhook-signature`, `release/v1.0.0`).
- **Annotated Tag Execution**:
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Enterprise Production GA Release for AI Agency Operating System"
git push origin v1.0.0
```

---

# PART 7: Pull Request Checklist Strategy

All Pull Requests MUST satisfy the following checklist before merge approval:
- [ ] **Code Review**: Approved by at least 2 Senior Software Engineers.
- [ ] **Automated CI**: GitHub Actions build, linting, unit tests, and Playwright E2E tests pass.
- [ ] **Security**: Trivy container scan reports 0 Critical/High CVEs; OWASP ZAP scan clean.
- [ ] **Database**: Flyway migration scripts reviewed for zero-downtime compatibility.
- [ ] **Documentation**: OpenAPI 3.1 schema and user documentation updated.

---

# PARTS 8 - 10: Release Management & Semantic Versioning (SemVer)

### 8.1 Semantic Versioning (SemVer `MAJOR.MINOR.PATCH`)
- **MAJOR (v1.0.0 -> v2.0.0)**: Incompatible API changes or breaking architectural shifts.
- **MINOR (v1.0.0 -> v1.1.0)**: New backwards-compatible features (e.g., adding a new AI generator module).
- **PATCH (v1.0.1 -> v1.0.2)**: Backwards-compatible bug fixes or security patches.

---

# PARTS 11 - 13: Rollback Plan, Release Docs, & DORA Engineering Metrics

### 11.1 Immediate Rollback Procedure
If a critical production error occurs post-deployment:
1. Revert Traffic via Kubernetes Service routing to previous deployment release tag (`v0.29.0`).
2. Run database rollback script (`flyway undo` or forward-compatible migration patch).
3. Post-mortem root cause analysis logged in `audit_logs` table within 24 hours.

### 13.1 Key DORA Engineering Metrics Targets

| Metric Name | Enterprise Target | Tracking Mechanism |
| :--- | :--- | :--- |
| **Deployment Frequency (DF)** | Multiple deployments per day | GitHub Actions release telemetry |
| **Lead Time for Changes (LTC)** | < 2 Hours from PR merge to Prod | GitHub PR merge timestamp to deployment tag |
| **Change Failure Rate (CFR)** | < 1.0% of production releases | Incident tracking & hotfix PR counts |
| **Mean Time to Recovery (MTTR)**| < 15 Minutes to restore service | Datadog PagerDuty incident resolution logs |
| **Code Coverage** | > 85% line coverage | SonarQube / Jest test coverage reports |
