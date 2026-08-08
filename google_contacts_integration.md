# Enterprise Google Contacts (People API) Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the Google People API v1 integration for bi-directional client CRM contact synchronization, organization directory imports, contact export, and contact deduplication.

---

## 2. Synchronization & Deduplication Rules

1. **Primary Identifier**: Email address (`primaryEmail`).
2. **Deduplication Engine**: Merges contacts matching existing AgencyOS client records on primary email or mobile phone.
3. **Scope**: `https://www.googleapis.com/auth/contacts` (Read/Write Google Contacts).
