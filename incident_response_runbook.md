# Incident Response & Postmortem Runbook Standard
## AI Agency Operating System (AgencyOS)

---

## 1. Overview & Incident Severity Definitions

AgencyOS classifies production operational incidents into four severity levels to coordinate emergency response, war room activation, and customer communications.

| Severity Level | Definition | Response SLA | Target MTTR | War Room Activated |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-0 / P1** | Total platform outage, security breach, or catastrophic database loss. | < 5 Minutes | < 30 Minutes | Mandatory Google Meet |
| **SEV-1 / P2** | Major feature outage (AI Generation down, Payment Processing down). | < 15 Minutes | < 2 Hours | Slack #war-room |
| **SEV-2 / P3** | Minor feature degradation (High latency, queue processing delays). | < 2 Hours | < 8 Hours | Asynchronous |
| **SEV-3 / P4** | Non-critical operational glitch, low impact UI issue, minor bug. | < 24 Hours | < 3 Business Days | Jira Ticket |

---

## 2. Incident Command Escalation Matrix

```
[Triggering Event / PagerDuty Alert]
                  │
                  ▼
         [On-Call SRE Engineer] ─── (Initial Triage & Acknowledgment < 5m)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  [SEV-2 / SEV-3]     [SEV-0 / SEV-1]
        │                   │
  [Resolve Locally]   [Declare Incident & Activate Escalation Matrix]
                            │
                            ├──> Incident Commander (IC): SRE Lead
                            ├──> Technical Lead (TL): Principal Backend Architect
                            ├──> Communications Lead (CL): VP Engineering / Product Lead
                            └──> Security Incident Lead (if security breach)
```

---

## 3. Incident Execution Timeline & Workflow

1. **Detection & Paging**: Alertmanager detects anomaly -> PagerDuty pages On-call SRE.
2. **Declaration & Triage**: SRE acknowledges page, assesses severity, and creates Slack channel `#inc-20260725-api-outage`.
3. **War Room Setup**: Google Meet link posted to Slack for SEV-0 / SEV-1. Roles assigned (IC, TL, CL).
4. **Investigation & Mitigation**: Diagnostic log/trace queries in Grafana Loki/Tempo. Implement quick mitigation (Rollback, Feature Flag disable, Scale up).
5. **Customer Communication**: CL updates Status Page (`status.agencyos.ai`) every 15 minutes for SEV-0.
6. **Resolution & Stand Down**: System restored and verified against Prometheus metrics. IC declares incident closed.
7. **Blameless Postmortem**: Completed within 48 hours of resolution.

---

## 4. Blameless Postmortem Template (`postmortem-template.md`)

```markdown
# Blameless Postmortem: [Incident Summary]
**Date**: 2026-07-25  
**Severity**: SEV-1  
**Incident Commander**: SRE Lead  
**Lead Investigator**: Principal Backend Architect  

## Executive Summary
Brief high-level explanation of what happened, root cause, and impact on customers.

## Customer Impact
- **Total Affected Tenants**: 45 Organizations (12% of active users)
- **Duration**: 24 minutes (21:10 UTC to 21:34 UTC)
- **Failed Requests**: 1,240 AI Proposal Generation calls

## Incident Timeline (UTC)
- `21:10` - Prometheus alert `AIProviderOutage` triggered PagerDuty.
- `21:12` - On-Call SRE acknowledged page and declared SEV-1.
- `21:15` - Identified Anthropic API 503 response spike.
- `21:20` - Activated automated fallback circuit breaker to OpenAI GPT-4o.
- `21:25` - Error rate returned to 0%. Platform stabilized.
- `21:34` - Incident closed by IC.

## Root Cause Analysis (5 Whys)
1. Why did proposals fail? Anthropic API calls timed out.
2. Why did they time out? Anthropic US-East region experienced an outage.
3. Why didn't fallback trigger immediately? Circuit breaker failure threshold was set too high (50 failures instead of 10).
4. Why was it set to 50? Legacy setting from staging testing.
5. Action Item: Update Resilience4j circuit breaker threshold to 10 failures in 30s.

## Action Items & Preventative Measures
| Action Item | Type | Owner | Due Date | Jira Key |
| :--- | :--- | :--- | :--- | :--- |
| Lower circuit breaker failure threshold to 10 | Preventative | Backend Team | 2026-07-27 | AG-4021 |
| Implement automated fallback synthetic integration test | Testing | QA Lead | 2026-08-01 | AG-4022 |
```
