# Enterprise Google Meet Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the Google Meet REST API integration for dynamic meeting room provisioning, meeting metadata management, Google Calendar sync, and automated transcript/recording metadata ingestion.

---

## 2. Google Meet Integration Architecture

```mermaid
graph TD
    Booking[Agency Booking System / Client Calendar] -->|Create Calendar Event| CalAPI[Google Calendar API v3]
    CalAPI -->|conferenceData.createRequest| MeetAPI[Google Meet REST API v1]
    
    MeetAPI -->|Return Meet Code & URI| Space[Google Meet Space: meet.google.com/xyz-pdq-abc]
    
    subgraph Post-Meeting Ingestion Pipeline
        Space -->|Meeting Ends| CloudStorage[Google Drive / Meet Recording Folder]
        CloudStorage -->|Pub/Sub Event| Ingest[Spring Boot Transcript Ingestion Worker]
        Ingest -->|Process Audio Transcript| AI[AI Summarizer Engine]
        AI -->|Generate Minutes & Tasks| DB[(PostgreSQL meetings Table)]
    end
```

---

## 3. Key Integration Capabilities

1. **Automatic Space Provisioning**: Every client proposal review or kickoff meeting created via AgencyOS automatically includes a secure Google Meet space.
2. **Recording & Transcript Metadata Ingestion**: Automatically link Google Drive Meet recording MP4 files and raw WebVTT transcript files to the corresponding AgencyOS project meeting record.
3. **Meeting Action Item Extraction**: AI Engine processes the meeting transcript into structured action items and syncs them to Google Tasks and Jira Cloud.
