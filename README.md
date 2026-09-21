# Monarch Pass Apartments - Room & Apartment Booking Platform

A high-performance modern web application built with **Astro 5**, **React 19 Islands**, **PHP 8.2 Backend**, **MySQL Database**, and **Paddle Payment Gateway (One-Time Payments)**.

---

## ⚡ Quick Start & Package Installation

Aap project ke packages **Bun** ya **npm** dono ke sath install kar sakte hain. Code aur framework (Astro + React) bilkul wahi rahega.

### Option 1: Fast Installation via Bun (Recommended - Super Fast 🚀)
Bun use karne se packages 10x-20x tez install hotay hain aur aapka qeemti time bachta hai:

```bash
# 1. Install all dependencies (Takes only 2-3 seconds):
bun install

# 2. Add any new package quickly:
bun add <package-name>
```

> **Note:** Bun sirf super-fast package downloading ke liye use hoga, aapka React + Astro code aur structure 100% same rahega.

---

### Option 2: Standard Installation via npm
Agar aap standard `npm` use karna chahte hain:

```bash
# 1. Standard install:
npm install

# Ya fast clean install (agar package-lock.json maujood ho):
npm ci

# Ya warnings/fuzool checks skip kar ke tez install:
npm install --prefer-offline --no-audit --no-fund
```

---

## 🗄️ Database Setup (MySQL)

Backend **MySQL PDO** use karta hai (`roombookingdb`).

1. Ensure MySQL (XAMPP / LAMPP ya local MySQL service) chalu hai:
   - Database Name: `roombookingdb`
   - Host: `localhost` (Port: 3306)
   - User: `root`
   - Password: `root` (Configured in `backend/config/.env`)

2. Run automated migration script jo automatically database, tables create karega aur initial inventory seed karega:
```bash
npm run migrate
# ya direct:
php backend/migrations/migrate.php
```

---

## 💻 Running Development Server

Aap dev server `npm` ya `bun` kisi se bhi start kar sakte hain:

```bash
# Using npm:
npm run dev

# Ya using bun:
bun dev
```

Browser mein open karein: `http://localhost:4321`

---

## 💳 Paddle Payment Gateway (One-Time Payments)

Project mein Paddle Billing v2 integrated hai strictly **One-Time Payments** ke sath (No recurring/auto-subscriptions).

- **Backend Handler:** `backend/api/paddle.php`
- **Config:** `backend/config/.env` (`PADDLE_API_KEY`, `PADDLE_CLIENT_SIDE_TOKEN`)
- **Frontend Modal:** `src/components/PaddleCheckoutModal.jsx`
- **Supported Items:**
  - Holding Deposit ($250.00 - One-time)
  - Application Fee ($50.00 - One-time)
  - First Month Rent ($909.00 - One-time)

---

## 📂 Project Structure

```text
room-booking/
├── backend/                  # PHP 8.2 Modular Backend
│   ├── api/                  # REST API endpoints (contact, schedule, paddle, floor-plans, etc.)
│   ├── config/               # database.php & .env configuration
│   ├── migrations/           # 001_initial_schema.sql & migrate.php
│   └── data/                 # JSON backup & fallback storage
├── public/                   # Public static assets (favicon.svg, robots.txt, .htaccess)
├── src/                      # Frontend Application
│   ├── components/           # React 19 Interactive Components (Modals, Checkout, Gallery)
│   ├── layouts/              # Astro Base Layouts
│   ├── pages/                # Astro Static / Hybrid Pages
│   └── services/             # siteDataService.js (API Connector)
├── package.json
└── README.md
```

---

## 🏗️ Production Build

```bash
npm run build
```
Build files `dist/` folder mein generate hongi jisme static HTML ke sath PHP backend aur API endpoints automatically deploy ready copy ho jate hain.
