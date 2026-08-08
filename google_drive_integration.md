# Enterprise Google Drive API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document details the Google Drive v3 API integration for managing agency project folder hierarchies, resumable large file uploads, file sharing permissions, version control, and multi-tenant document storage.

---

## 2. Directory Hierarchy & Resumable Upload Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│              AGENCYOS MULTI-TENANT GOOGLE DRIVE HIERARCHY               │
├─────────────────────────────────────────────────────────────────────────┤
│ [AgencyOS Master Storage Root Folder]                                   │
│  ├── [Org: Acquired Corp (org_101)]                                    │
│  │   ├── [Project: Cloud Migration]                                     │
│  │   │   ├── 01_Proposals/ (PDF Exports)                                │
│  │   │   ├── 02_Contracts/ (Signed MSAs)                                │
│  │   │   ├── 03_Deliverables/ (Source Code, Assets)                     │
│  │   │   └── 04_Meeting_Recordings/ (MP4 / WebVTT Transcripts)          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Resumable Upload Protocol (Large Files > 5MB)

For large asset uploads (meeting recordings, video deliverables), AgencyOS uses the Google Drive Resumable Upload protocol:

1. **Initiate Session**: Send `POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable` with file metadata (MIME type, name, parent folder ID).
2. **Obtain Location URI**: Google Drive returns HTTP 200 OK with `Location: https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=...`.
3. **Stream Chunks**: Client/Backend uploads 256KB-aligned chunk byte buffers until completion.
