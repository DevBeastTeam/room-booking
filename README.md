# Monar Pass Apartments — Room & Apartment Booking Platform

A modern web application for a multifamily property: **Astro 5** (static output) + **React 19 islands** on the front, **PHP 8.2** modular REST backend, **MySQL** (PDO) for persistence, and **WorldFirst Pay** for rent/deposit/application-fee payments.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies (Bun is ~10x faster; npm works identically)
bun install          # or: npm install

# 2. Configure the backend
cp backend/config/.env.example backend/config/.env
$EDITOR backend/config/.env

# 3. Create the database schema + seed the demo inventory
npm run migrate      # php backend/migrations/migrate.php

# 4. Create the first resident portal login (optional)
php backend/migrations/seed_residents.php

# 5. Run the dev server
npm run dev          # → http://localhost:4321
```

The Astro dev server proxies `/backend` to a local PHP server. Run one in another terminal:

```bash
cd backend && php -S 127.0.0.1:8000
```

---

## 🗄️ Database

Backend uses **MySQL PDO** (`PDO::ATTR_EMULATE_PREPARES => false`, prepared statements everywhere).

| Setting | Value |
|---|---|
| Database | `roombookingdb` |
| Host / Port | `localhost` / `3306` |
| User / Password | `root` / `root` (dev) — set real values in `backend/config/.env` |

Every entity is written to **MySQL first** and mirrored to a JSON file under `backend/data/` as an offline fallback. If MySQL is unreachable the API keeps working from the JSON store.

**19 tables** — `inquiries`, `tours`, `floor_plans`, `units`, `maintenance_tickets`, `applications`, `site_settings`, `theme_config`, `transactions`, `residents`, `addons`, `email_logs`, `legal_pages`, `documents`, `notifications`, `chat_sessions`, `chat_messages`, `resident_accounts`, `resident_activity`.

---

## 🔐 Authentication & Roles

Two separate session systems:

**Staff (admin)** — `/admin/` and `/dev/`
- PHP session + HTTP-only cookie (`SameSite=Lax`, `Secure` on HTTPS)
- Roles: `super_admin` (developer) and `admin` (property staff)
- 13 server-side enforced tab permissions: `floorplans`, `units`, `applications`, `residents`, `maintenance`, `addons`, `emaillogs`, `livechat`, `support`, `pages`, `settings`, `theme`, `adminactivity`
- **Database Manager** (`/database/`) is `super_admin` only
- Brute-force protection: 8 failed attempts → 15-minute lockout (per username + IP)
- CSRF token issued on login/session, required on every mutating request
- All staff actions are written to `backend/data/admin_logs.json`

**Residents** — `/dashboard`
- Separate session namespace (`resident_accounts` table)
- Login by email + unit number + password
- A resident can only ever read/modify their own unit's data

### Super admin password

Set a strong password in `backend/config/.env`:

```ini
ADMIN_SUPER_PASSWORD=a-long-unique-password
```

The legacy "today's day number" password (`10` on the 10th) is **opt-in** via `ADMIN_ALLOW_DATE_PASSWORD=true` and is off by default — the day of the month is trivially guessable.

---

## 💳 WorldFirst Pay

`backend/api/worldfirst.php` (the legacy `paddle.php` endpoint forwards here).

- One-time payments: Application Fee **$50**, Holding Deposit **$250**, Pet Deposit **$300**
- Rent payments resolve the amount **server-side** from the unit's rent record — the client can never choose its own amount
- Optional auto-subscription (monthly, or a 3-day test cycle)
- Request signing uses the merchant **RSA private key** (`WORLDFIRST_PRIVATE_KEY`)
- Inbound webhooks are **signature-verified** against `WORLDFIRST_WEBHOOK_SECRET`; unsigned webhooks get HTTP 401
- In `live` mode a payment is only marked paid when the gateway confirms it; in `sandbox` mode the creator's per-transaction `verify_token` is required

---

## 📂 Project Structure

```text
room-booking/
├── backend/
│   ├── api/                  # 20 REST endpoints (modular, one concern each)
│   │   ├── _auth.php         # shared auth core: sessions, RBAC, CSRF, rate limit
│   │   ├── chat.php          # live chat (sessions + messages)
│   │   ├── resident.php      # resident portal auth + data
│   │   ├── data-manager.php  # super-admin seed / clear / export / import
│   │   └── worldfirst.php    # payment gateway
│   ├── config/               # database.php + .env (git-ignored, .htaccess-blocked)
│   ├── migrations/           # schema + migrate.php + seed_residents.php
│   └── data/                 # JSON fallback + runtime stores (web-blocked)
├── public/                   # static assets (logo.svg, favicon.svg, .htaccess)
├── src/
│   ├── components/           # React 19 islands
│   ├── config/themeConfig.js # dual light/dark theme system
│   ├── layouts/              # Astro base layout
│   ├── pages/                # 13 routes
│   └── services/             # apiClient, siteDataService, chatService, analytics
└── astro.config.mjs
```

---

## 🚀 Production Build

```bash
npm run build       # astro build && copies backend/ into dist/
```

`dist/` is what you upload to `public_html`. It contains the static site, the PHP backend, and the `.htaccess` files that block `.env`, `*.sql` and `backend/data/*` from being served.

See `deploy.md` for the Hostinger step-by-step and `features.md` for the full feature map.
