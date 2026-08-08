# Customer Success, Onboarding & Community Expansion Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details customer onboarding workflows, interactive academies, community portals, feature voting boards, Net Promoter Score (NPS) tracking, and automated Customer Health Score algorithms.

---

## 2. Customer Health Score Algorithm

AgencyOS calculates a real-time **Customer Health Score (0 - 100)** for every tenant organization:

$$\text{Health Score} = 0.35(S_{\text{activation}}) + 0.25(S_{\text{frequency}}) + 0.20(S_{\text{ai\_usage}}) + 0.20(S_{\text{csat}})$$

- $S_{\text{activation}}$: Ratio of assigned active user seats to purchased seats limit.
- $S_{\text{frequency}}$: Days active per week by organization team members.
- $S_{\text{ai\_usage}}$: Percentage of monthly included AI tokens consumed.
- $S_{\text{csat}}$: In-app Net Promoter Score rating (1-10 normalized).

| Health Score Range | Account Classification | Automated Action |
| :--- | :--- | :--- |
| **80 - 100** | Healthy / Growth Target | Automated Upsell Prompt to Enterprise Tier |
| **50 - 79** | Neutral / Monitor | Send Academy Tutorial Video Emails |
| **0 - 49** | At-Risk / High Churn Probability | Trigger P2 Alert to CSM Lead for Intervention |
