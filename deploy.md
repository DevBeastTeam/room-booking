# 🚀 Monarch Pass Apartments — Complete Deployment Guide (`deploy.md`)

Yeh documentation Monarch Pass room/apartment booking platform ko **cPanel**, **Shared Hosting**, ya kisi bhi **Apache/PHP/MySQL** server par upload aur live karne ke mukammal step-by-step tareeqay ko describe karti hai.

---

## 📑 Table of Contents
1. [Platform Architecture & Requirements](#1-platform-architecture--requirements)
2. [Step 1: Local Production Build](#2-step-1-local-production-build)
3. [Step 2: Database Setup in cPanel (MySQL & phpMyAdmin)](#3-step-2-database-setup-in-cpanel-mysql--phpmyadmin)
4. [Step 3: Server Environment Configuration (.env)](#4-step-3-server-environment-configuration-env)
5. [Step 4: Uploading Files to cPanel (File Manager / FTP)](#5-step-4-uploading-files-to-cpanel-file-manager--ftp)
6. [Step 5: File Permissions & Security Configuration](#6-step-5-file-permissions--security-configuration)
7. [Step 6: Admin Panel Login & Verification Checklist](#7-step-6-admin-panel-login--verification-checklist)
8. [Step 7: Paddle Payment Gateway Live Switch](#8-step-7-paddle-payment-gateway-live-switch)
9. [Troubleshooting & Common Issues](#9-troubleshooting--common-issues)

---

## 1. Platform Architecture & Requirements

### Tech Stack Overview
- **Frontend Architecture:** Astro 5 Static Multi-Page (12 SEO-indexed pre-rendered HTML routes)
- **Interactive Islands:** React 19 (Paddle checkout modal, Light/Dark theme switcher, interactive cost breakdown, virtual tours)
- **Backend API:** PHP 8.1+ / 8.2+ Modular REST Endpoints (`backend/api/` and `api/`)
- **Database:** MySQL 5.7+ / 8.0+ or MariaDB 10.3+ with PDO extension
- **Styling:** Vanilla CSS luxury design system with runtime CSS variables

### Server Prerequisites
| Requirement | Recommended Version | Minimum Version | Notes |
|---|---|---|---|
| **Web Server** | Apache 2.4+ / LiteSpeed | Apache 2.2+ | `mod_rewrite`, `mod_headers`, `mod_expires`, `mod_deflate` enabled |
| **PHP Version** | **PHP 8.2** | PHP 8.1 | Extensions: `pdo_mysql`, `curl`, `json`, `mbstring`, `openssl` |
| **Database** | MySQL 8.0 / MariaDB 10.5 | MySQL 5.7 | UTF8mb4 charset support |
| **SSL Certificate** | Let's Encrypt / AutoSSL | Any valid SSL | Required for HTTPS and Paddle payment checkout |

---

## 2. Step 1: Local Production Build

Aap apne local system par production-ready build generate karein.

### 1. Dependencies install karein:
```bash
# Using Bun (Super Fast):
bun install

# Ya using npm:
npm install
```

### 2. Production build command chalayein:
```bash
# Using npm:
npm run build

# Ya using Bun:
bun run build
```

### 3. Build Output Structure (`dist/` Folder)
Build complete hone ke baad project ke root mein `dist/` folder tayyar hoga:
```text
dist/
├── .htaccess                 <-- Apache rewrite rules, Gzip compression & security
├── _astro/                   <-- Bundled CSS, JS components, Google fonts
├── admin/index.html          <-- Admin Panel
├── amenities/index.html      <-- Amenities page
├── contact/index.html        <-- Contact Us page
├── dashboard/index.html      <-- Resident portal demo
├── database/index.html       <-- Database GUI status
├── faq/index.html            <-- FAQ Knowledge base
├── floor-plans/index.html    <-- Floor plans & cost estimator
├── income-guidelines/        <-- Income qualification table & calculator
├── index.html                <-- Homepage with cinematic hero & search
├── map/index.html            <-- Location & directions
├── photos/index.html         <-- 26-Photo high-res gallery
├── virtual-tour/index.html   <-- 360° virtual tour
├── sitemap-index.xml         <-- Googlebot XML Sitemap
├── robots.txt                <-- Search engine crawling directives
├── api/                      <-- Standalone REST API endpoints
└── backend/                  <-- Modular PHP core, config, & migrations
    ├── api/                  <-- PHP API controllers (contact, schedule, paddle, etc.)
    ├── config/               <-- database.php & .env (Credentials)
    └── migrations/           <-- 001_initial_schema.sql
```

### 4. Deploy Zip tayyar karein:
`dist/` folder ke **andar ke tamam files aur folders** ko zip karein:
```bash
# Linux / macOS terminal:
cd dist && zip -r ../deploy.zip . -x ".*" -x "__MACOSX" && cd ..

# Ya manual: dist folder ke andar jayein, Select All -> Right click -> Compress to ZIP
```
> **⚠️ IMPORTANT:** Zip banate waqt `dist` folder ko zip nahi karna, balke **`dist` ke andar mojood tamam files** (including `.htaccess`) ko zip karna hai.

---

## 3. Step 2: Database Setup in cPanel (MySQL & phpMyAdmin)

### 1. cPanel mein Database banayein:
1. cPanel mein login karein (`https://yourdomain.com:2083`).
2. **Databases** section mein **MySQL Databases** ya **MySQL Database Wizard** par click karein.
3. Naya database banayein (e.g., `u123456_roombooking`).
4. Naya database user banayein (e.g., `u123456_dbuser`) aur strong password set karein.
5. User ko Database se link karein aur **ALL PRIVILEGES** check kar ke **Make Changes** karein.

> **💡 Note:** cPanel hamesha username prefix lagata hai (e.g., `username_dbname`). Poora naam copy karein!

### 2. SQL Schema Import karein:
1. cPanel main page par wapas ja kar **phpMyAdmin** open karein.
2. Left sidebar se apna naya database select karein (`username_roombooking`).
3. Top navigation mein **Import** tab par click karein.
4. **Choose File** dabayein aur project se yeh file select karein:
   ```text
   backend/migrations/001_initial_schema.sql
   ```
5. Neechay **Import** button par click karein.
6. Tamam zaroori tables create ho jayenge:
   - `floor_plans` (4 luxury models pre-seeded: Aventine, Cortesia, Bravada, Palacio)
   - `units` (Individual apartments inventory with status, deposit, and floor numbers)
   - `inquiries` (Contact messages & tour booking requests)
   - `applications` (Rental applications)
   - `paddle_transactions` (Verified one-time payment receipts)
   - `site_settings` (Dynamic site options & contact numbers)

---

## 4. Step 3: Server Environment Configuration (`.env`)

Upload karne se pehle (ya cPanel File Manager mein upload ke baad) `backend/config/.env` file ko update karein:

File path: `backend/config/.env` (ya `dist/backend/config/.env`):

```ini
# ==============================================================================
# Monarch Pass Apartments - Production Environment Configuration
# ==============================================================================

# Database Configuration (cPanel MySQL details)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_roombooking     # Aapka cPanel database name
DB_USER=cpaneluser_dbuser          # Aapka cPanel database username
DB_PASS=YourStrongPasswordHere     # Aapka cPanel database user password
DB_CHARSET=utf8mb4

# Leasing Office Notification Email
LEASING_EMAIL=leasing@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com

# Paddle Payment Gateway Settings (One-Time Checkout)
# Sandbox testing ke liye 'sandbox', Live payments ke liye 'live'
PADDLE_ENVIRONMENT=sandbox
PADDLE_VENDOR_ID=333354
PADDLE_API_KEY=pdl_ntfset_your_paddle_api_key_here
PADDLE_CLIENT_SIDE_TOKEN=test_your_client_side_token_here
PADDLE_CURRENCY=USD

# Default Reservation Fees (USD)
FEE_APPLICATION=50.00
FEE_HOLDING_DEPOSIT=250.00
FEE_PET_DEPOSIT=300.00
```

---

## 5. Step 4: Uploading Files to cPanel (File Manager / FTP)

### Method A: cPanel File Manager (Recommended - Fastest ⚡)
1. cPanel mein login karein aur **File Manager** open karein.
2. Document Root directory mein jayein:
   - Agar primary domain hai: `public_html/`
   - Agar subdomain ya addon domain hai: `public_html/subdomain/`
3. Top bar se **Upload** par click karein.
4. Apni tayyar shuda `deploy.zip` file drag & drop karein.
5. Upload 100% complete hone ke baad File Manager par wapas aayein.
6. `deploy.zip` par right click karein aur **Extract** select karein.
7. Extract hone ke baad `deploy.zip` ko delete kar dain space bachane ke liye.
8. Top right par **Settings** icon par click karein aur **"Show Hidden Files (dotfiles)"** tick kar ke Save karein, taake `.htaccess` aur `.env` nazar aate rahein.

### Method B: FTP / SFTP (FileZilla)
1. FileZilla open karein aur cPanel FTP credentials enter karein.
2. Remote site side par `public_html/` directory open karein.
3. Local side par project ka `dist/` folder open karein.
4. `dist/` ke andar mojood tamam files aur folders ko select karke `public_html/` mein upload kar dain.

---

## 6. Step 5: File Permissions & Security Configuration

File Manager mein verify karein ke permissions durust hain:
- **Tamam Folders / Directories:** `755` (`drwxr-xr-x`)
- **Tamam Files:** `644` (`-rw-r--r--`)

### Security Protection Verification:
System mein double-layer protection pehle se integrated hai:
1. `public_html/.htaccess` contains:
   - Gzip & Brotli automatic HTTP compression
   - 1-Year browser caching headers for web fonts, WebP images, and SVG
   - Security headers (`X-Content-Type-Options: nosniff`, `X-XSS-Protection`)
   - Transparent API rewrite: `/api/*` -> `backend/api/*`
2. `public_html/backend/.htaccess` contains:
   - Direct downloads of `.env`, `.sql`, aur `.json` files are blocked (`Require all denied`). Koi bhi visitor browser se `https://yourdomain.com/backend/config/.env` download nahi kar sakta.

---

## 7. Step 6: Admin Panel Login & Verification Checklist

### 1. Developer / Admin Panel Login (`/admin`):
Browser mein open karein:
```text
https://yourdomain.com/admin
```

Aap ke samne secure **Developer & Staff Authentication Gate** aayega:

| Field | Value |
|---|---|
| **Email / Username** | `dev` ya `dev@gmail.com` |
| **Password** | **Current Date of Day** (Aap jis din login kar rahe hon, us din ki date ka number). <br> *Misaal:* Agar aaj 21 tareekh hai to password: `21`. Agar kal 22 tareekh ho to password: `22`. |

### 2. Admin Panel Features to Test:
- **Theme & Colors Manager:**
  - `🌙 Dark Mode Palette` aur `☀️ Light Mode Palette` ke colors change karein.
  - "Save All Palettes to Website" dabayein aur check karein ke live website par instant update hota hai.
- **Floor Plans & Units Inventory:**
  - Real-time pricing aur available units update karein.
- **Inquiries & Tour Bookings:**
  - Contact form se aane wale messages aur tour requests check karein.
- **Database Status GUI (`/database`):**
  - MySQL live connection status verify karein.

---

## 8. Step 7: Paddle Payment Gateway Live Switch

Jab aap Sandbox testing complete kar lein aur real payments accept karne ke liye ready hon:

1. Paddle Dashboard (`https://vendors.paddle.com/`) mein login karein.
2. **Developer Tools -> Authentication** se:
   - Live **Vendor ID** copy karein.
   - Live **API Key** generate karein.
   - Live **Client-Side Token** copy karein.
3. Server par `backend/config/.env` file edit karein:
   ```ini
   PADDLE_ENVIRONMENT=live
   PADDLE_VENDOR_ID=123456
   PADDLE_API_KEY=pdl_live_apikey_...
   PADDLE_CLIENT_SIDE_TOKEN=live_client_token_...
   ```
4. Save karein. Ab holding deposits ($250.00) aur application fees ($50.00) real credit cards se process hongi.

---

## 9. Troubleshooting & Common Issues

### ❌ Problem 1: API requests (`/api/contact.php` ya `/api/floor-plans.php`) 404 error de rahi hain
- **Cause:** Apache `mod_rewrite` enable nahi hai ya `.htaccess` file upload nahi hui.
- **Solution:** 
  1. cPanel File Manager mein Settings -> "Show Hidden Files" enable karein aur dekhein ke `public_html/.htaccess` mojood hai.
  2. Verify karein ke `.htaccess` mein yeh line maujood hai:
     ```apache
     RewriteRule ^api/(.*)$ backend/api/$1 [L,QSA]
     ```

### ❌ Problem 2: "Database connection failed" ya blank data
- **Cause:** Database name, username ya password mein ghalti hai.
- **Solution:**
  1. cPanel mein database aur user ka **full prefix name** check karein (e.g., `username_roombooking`, na ke sirf `roombooking`).
  2. `backend/config/.env` mein `DB_NAME`, `DB_USER`, `DB_PASS` update karein.
  3. Browser mein check karein: `https://yourdomain.com/database` (yeh page live status show karega).

### ❌ Problem 3: White Screen ya HTTP 500 Internal Server Error
- **Cause:** PHP version 8.0 se purani hai ya koi required PHP extension off hai.
- **Solution:**
  1. cPanel mein **Select PHP Version** ya **MultiPHP Manager** open karein.
  2. PHP version ko **8.2** ya **8.1** par set karein.
  3. **Extensions** tab mein `pdo_mysql`, `curl`, `json`, `mbstring`, aur `openssl` ko tick/enable karein.

### ❌ Problem 4: Light Mode switch karne par purane colors dikhna
- **Solution:**
  Browser ka cache clear karein (`Ctrl + Shift + R` / `Cmd + Shift + R`), kyunke website high-speed caching headers use karti hai.

---

## 🎯 Verification Checklist (Final Sign-off)

- [ ] `https://yourdomain.com/` (Home page loads in < 1 second)
- [ ] Header top bar mein `LIGHT` / `DARK` toggle button perfectly working
- [ ] Floor plans list aur interactive cost estimator working
- [ ] Schedule Tour modal appointment book kar raha hai
- [ ] Contact Support form inquiry successfully submit kar raha hai
- [ ] Paddle Holding Deposit checkout modal open ho raha hai
- [ ] `/admin` par Developer login (`dev` / date of day) work kar raha hai
- [ ] `/database` page shows active MySQL connection
- [ ] SEO Googlebot sitemap accessible at `https://yourdomain.com/sitemap-index.xml`
