# TextReach — P2P SaaS Texting Platform

A high-fidelity, fully interactive prototype for a professional **peer-to-peer SMS/MMS texting platform** built for organizations to manage contacts, campaigns, texters, conversations, and analytics at scale.

> **Live prototype** — open `index.html` directly in any modern browser. No build step, no server, no dependencies to install.

---

## Overview

TextReach is designed for organizations running large-scale P2P text outreach operations. The prototype demonstrates the complete product experience across four user roles:

- **Platform Administrator** — manages all organizations and platform health
- **Organization Administrator** — owns campaigns, contacts, and team
- **Campaign Manager** — creates and monitors campaigns
- **Texter** — sends messages and works through contact queues

---

## Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Login** | Polished auth screen with SSO option |
| 2 | **Dashboard** | KPI cards, performance chart, active campaigns, AI summary |
| 3 | **Contacts** | Airtable-style data table with search, filters, bulk actions, and contact drawer |
| 4 | **CSV Import** | 4-step wizard — Upload → AI Field Mapping → Validation → Import |
| 5 | **Campaigns** | Campaign table with status, progress, and delivery metrics |
| 6 | **Campaign Detail** | Per-campaign KPIs and message volume chart |
| 7 | **Create Campaign** | 5-step wizard with live message preview panel |
| 8 | **Templates** | Template cards + editor with merge fields and live preview |
| 9 | **Texter Workspace** | Focused send interface — contact card, composer, progress tracker |
| 10 | **Inbox** | 3-column conversation view — list, thread, contact panel |
| 11 | **Analytics** | 8 KPIs, 4 Chart.js charts, AI operations summary |
| 12 | **Team** | Member table with roles, invite and edit modals |
| 13 | **Admin** | Platform-level organization management |
| 14 | **Audit Log** | Full activity and security event log |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/tahafast/P2P-SaaS-Texting-Application.git

# Open in browser
# Simply double-click index.html or open it with your browser of choice
```

No npm install. No build. Just open and run.

**Demo credentials (pre-filled):**
- Email: `alex.rivera@abccampaign.org`
- Password: any value

---

## File Structure

```
├── index.html                  # Entry point — login screen + app shell
├── styles/
│   ├── design-system.css       # Color tokens, typography, spacing, animations
│   ├── layout.css              # Sidebar, topbar, app shell, responsive grid
│   ├── components.css          # All reusable UI components
│   └── screens.css             # Per-screen specific styles
└── scripts/
    ├── data.js                 # All demo seed data
    ├── components.js           # Shared UI: Toast, Modal, Drawer, Charts, icons
    ├── screens.js              # All 13 screen render functions
    └── app.js                  # SPA router, state management, navigation
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | Vanilla HTML5 |
| Styling | Vanilla CSS (custom properties design system) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | [Chart.js 4.4](https://www.chartjs.org/) via CDN |
| Typography | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Icons | Inline SVG (no external icon library) |

Zero build toolchain. Zero npm dependencies. Fully self-contained.

---

## Key Interactions

- **Login → Dashboard** — animated screen transition
- **Sidebar** — full navigation with collapse toggle
- **Contacts table** — live search, status tabs, row click → slide-in drawer
- **CSV Import wizard** — drag-drop upload simulation, AI mapping confidence bars, validation errors, import success state
- **Create Campaign wizard** — 5-step form with a live message preview card that updates as you type
- **Texter workspace** — send animation → success state → load next contact
- **Inbox** — reply composer that inserts messages live into the thread
- **Analytics** — Chart.js line, bar, and doughnut charts
- **Toasts** — success / info / warning / error notifications
- **Modals** — confirmation dialogs for destructive actions
- **Drawers** — slide-in contact detail panels

---

## Demo Data

The prototype is seeded with realistic fictional data for:

- **Organization:** ABC Campaign — Texas District
- **Admin:** Alex Rivera
- **20 contacts** across Austin, Houston, Dallas, San Antonio
- **5 campaigns** (Active, Ready, Paused, Completed)
- **6 team members** across Texter, Manager, and Admin roles
- **5 message templates** with merge fields
- **5 conversations** with full message histories
- **12 audit log events**
- **6 platform organizations** (Admin view)

---

## Design System

The CSS design system is defined entirely through custom properties in `design-system.css`:

- **Colors** — Deep navy sidebar, white/light-gray backgrounds, teal accent, semantic green/amber/red states
- **Typography** — Inter, 8-stop size scale (11px → 36px), weight 400–800
- **Spacing** — 4px base unit, scale: 4/8/12/16/20/24/32/40/48/64px
- **Shadows** — 6 levels from `xs` to `2xl`
- **Border radius** — `xs` (3px) to `2xl` (20px) + `full`
- **Transitions** — `fast` (100ms) to `slower` (400ms cubic-bezier)
- **Animations** — fadeIn, fadeInUp, slideIn, scaleIn, shimmer skeleton, toast

---

## Client Demo Flow

The prototype is optimized for this walkthrough sequence:

```
Login
  → Organization Dashboard
  → Contacts (search, filter, open contact drawer)
  → Import CSV (upload → AI mapping → validate → import success)
  → Campaigns (browse active campaigns)
  → Create Campaign (5-step wizard → live preview → launch)
  → Texter Workspace (send message → next contact)
  → Inbox (open conversation → reply)
  → Analytics (charts + AI summary)
```

---

## Browser Support

Tested on Chrome, Edge, and Firefox (latest). Recommended viewport: 1280px and above.

---

## License

This is a prototype for demonstration purposes.
