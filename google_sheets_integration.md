# Enterprise Google Sheets API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details the Google Sheets v4 API integration for automated invoice ledger exports, agency financial reporting, time-tracking sync, client analytics reporting, and automated cell formatting.

---

## 2. Google Sheets API Integration Architecture

```mermaid
graph TD
    BillingDB[(PostgreSQL Invoices & Payments)] -->|1. Export Financial Data| Exporter[Spring Boot Sheets Sync Daemon]
    Exporter -->|2. Format Cells & Charts| SheetsAPI[Google Sheets API v4]
    SheetsAPI -->|3. Update Spreadsheet| SheetDoc[Google Sheet: "AgencyOS Financial Report Q3"]
    SheetDoc -->|4. Share Link with Finance Team| Finance[Finance Operations & CFO]
```

---

## 3. Supported Operations & Batch Value Appends

- **`spreadsheets.values.append`**: Append billing transaction rows to `Invoices` worksheet.
- **`spreadsheets.batchUpdate`**: Apply currency formatting (`$#,##0.00`), header background styling, and auto-fit column widths.
- **Scope**: `https://www.googleapis.com/auth/spreadsheets` (Full spreadsheet management).
