# Qode Algo Platform — Design Context

Retail algo-trading platform (RA/SEBI-registered), styled after Stratzy-type products. Users connect their own broker (Nuvama, iRage, Dhan) and subscribe to research-backed algos while retaining control of capital/execution.

## Design tokens (source of truth: official Qode colour palette + qodeinvest.com)
Every page defines the same `:root{...}` block in its `<style>` and uses `var(--token)` everywhere. Never hardcode hex/rgba in a page; add a token here first. Only exceptions: the Google logo colours and `fill=`/`stroke=` SVG attributes (literal hex of the same token).

**Brand (from palette doc, exact values):** `--forest #02422B` (primary), `--deep #002017` (primary), `--gold #DABD38` (secondary), `--cream #EFEDC3` (secondary), `--brand-green #00AE5B` (gradient start).
**Strategy colours (only for their own fund):** `--all-weather #008455`, `--growth #0A3452`, `--tactical #550E0E`.
**Gradients:** `--grad-brand` (#00AE5B → #002017, decorative/hero only; cream text on it fails contrast), `--grad-app` (#02422B → #002017, sidebar and auth panel).
**Neutrals (from qodeinvest.com):** `--page #F7F5E9`, `--white`, `--ink #1C2B26` (primary text), `--grey-12 #2D2F30` (secondary text), `--grey-10 #626567` (muted text), `--grey-9 #797D7F` (faint text), `--border #E5E7E9`, `--border-strong #D7DBDD` (inputs), `--grey-2 #ECF0F1` (dividers/segmented track), `--grey-1 #F8F9F9` (table header).
**Status:** `--gain #008455` (same hex as All Weather, used for numbers only), `--gain-on-dark #00AE5B`, `--loss #E7000B` (site destructive red).
**Tints (only these):** `--on-dark-tint` (cream .08), `--on-dark-line` (cream .15), `--on-dark-muted` (cream .6), `--gold-tint` (.16), `--forest-tint`, `--growth-tint`, `--gain-tint`, `--loss-tint`, `--loss-line`, `--scrim`.
Hover on forest buttons = `--deep`. Risk labels: Low = gain, Moderate = ink, High/Very High = loss.

**Typography:** Playfair Display (`--font-primary`) for headings and big numbers, Lato (`--font-secondary`) for everything else, including numbers in tables. Lato only exists at 400/700 (never write 500/600 for Lato). Roles: page title Playfair 600 22px `--forest`; section h2 Playfair 600 16px `--forest`; stat number Lato 700 24px; stat label Lato 400 12.5px uppercase, letter-spacing .04em; table/column header Lato 700 11.5px uppercase, .04em; body Lato 400 13-14px.
**Layout:** sidebar 240px; top nav 52px; content padding `28px 40px 48px`, section gap 24px; card radius 14px (tiles) / 16px (panels), border `1px solid var(--border)`; stat grid `minmax(170px,1fr)`; table rows `padding:16px 24px`, header `12px 24px`.
- Logo files: `assets/qode-logo-white.svg` (dark backgrounds), `assets/qode-logo.svg` (full color, light backgrounds)

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
| Reports | `Reports.dc.html` | Sidebar-shell app page; only P&L Statement (excl. fees), Holdings Statement and Trade Book report cards, recently generated table, footer |
| Help & Support | `Help & Support.dc.html` | Sidebar-shell app page; help articles, support ticket form, FAQ, footer |
| Marketplace | `Marketplace.dc.html` | Sidebar-shell app page; search bar + sort, sidebar filters (risk chips, strategy radios, underlying segmented control, min-allocation slider, quick-filter toggles), featured algo cards (Qode Yield Enhancer +/++) with 1M/3M/CAGR + Setup, compact all-algos table below |
| Algo Detail | `Algo Detail.dc.html` | Individual algo page for Qode Yield Enhancer +; tabs (Performance/Best & Worst/Monthly & Regime/About & Disclosures incl. Strategy details: portfolio type, market, instruments, leverage, strategies used, objective, risk controls, active UIDs, current deployment, inception date), sticky deploy card, weekday-picker Deploy modal, Share, Certificate PDF link |
| Algo Detail (YE++) | `Algo Detail - YE++.dc.html` | Same layout as Algo Detail, populated for Qode Yield Enhancer ++ (2x overlay, higher risk/return profile) |
| Portfolio | `Analytics.dc.html` | Sidebar-shell app page; reached via the sidebar menu and the topbar Dashboard link; header (inception/data-as-of), algo pill, PDF/Excel, Amount Invested / Current Value / Returns (Value-Percentage toggle), Trailing Returns & Drawdown table, performance + drawdown chart, Quarterly and Monthly P&L tables (% / ₹ toggle), Cash In/Out |
| Blogs | `Blogs.dc.html` | Sidebar-shell app page; "Qode Perspective" structure adapted from qodeinvest.com (category filters, hero QuickTake, QuickTakes/The Breakdown/The Quotient/Guides/Market Lens sections with article cards), newsletter subscribe, disclosure footer |
| Connect Broker | `Connect Broker.dc.html` | Standalone broker-connect page (Nuvama/iRage/Dhan grid cards with session validity, redirect on click \u2014 Dhan uses the real partner-login URL); consent-recorded note; Zoho CRM \"Request a callback\" handoff for investors without a broker account |

## App shell (sidebar pages)
Positions/Orders/Holdings/Analytics etc. share a fixed 240px dark-gradient sidebar (logo, icon menu on Portfolio/Positions/Orders/Holdings, broker-connected status, SEBI reg footer) + topbar (page title, broker filter, refresh, user avatar) + body (summary cards row + white table card). Reuse this shell for remaining app pages (My Algos, Marketplace, Reports, Blogs, Help & Support). No standalone "Dashboard" page is planned — that topbar nav item has been removed everywhere; portfolio-wide stats live on the Analytics page instead, reached through the Dashboard dropdown (formerly "Portfolio") alongside Positions/Orders/Holdings.

## Full page list still to design (from platform spec)
Home (algo catalog + compliance disclosures), Investor login/connect-broker, Blogs.

## Conventions
- Each page is a standalone Design Component (`.dc.html`), split-panel shell reused for auth pages, sidebar shell reused for app pages.
- Compliance/risk-disclosure microcopy appears in the form footer on every auth screen — keep it.
