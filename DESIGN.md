---
name: Synthetic Intelligence OS
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b90a0'
  outline-variant: '#414755'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4b8eff'
  on-primary-container: '#00285c'
  inverse-primary: '#005bc1'
  secondary: '#d7baff'
  on-secondary: '#440087'
  secondary-container: '#5f19af'
  on-secondary-container: '#caa4ff'
  tertiary: '#5cde94'
  on-tertiary: '#00391e'
  tertiary-container: '#06a662'
  on-tertiary-container: '#003119'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#eddcff'
  secondary-fixed-dim: '#d7baff'
  on-secondary-fixed: '#290055'
  on-secondary-fixed-variant: '#5f19af'
  tertiary-fixed: '#7afbae'
  tertiary-fixed-dim: '#5cde94'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522e'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  border-subtle: '#1F1F1F'
  surface-raised: '#111111'
  ai-glow: '#7000FF'
  success-muted: '#162C1F'
  error-alert: '#FF453A'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-edge: 32px
  sidebar-width: 260px
  panel-ai-width: 400px
---

## Brand & Style

The design system is engineered for high-performance AI agencies where speed, precision, and enterprise-grade reliability are paramount. The brand personality is "The Invisible Powerhouse"—sophisticated, ultra-efficient, and quietly intelligent. It avoids flashy AI tropes in favor of a utilitarian, data-dense aesthetic that maximizes information density without sacrificing clarity.

The visual style is a fusion of **Minimalism** and **Linear-inspired Enterprise Design**. It utilizes a "Dark Mode First" philosophy with high-contrast accents that guide the eye to AI-generated insights. Key characteristics include:

- **Subtle Glassmorphism:** Translucent overlays and backdrop blurs are used sparingly to create a sense of depth and focus, particularly in command palettes and AI chat panels.
- **Micro-Precision:** Borders are thin (1px), colors are desaturated with punchy accents, and typography is perfectly balanced for long-form technical reading.
- **AI-Native Feedback:** Subtle glowing states and "streaming" animations indicate background processing and generative AI actions.

## Colors

The palette is optimized for professional environments, favoring deep blacks and rich grays to reduce eye strain during extended use. 

- **Primary:** A precision-tuned "Electric Blue" used for primary actions and active states, reminiscent of high-end developer tools.
- **Secondary/Tertiary:** Used for AI-specific highlights (Purple) and financial success indicators (Green).
- **Neutral:** A range of custom grays starting from absolute black (`#000000`) for backgrounds to a "Zinc" gray for text and borders.
- **Surface Strategy:** Surfaces use a layered approach. The base is darkest, while modals and cards use a slightly lighter gray (`#111111`) with 1px borders to define boundaries rather than heavy shadows.

## Typography

Typography is used to create a clear information hierarchy in a data-heavy environment.

- **Headlines:** Uses a technical sans-serif with tight kerning for a modern, geometric feel.
- **Body:** Leverages a highly legible, neutral sans-serif for reading long AI-generated documents and complex tables.
- **Technical/Metadata:** A monospaced font is used for status labels, IDs, AI tokens, and timestamps to emphasize the "Operating System" aesthetic.
- **Scaling:** On mobile, display sizes are significantly reduced and letter spacing is neutralized to ensure readability in narrow viewports.

## Layout & Spacing

This design system employs a **Fluid Grid** model with a hard 4px baseline rhythm. 

- **Sidebar Layout:** A persistent left sidebar (260px) handles primary navigation, while an optional right-side AI Chat Panel (400px) can be toggled to provide context-aware assistance.
- **Desktop (1440px+):** 12-column grid with 24px gutters. Margins are generous to create a "focused" center column for document editors.
- **Tablet (768px - 1024px):** Sidebar collapses into an icon-only rail or hides behind a burger menu. Gutters reduce to 16px.
- **Mobile (<768px):** A single-column flow with 16px edge margins. The AI Assistant becomes a full-screen modal or a bottom-sheet drawer.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Subtle Glassmorphism** rather than traditional shadows.

- **Level 0 (Base):** Absolute black background for the workspace.
- **Level 1 (Cards/Panels):** Raised using a `#111111` surface with a subtle `1px solid #1F1F1F` border.
- **Level 2 (Modals/Command Palette):** Uses a semi-transparent background (85% opacity) with a `24px` backdrop blur to separate the element from the content below.
- **AI Focus:** Elements generated or highlighted by AI feature a very soft, outer glow using a desaturated purple tint (`#7000FF` at 10% opacity) to signify "intelligence" without being distracting.

## Shapes

The shape language is "Enterprise Soft." We use a small corner radius to maintain a professional, structured feel while avoiding the harshness of 0px corners.

- **Standard Elements:** Buttons, inputs, and small cards use a **4px (0.25rem)** radius.
- **Large Containers:** Main dashboard cards and AI panels use an **8px (0.5rem)** radius.
- **Interactive States:** Hovering over list items or menu options reveals a subtle background highlight with a **4px** radius.

## Components

### Buttons & Inputs
- **Primary Button:** Solid blue background with white text. High contrast, no gradient.
- **Secondary Button:** Ghost style with a 1px border. Transitions to a subtle gray fill on hover.
- **Inputs:** Dark background (`#0A0A0A`) with a subtle border. On focus, the border glows with the primary blue color.

### AI Chat Panels
- Use a dedicated sidebar or "Floating Action Panel" (FAP).
- Messages are differentiated by subtle tonal shifts: User messages are dark gray, AI responses have a faint purple border on the left edge.
- Include a "Streaming" indicator (three pulsing dots) when the AI is generating.

### Modern Tables
- Borderless rows with 1px separators. 
- High-density spacing. 
- Sortable headers using the monospaced label font.
- Status indicators use "Small Pill" shapes with muted background colors (e.g., dark green background for a green text status).

### Command Palette
- Centered modal with a search input at the top.
- Backdrop blur is essential here. 
- List items feature keyboard shortcuts (monospaced) on the far right.

### Status Indicators
- **AI Suggested:** A small star icon next to text.
- **Processing:** A thin, animated line at the very top of a card or page.