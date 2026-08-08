# Performance Monitoring & Core Web Vitals SLA Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document defines performance SLA/SLO/SLI specifications, Core Web Vitals targets, backend REST throughput baselines, database query performance profiles, queue lag indicators, and AI latency benchmarks for AgencyOS.

---

## 2. Core Web Vitals & Frontend Performance SLAs

| Core Web Vital | Excellent Target | Needs Improvement | Poor (P3 Alert) | Measurement Method |
| :--- | :--- | :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | < 1.8 seconds | 1.8s - 2.5s | > 2.5 seconds | Vercel Analytics / Sentry SDK |
| **Interaction to Next Paint (INP)**| < 100 ms | 100ms - 200ms | > 200 ms | Web Vitals JS Library |
| **Cumulative Layout Shift (CLS)**  | < 0.05 | 0.05 - 0.10 | > 0.10 | Layout Shift API |
| **First Input Delay (FID)**        | < 50 ms | 50ms - 100ms | > 100 ms | Client Browser Telemetry |
| **Time to First Byte (TTFB)**      | < 100 ms | 100ms - 300ms | > 500 ms | Ingress API Edge Network |

---

## 3. Backend & Data Tier Performance Benchmarks

### A. Backend API Latency SLAs (Non-AI Endpoints)
- **P50 Latency Target**: < 45 ms
- **P95 Latency Target**: < 150 ms
- **P99 Latency Target**: < 450 ms

### B. Database Query Performance SLA
- **Fast Path Queries (PK Lookups)**: P95 < 5 ms
- **Complex Multi-Tenant Aggregations**: P95 < 100 ms
- **Slow Query Definition**: Any query taking > 500 ms logged automatically to `pg_slow_queries_total`.

### C. AI Provider Latency SLAs
- **Time-To-First-Token (TTFT) - OpenAI GPT-4o**: P95 < 250 ms
- **Time-To-First-Token (TTFT) - Anthropic Claude 3.5**: P95 < 300 ms
- **Full Proposal Generation Stream**: P95 < 6.5 seconds

### D. Queue Lag & Background Workers SLA
- **Job Pickup Lag**: P95 < 2.0 seconds
- **Contract PDF Generation Processing Time**: P95 < 3.5 seconds
