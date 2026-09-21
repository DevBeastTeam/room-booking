# 🚀 How to Deploy on Hostinger (Step-by-Step, To the Point)

---

### 📂 Frontend aur Backend Kahan Rakhna Hai? (Direct Connection Concept)

> **💡 Sab Se Zaroori Baat:** Aap ko Frontend aur Backend ko alag-alag server ya alag folders mein rakhne ki **bilkul zaroorat nahi hai**.
> 
> Jab aap `npm run build` chalate hain, to build command **Frontend (HTML/React)** aur **Backend (PHP/API)** dono ko ek hi folder **`dist/`** ke andar automatically pack kar deta hai.
> 
> Aap ko sirf **`dist` folder ka sara saman** Hostinger ke **`public_html`** folder mein upload karna hai!

#### Hostinger `public_html` ke andar ka structure aesa dikhega:
```text
public_html/
├── index.html              <-- Frontend (Home Page)
├── floor-plans/            <-- Frontend (Floor plans page)
├── amenities/              <-- Frontend (Amenities page)
├── _astro/                 <-- Frontend (React JS & CSS bundles)
├── .htaccess               <-- Connector (Frontend aur Backend ko jorta hai)
└── backend/                <-- Complete PHP Backend (Everything in ONE place)
    ├── api/                <-- All API Endpoints (contact.php, schedule.php, paddle.php, etc.)
    ├── config/.env         <-- Database Credentials & Password
    ├── config/database.php <-- Database Connection Helper
    └── migrations/         <-- Database Schema SQL File
```

> **📌 Important:** `api` ka folder bahir rakhne ki **bilkul zaroorat nahi hai**. Saari API files `backend/api/` ke andar hi rehti hain. `.htaccess` automatically kisi bhi `/api/` request ko `backend/api/` par route kar deta hai!

#### Yeh Direct Connect Kesy Hota Hai?
1. Koi Node.js server ya alag port chalane ki zaroorat nahi.
2. Visitor jab website par button dabata hai (e.g. Schedule Tour ya Contact Form), to Frontend React code seedha `/backend/api/contact.php` (ya `/api/contact.php`) ko request bhejta hai.
3. Hostinger ka Apache web server aur PHP us request ko execute karke MySQL Database mein data save kar dete hain.
4. **Result:** Frontend aur Backend 100% directly connect rehte hain!

---

### ⚡ Step 1: Local Machine Build (2 Minutes)

Apne computer terminal mein project folder ke andar yeh commands chalayein:

```bash
# 1. Production build generate karein:
npm run build

# 2. dist folder ke andar mojood tamaam files ko zip karein:
cd dist
zip -r ../deploy.zip . -x ".*"
cd ..
```
*(Ya manual: `dist` folder open karein, sari files select karein -> Right Click -> Compress/ZIP to `deploy.zip`)*

---

### 🗄️ Step 2: Hostinger Database Create & Import

1. **Hostinger Dashboard (hPanel)** login karein.
2. **Databases** -> **MySQL Databases** par jayein.
3. Naya Database aur User banayein:
   - **Database Name:** e.g., `u123456789_roombooking`
   - **Username:** e.g., `u123456789_admin`
   - **Password:** Koi bhi strong password set karein.
   - Click **Create**.
4. Wahi page par **Enter phpMyAdmin** button dabayein:
   - Left side se apna database select karein.
   - Top menu se **Import** par click karein.
   - **Choose File** dabayein aur project se `backend/migrations/001_initial_schema.sql` upload karke **Import** dabayein.

---

### 📤 Step 3: Files Upload to Hostinger

1. Hostinger mein **Files** -> **File Manager** open karein.
2. **`public_html`** folder ke andar jayein.
3. Top bar se **Upload** icon dabayein aur apni `deploy.zip` upload karein.
4. `deploy.zip` par right-click karein -> **Extract** -> destination path `public_html` hi rehne dain.
5. Extract hone ke baad `deploy.zip` delete kar dain.

---

### ⚙️ Step 4: Database Credentials Set Karein (`.env`)

1. Hostinger File Manager mein jayein:
   - File Path: `public_html/backend/config/.env`
2. `.env` file par right-click karke **Edit** karein:
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=u123456789_roombooking   # Step 2 wala exact DB Name
   DB_USER=u123456789_admin         # Step 2 wala exact DB Username
   DB_PASS=AapKaDatabasePassword    # Step 2 wala exact Password
   ```
3. Click **Save & Close**.

---

### 🐘 Step 5: PHP Version Check (PHP 8.2)

1. Hostinger Dashboard -> **Advanced** -> **PHP Configuration** par jayein.
2. PHP version **8.2** select karein aur **Update** dabayein.
3. Extensions tab mein verify karein ke `pdo_mysql`, `curl`, `mbstring` enabled hain (Hostinger par by default enabled hoti hain).

---

### ✅ Step 6: Website Test Karein

1. **Website Check:** Apni domain open karein:
   ```text
   https://yourdomain.com
   ```
   - Top right se **LIGHT / DARK** theme toggle test karein.
   - Floor plans, amenities aur modals check karein.

2. **Admin Panel Login:**
   ```text
   https://yourdomain.com/admin
   ```
   - **Username:** `dev` ya `dev@gmail.com`
   - **Password:** Aaj ki date ka number (e.g. aaj 21 tareekh hai to password: `21`).
   - Theme & Colors tab se colors manage karke Save karein.

3. **Database Check:**
   ```text
   https://yourdomain.com/database
   ```
   *(Yeh page MySQL live connection status confirm kar dega).*

---

### 🚨 Quick Troubleshooting

- **404 on API / Form Submit:** File Manager mein check karein ke `public_html/.htaccess` mojood hai.
- **Database Error:** `.env` mein Hostinger ka poora DB name check karein jisme prefix hota hai (e.g. `u123456789_name`).
