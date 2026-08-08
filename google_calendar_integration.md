# Enterprise Google Calendar API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the Google Calendar API v3 integration for automated client meeting scheduling, real-time availability checks (`freebusy`), recurring event management, timezone conversions, and automated reminders.

---

## 2. Calendar Scheduling & Availability Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Client as Agency Client
    participant FE as Next.js Booking Portal
    participant API as Spring Boot Backend
    participant CalAPI as Google Calendar API v3
    participant DB as PostgreSQL Database

    Client->>FE: Select Preferred Meeting Slot (e.g. 2026-07-28 14:00 UTC)
    FE->>API: POST /api/v1/integrations/google/calendar/availability-check
    
    API->>CalAPI: POST /calendar/v3/freeBusy (Check Agency Team Calendars)
    CalAPI-->>API: Return Busy Time Ranges
    
    alt Slot Available
        API->>CalAPI: POST /calendar/v3/calendars/primary/events (Create Event + Google Meet)
        CalAPI-->>API: Return { event_id: "evt_101", hangoutsLink: "https://meet.google.com/abc-defg-hij" }
        
        API->>DB: Insert Event Details into calendar_events & meetings Tables
        API-->>FE: Return Event Confirmation + Google Meet Link
    else Slot Busy
        API-->>FE: Return 409 Conflict (Suggest Next Free Slots)
    end
```

---

## 3. Mandatory Scopes & Features

- **Scope**: `https://www.googleapis.com/auth/calendar.events` (Manage calendar events).
- **Scope**: `https://www.googleapis.com/auth/calendar.readonly` (Read calendar free/busy availability).
- **Timezone Normalization**: All event timestamps are stored in UTC (`2026-07-28T14:00:00Z`) and rendered in client browser local timezone.
- **Conference Data Version**: Set `conferenceDataVersion=1` on event creation to automatically attach a **Google Meet** video conference link.
