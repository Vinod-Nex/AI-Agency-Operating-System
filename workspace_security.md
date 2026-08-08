# Google Workspace Security Architecture & Compliance Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details security controls, Google API Restricted Scopes compliance, OAuth 2.0 token vault protection, AES-256-GCM encryption, KMS secrets management, PII redaction, and multi-tenant isolation standards for Google Workspace integrations.

---

## 2. Google User Data Policy & Restricted Scopes Compliance

AgencyOS accesses Google User Data under strict compliance with the **Google API Services User Data Policy**:

1. **Incremental Authorization**: Scopes are requested only when a user explicitly activates a feature (e.g. `gmail.send` is requested only when activating automated follow-ups).
2. **CASA Tier 2/3 Security Assessment**: Annually audited under the Cloud Application Security Assessment (CASA) framework.
3. **AES-256-GCM Token Encryption**: Refresh tokens are stored encrypted at rest in PostgreSQL using AES-256-GCM with master keys stored in AWS KMS.
4. **Data Isolation**: User data extracted from Google Workspace (emails, documents) is scoped 1:1 to the authenticated tenant organization and never shared or used to train public LLM models.
