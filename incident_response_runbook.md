# SRE Incident Response Framework & Postmortem Specification
## AI Agency Operating System (AgencyOS)

---

## 1. Incident Lifecycle & Workflow

```
[ Alert Triggered / User Report ]
               │
               ▼
[ Incident Commander (IC) Assigned ]
               │
               ▼
[ Triage & Classification (SEV-1 to SEV-4) ]
               │
               ├── SEV-1/2 ──> Open War Room & Post Status Update (status.agencyos.io)
               │
               ▼
[ Mitigation & Hotfix / Rollback ]
               │
               ▼
[ Resolution Verification & Incident Closure ]
               │
               ▼
[ Blameless Postmortem & Root Cause Analysis (RCA) ]
```

---

## 2. Standard Blameless Postmortem Template

```markdown
# Blameless Postmortem: [Incident Title]
**Date**: YYYY-MM-DD
**Incident Commander**: [Name]
**Severity**: SEV-1 / SEV-2
**Total Downtime**: XX Minutes

## 1. Executive Summary
Brief high-level summary of what occurred, user impact, and resolution.

## 2. Root Cause Analysis (RCA - 5 Whys)
- Why did the API crash? (Memory leak in AI prompt caching)
- Why was the memory leak present? (Unbounded map cache)
...

## 3. Corrective Action Items
- [ ] Add Redis TTL to memory cache (Owner: SRE Team, Due: YYYY-MM-DD)
```
