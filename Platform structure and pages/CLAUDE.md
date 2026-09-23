# Qode Algo Platform — Design Context

Retail algo-trading platform (RA/SEBI-registered), styled after Stratzy-type products. Users connect their own broker (Nuvama, iRage, Dhan) and subscribe to research-backed algos while retaining control of capital/execution.

## Brand palette (from Qode Brand Colour Palette doc)
- Primary — Forest Green `#02422B`
- Primary — Deep Forest `#002017`
- Secondary — Golden Yellow `#DABD38`
- Secondary — Cream `#EFEDC3`
- Page background used in mocks: `#FAF7EC` (lighter cream)
- Strategy accent colors (not core UI): All Weather green `#008455`, Growth Fund navy `#0A3452` — reserved for algo/strategy branding, not chrome
- Type: Fraunces (serif, headlines) + Inter (sans, body/UI)
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
| Reports | `Reports.dc.html` | Sidebar-shell app page; FY summary cards, report-type grid (Tax P&L/Contract Notes/Ledger/Holdings/Trade Book/Algo Performance) with PDF/CSV download, recently-generated table; sidebar panel shows recent downloads instead of watchlist |
| Help & Support | `Help & Support.dc.html` | Sidebar-shell app page; help-article grid, live support ticket form (name/email/category/subject/message) that submits to a confirmation state with a generated ticket ID, FAQ list; sidebar panel shows contact info + popular topics |

## App shell (sidebar pages)
Positions/Orders/Holdings/My Algos/Profile/Reports/Help & Support share a fixed 240px dark-gradient sidebar (logo, page-specific panel content, broker-connected status, SEBI reg footer) + top nav bar (Dashboard/Portfolio dropdown/My Algos/Marketplace/Reports/Blogs/Help & Support) + topbar (page title, contextual filter, user avatar linking to Profile) + body (summary cards row + white content card). The sidebar's collapsible panel content is page-specific (Positions/Orders/Holdings: watchlist; Profile: profile completion + quick links; Reports: recent downloads; Help & Support: contact info + popular topics) — never the old full nav-link list. Dashboard, Marketplace and Blogs are not built yet, so their nav links stay `href="#"`.

## Full page list still to design (from platform spec)
Home (algo catalog + compliance disclosures), Investor login/connect-broker, Main dashboard, Algo Marketplace + algo detail (metrics, deploy), Blogs.

## Conventions
- Each page is a standalone Design Component (`.dc.html`), split-panel shell reused for auth pages, sidebar shell reused for app pages.
- Compliance/risk-disclosure microcopy appears in the form footer on every auth screen — keep it.
