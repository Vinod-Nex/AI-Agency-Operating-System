# Enterprise Google Slides API Integration Guide
## AI Agency Operating System (AgencyOS)

---

## 1. Purpose

This document specifies the Google Slides v1 API integration for generating automated AI client proposal pitch decks, quarterly executive reviews, and business analytics presentations.

---

## 2. Slides Generation Workflow

1. **Master Template Copy**: Duplicate template presentation `AgencyOS Pitch Deck Master`.
2. **Text & Image Replacements**: Execute `presentations.batchUpdate` replacing placeholders (`{{client_logo}}`, `{{project_name}}`, `{{pricing_table}}`).
3. **Slide Layout Injection**: Programmatically inject custom layout slides (Timeline, Team Bios, Architecture Diagrams).
4. **Scope**: `https://www.googleapis.com/auth/presentations`.
