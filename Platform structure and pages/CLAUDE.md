# Qode Algo Platform — Design Context

Retail algo-trading platform (RA/SEBI-registered), styled after Stratzy-type products. Users connect their own broker (Nuvama, iRage, Dhan) and subscribe to research-backed algos while retaining control of capital/execution.

## Brand palette (from Qode Brand Colour Palette doc)
- Primary — Forest Green `#02422B`
- Primary — Deep Forest `#002017`
- Secondary — Golden Yellow `#DABD38`
- Secondary — Cream `#EFEDC3`
- Page background used in mocks: `#FAF7EC` (lighter cream)
- Strategy accent colors (not core UI): All Weather green `#008455`, Growth Fund navy `#0A3452` — reserved for algo/strategy branding, not chrome
- Type: Playfair Display (`--font-primary`, serif, headlines) + Lato (`--font-secondary`, sans, body/UI)
- Logo files: `assets/qode-logo-white.svg` (dark backgrounds), `assets/qode-logo.svg` (full color, light backgrounds) — more variants (black/grayscale/inverted) available in the user's local "Qode Algo Platform" asset folder

## Auth
Email+password, phone OTP, and Google OAuth, backed by Supabase.

## Pages built so far
| Page | File | Notes |
|---|---|---|
| Sign Up | `Sign Up.dc.html` | Split layout: brand/trust panel (dark gradient) + form (email/phone tabs, Google OAuth, T&C checkbox) |
| Login | `Login.dc.html` | Same shell as Sign Up; email/phone tabs, forgot-password link, no name/T&C fields |
| Positions | `Positions.dc.html` | Sidebar-shell app page; Open/Closed tabs, summary cards, per-broker/algo position table |
| Orders | `Orders.dc.html` | Sidebar-shell app page; Pending/Executed/Cancelled tabs, order table |
| Holdings | `Holdings.dc.html` | Sidebar-shell app page; holdings table with P&L, day change |
| Profile | `Profile.dc.html` | Sidebar-shell app page; Personal details, Broker details, Funds cards; tweaks for name/phone/email/verification/broker/balance |
| Profile (broker connected) | `Profile - Broker Connected.dc.html` | Same as Profile, defaults to connected state with real broker row; includes "Connect a broker" modal (Nuvama/iRage/Dhan picker) |
| My Algos | `My Algos.dc.html` | Sidebar-shell app page; market ticker, summary stats (Today/Overall toggle), status tabs (Active/Subscribed/Paused/Expired), algo table, empty state; tweak for hasAlgos |
| Reports | `Reports.dc.html` | Sidebar-shell app page; generate-report cards, recently generated table, footer |
| Help & Support | `Help & Support.dc.html` | Sidebar-shell app page; help articles, support ticket form, FAQ, footer |
| Marketplace | `Marketplace.dc.html` | Sidebar-shell app page; sidebar filters (risk/strategy/underlying/quick), featured algo cards (Qode Yield Enhancer +/++) with 1M/3M/CAGR + Setup, compact all-algos table below |
| Algo Detail | `Algo Detail.dc.html` | Individual algo page for Qode Yield Enhancer +; tabs (Performance/Best & Worst/Monthly & Regime/About & Disclosures incl. Strategy details: portfolio type, market, instruments, leverage, strategies used, objective, risk controls, active UIDs, current deployment, inception date), sticky deploy card, weekday-picker Deploy modal, Share, Certificate PDF link |
| Algo Detail (YE++) | `Algo Detail - YE++.dc.html` | Same layout as Algo Detail, populated for Qode Yield Enhancer ++ (2x overlay, higher risk/return profile) |
| Analytics | `Analytics.dc.html` | Sidebar-shell app page, reached via the Portfolio dropdown (Positions/Orders/Holdings/Analytics); date-range filter (1M/3M/6M/1Y/Custom), P&L-over-time chart, P&L by algo and by broker, daily P&L table |

## App shell (sidebar pages)
Positions/Orders/Holdings/Analytics etc. share a fixed 240px dark-gradient sidebar (logo, nav links, broker-connected status, SEBI reg footer) + topbar (page title, broker filter, refresh, user avatar) + body (summary cards row + white table card). Reuse this shell for remaining app pages (My Algos, Marketplace, Reports, Blogs, Help & Support). No standalone "Dashboard" page is planned — that topbar nav item has been removed everywhere; portfolio-wide stats live on the Analytics page instead, reached through the Portfolio dropdown alongside Positions/Orders/Holdings.

## Full page list still to design (from platform spec)
Home (algo catalog + compliance disclosures), Investor login/connect-broker, Blogs.

## Conventions
- Each page is a standalone Design Component (`.dc.html`), split-panel shell reused for auth pages, sidebar shell reused for app pages.
- Compliance/risk-disclosure microcopy appears in the form footer on every auth screen — keep it.
