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
| Positions | `Positions.dc.html` | Dashboard shell (sidebar nav + topbar) introduced here; summary cards, Open/Closed tabs, positions table |
| Orders | `Orders.dc.html` | Same dashboard shell; Pending/Executed/Cancelled tabs, buy/sell side coloring, Cancel action |
| Holdings | `Holdings.dc.html` | Same dashboard shell; summary cards, per-symbol day change + total P&L, Sell action |

## Dashboard shell (Positions/Orders/Holdings)
- Sidebar: logo, nav (Dashboard, Positions, Orders, Holdings, My Algos, Marketplace, Reports, Blogs, Help & Support), broker-connection status footer.
- Topbar: page title + subtitle, broker filter, refresh, account avatar.
- Algo tags reuse strategy accent colors (All Weather green, Growth Fund navy); P&L uses `#0A7A4A` (gain) / `#B54B3A` (loss), not pure red/green.
- Sidebar nav items link between the three `.dc.html` files directly (`href="Positions.dc.html"` etc.) for Play-mode navigation.

## Full page list still to design (from platform spec)
Home (algo catalog + compliance disclosures), Investor login/connect-broker, Main dashboard, My Algos, Algo Marketplace + algo detail (metrics, deploy), Reports, Blogs, Help & Support.

## Conventions
- Each page is a standalone Design Component (`.dc.html`), split-panel shell reused for auth pages.
- Compliance/risk-disclosure microcopy appears in the form footer on every auth screen — keep it.
