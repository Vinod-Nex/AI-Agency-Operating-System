# Enterprise Folder Structure Specification
## AI Agency Operating System (AgencyOS)

```
ai-agency-operating-system/
│
├── .github/                            # GitHub Actions Workflows & Templates
│   ├── ISSUE_TEMPLATE/                 # GitHub Bug & Feature Request Templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md         # PR Review Checklist Template
│   └── workflows/                      # CI/CD Automation Workflows
│       ├── ci-frontend.yml             # Next.js Lint, Typecheck, Jest & Playwright Tests
│       ├── ci-backend.yml              # Spring Boot Java 21 Maven/Gradle Build & Tests
│       ├── cd-staging.yml              # Staging Deployment Pipeline
│       ├── cd-production.yml           # Production Blue/Green Deployment Pipeline
│       └── security-scan.yml           # Trivy Container & CodeQL Vulnerability Scanning
│
├── frontend/                           # Next.js 15 + React 19 + TypeScript + Tailwind + shadcn/ui
│   ├── app/                            # App Router Pages & Routes
│   │   ├── (auth)/                     # Authentication Route Group
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── mfa/page.tsx
│   │   │   └── sso/page.tsx
│   │   ├── (dashboard)/                # Authenticated Dashboard Layout & Pages
│   │   │   ├── layout.tsx              # Sidebar + Header Layout Wrapper
│   │   │   ├── dashboard/page.tsx      # Executive Metrics & AI Feed
│   │   │   ├── proposals/page.tsx      # AI Proposal Generator & History
│   │   │   ├── contracts/page.tsx      # SOW & Legal Contract Builder
│   │   │   ├── invoices/page.tsx       # Invoice Builder & Stripe Sync
│   │   │   ├── jira/page.tsx           # AI Jira Backlog Generator
│   │   │   ├── clients/page.tsx        # 360° Client CRM Directory
│   │   │   ├── projects/page.tsx       # Agile Kanban & Milestone Tracker
│   │   │   └── settings/page.tsx       # BYOK Keys & Workspace Settings
│   │   ├── api/                        # Next.js Server-Sent Events (SSE) Proxy & Edge Handlers
│   │   │   └── ai/
│   │   │       └── stream/route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css                 # Design Tokens, Glassmorphism & Custom Tailwind Rules
│   │   ├── layout.tsx                  # Root Layout & Metadata
│   │   └── page.tsx                    # Landing Page (Marketing)
│   ├── components/                     # Component Library Architecture
│   │   ├── ui/                         # shadcn/ui Primitive Components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/                     # Application Shell Components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── workspace-switcher.tsx
│   │   └── modules/                    # Feature Organisms & Complex Cards
│   │       ├── ai-generator-modal.tsx
│   │       ├── proposal-preview.tsx
│   │       ├── invoice-table.tsx
│   │       └── jira-card.tsx
│   ├── hooks/                          # Custom React Client Hooks
│   │   ├── use-ai-generator.ts         # Streaming AI Text Generation Hook
│   │   ├── use-auth.ts                 # Auth Session & Organization Context
│   │   └── use-command-palette.ts      # Cmd+K Keyboard Shortcut Launcher
│   ├── lib/                            # Frontend Utilities & API Handlers
│   │   ├── api-client.ts               # Axios / Fetch HTTP Interceptor Stack
│   │   ├── utils.ts                    # Classnames (clsx + tailwind-merge)
│   │   └── zod-schemas.ts              # Client Validation Schemas
│   ├── types/                          # TypeScript Interface Definitions
│   │   ├── api.ts                      # Backend DTO Response Types
│   │   ├── client.ts                   # Client CRM Interfaces
│   │   ├── document.ts                 # Proposal & Contract Types
│   │   └── user.ts                     # User & Role Types
│   ├── next.config.mjs                 # Next.js Configuration
│   ├── package.json                    # Node Dependencies
│   ├── postcss.config.js               # PostCSS Plugins
│   ├── tailwind.config.js              # Design System Color & Typography Tokens
│   └── tsconfig.json                   # TypeScript Compiler Configuration
│
├── backend/                            # Enterprise Spring Boot 3.3 / Java 21 Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agencyos/
│   │   │   │   ├── AgencyOsApplication.java # Spring Boot Main Entry Point
│   │   │   │   │
│   │   │   │   ├── config/             # Spring Security & App Configurations
│   │   │   │   │   ├── AsyncConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── JwtConfig.java
│   │   │   │   │   ├── RedisConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── SwaggerConfig.java
│   │   │   │   │
│   │   │   │   ├── security/           # Authentication & Tenant Security Context
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── RbacPermissionEvaluator.java
│   │   │   │   │   ├── TenantSecurityContextHolder.java
│   │   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │   │
│   │   │   │   ├── exception/          # Global Exception Handlers
│   │   │   │   │   ├── AiProcessingException.java
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── UnauthorizedTenantException.java
│   │   │   │   │
│   │   │   │   ├── common/             # Cross-Cutting Core Utilities & Base Classes
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── BaseEntity.java # Audit Fields (created_at, updated_at)
│   │   │   │   │   ├── PageResponse.java
│   │   │   │   │   └── TenantContext.java
│   │   │   │   │
│   │   │   │   ├── modules/            # Domain-Driven Bounded Context Modules
│   │   │   │   │   │
│   │   │   │   │   ├── auth/           # Module 1: Auth & SSO
│   │   │   │   │   │   ├── controller/AuthController.java
│   │   │   │   │   │   ├── dto/AuthRequestDTO.java
│   │   │   │   │   │   ├── dto/AuthResponseDTO.java
│   │   │   │   │   │   ├── entity/UserEntity.java
│   │   │   │   │   │   ├── mapper/UserMapper.java
│   │   │   │   │   │   ├── repository/UserRepository.java
│   │   │   │   │   │   └── service/AuthService.java
│   │   │   │   │   │
│   │   │   │   │   ├── tenant/         # Module 2: Multi-Tenant Organizations
│   │   │   │   │   │   ├── controller/TenantController.java
│   │   │   │   │   │   ├── dto/TenantDTO.java
│   │   │   │   │   │   ├── entity/TenantEntity.java
│   │   │   │   │   │   ├── repository/TenantRepository.java
│   │   │   │   │   │   └── service/TenantService.java
│   │   │   │   │   │
│   │   │   │   │   ├── proposal/       # Module 3: AI Proposals
│   │   │   │   │   │   ├── controller/ProposalController.java
│   │   │   │   │   │   ├── dto/ProposalRequestDTO.java
│   │   │   │   │   │   ├── dto/ProposalResponseDTO.java
│   │   │   │   │   │   ├── entity/ProposalEntity.java
│   │   │   │   │   │   ├── mapper/ProposalMapper.java
│   │   │   │   │   │   ├── repository/ProposalRepository.java
│   │   │   │   │   │   └── service/ProposalService.java
│   │   │   │   │   │
│   │   │   │   │   ├── contract/       # Module 4: SOW & Legal Contracts
│   │   │   │   │   │   ├── controller/ContractController.java
│   │   │   │   │   │   ├── dto/ContractDTO.java
│   │   │   │   │   │   ├── entity/ContractEntity.java
│   │   │   │   │   │   ├── repository/ContractRepository.java
│   │   │   │   │   │   └── service/ContractService.java
│   │   │   │   │   │
│   │   │   │   │   ├── invoice/        # Module 5: Stripe Billing & Invoices
│   │   │   │   │   │   ├── controller/InvoiceController.java
│   │   │   │   │   │   ├── dto/InvoiceDTO.java
│   │   │   │   │   │   ├── entity/InvoiceEntity.java
│   │   │   │   │   │   ├── entity/LineItemEntity.java
│   │   │   │   │   │   ├── repository/InvoiceRepository.java
│   │   │   │   │   │   └── service/InvoiceService.java
│   │   │   │   │   │
│   │   │   │   │   ├── jira/           # Module 6: Jira Backlog Generator
│   │   │   │   │   │   ├── controller/JiraController.java
│   │   │   │   │   │   ├── dto/JiraStoryDTO.java
│   │   │   │   │   │   ├── entity/JiraStoryEntity.java
│   │   │   │   │   │   └── service/JiraService.java
│   │   │   │   │   │
│   │   │   │   │   ├── client/         # Module 7: 360° Client CRM
│   │   │   │   │   │   ├── controller/ClientController.java
│   │   │   │   │   │   ├── dto/ClientDTO.java
│   │   │   │   │   │   ├── entity/ClientEntity.java
│   │   │   │   │   │   └── service/ClientService.java
│   │   │   │   │   │
│   │   │   │   │   ├── ai/             # Module 8: AI Model Router & Orchestrator
│   │   │   │   │   │   ├── orchestrator/LlmOrchestratorService.java
│   │   │   │   │   │   ├── provider/AnthropicClaudeProvider.java
│   │   │   │   │   │   ├── provider/OpenAiGptProvider.java
│   │   │   │   │   │   ├── provider/GoogleGeminiProvider.java
│   │   │   │   │   │   └── template/PromptTemplateEngine.java
│   │   │   │   │   │
│   │   │   │   │   └── notification/   # Module 9: Multi-Channel Notifications
│   │   │   │   │       ├── service/EmailService.java
│   │   │   │   │       ├── service/SlackWebhookService.java
│   │   │   │   │       └── service/SseNotificationService.java
│   │   │   │   │
│   │   │   │   └── util/               # Technical Helper Utilities
│   │   │   │       ├── MarkdownParserUtil.java
│   │   │   │       ├── PdfGeneratorUtil.java
│   │   │   │       └── TokenCalculatorUtil.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yml     # Core Configuration Setup
│   │   │       ├── application-dev.yml # Local Development Overrides
│   │   │       ├── application-prod.yml# Production AWS/EKS Settings
│   │   │       └── db/migration/       # Flyway SQL Migration Scripts
│   │   │           ├── V1__init_tenant_schema.sql
│   │   │           ├── V2__create_proposals_table.sql
│   │   │           ├── V3__create_contracts_table.sql
│   │   │           ├── V4__create_invoices_table.sql
│   │   │           └── V5__create_jira_stories_table.sql
│   │   │
│   │   └── test/                       # Enterprise Java 21 Test Suite
│   │       └── java/com/agencyos/
│   │           ├── unit/               # Unit Tests (JUnit 5 + Mockito)
│   │           ├── integration/        # Integration Tests (Testcontainers PostgreSQL + Redis)
│   │           └── e2e/                # API End-to-End Tests (RestAssured)
│   │
│   ├── build.gradle / pom.xml          # Java 21 Build Dependency Spec
│   └── Dockerfile                      # Multi-stage Docker Container Build File
│
├── database/                           # Standalone Database Scripts & Tools
│   ├── init-scripts/                   # PostgreSQL Initialization Scripts
│   │   └── 01-init-rls.sql             # Row-Level Security Enablement
│   └── seed-data/                      # Sandbox Seed Data Sets
│       └── dev-seed.sql
│
├── infrastructure/                     # Infrastructure as Code (IaC) & DevOps
│   ├── docker/                         # Multi-Container Development Environment
│   │   ├── docker-compose.yml          # Postgres, Redis, MinIO, Localstack Setup
│   │   └── docker-compose.override.yml
│   ├── helm/                           # Kubernetes Helm Deployment Charts
│   │   └── agencyos/
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       └── templates/
│   │           ├── deployment.yaml
│   │           ├── service.yaml
│   │           ├── ingress.yaml
│   │           └── hpa.yaml            # Horizontal Pod Autoscaling Spec
│   └── terraform/                      # AWS Infrastructure Provisioning
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── modules/
│           ├── vpc/
│           ├── eks/
│           ├── rds-postgres/
│           ├── cache-redis/
│           └── storage-s3/
│
├── ARCHITECTURE.md                     # 30-Section Enterprise Architecture Specification
├── DESIGN.md                           # Google Stitch Design System Specs
├── TECH_STACK.md                       # Comprehensive Technology Stack Analysis
├── FOLDER_STRUCTURE.md                 # Complete Monorepo Folder Hierarchy Spec
├── Product Requirements Document.md    # Product Specifications
└── UX Screen Inventory.md             # Complete Screen Architecture Inventory
```
