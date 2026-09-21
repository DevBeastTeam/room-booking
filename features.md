# 📖 Monarch Pass Apartments - Complete Features & Architecture Documentation (`features.md`)

Yeh document **Monarch Pass Apartments** web platform ke tamam pages, client-side, resident user dashboard, admin panel, database schema aur management tools ki mukammal tafseelat (features & headings) faraham karta hai.

---

## 🌐 1. Public / Client Landing Pages (Frontend)

Platform par total **9 public pages** hain jo SEO optimized hain aur Astro 5 + React 19 Islands par run hotay hain:

### 🏠 Page 1: Home Page (`/` - `index.astro` & `HomeView.jsx`)
* **Hero Section:**
  - Headings: *"Find Your Perfect Home in Fort Worth"*, *"Spacious 1, 2, 3 & 4 Bedroom Apartments"*.
  - Live Actions: "Schedule a Tour", "View Floor Plans", "Explore 3D Virtual Tour", "Call Leasing Office".
  - Quick Search bar: Bedroom filter, Move-in date picker, Price range.
* **Community Highlights & Stats:**
  - 4 Unique Floor Plans, 84% Occupied, 4.8★ Resident Satisfaction, 24/7 On-Call Maintenance.
* **Featured Floor Plans Carousel:**
  - 1 to 4 Bedroom pricing cards ($898/mo to $1,209/mo) with "Check Availability" & "Instant Quote".
* **Community Amenities Showcase:**
  - Sparkling Swimming Pool, Modern Fitness Center, Resident Clubhouse, Pet-Friendly Bark Park, Playground, Covered Parking.
* **Interactive Neighborhood Preview:**
  - Proximity to Texas Wesleyan University, Downtown Fort Worth, Lake Arlington.
* **Resident Testimonials & Reviews:**
  - Verified resident feedback cards with star ratings.
* **Quick Inquiry Lead Capture:**
  - Direct form saving to MySQL `inquiries` table.

---

### 📐 Page 2: Floor Plans & Pricing (`/floor-plans` - `floor-plans.astro` & `FloorPlansView.jsx`)
* **Filter & Navigation Bar:**
  - Filters by Bedrooms (All, 1 Bed, 2 Bed, 3 Bed, 4 Bed), Bathrooms, Price range, Move-in urgency.
* **Interactive Floor Plan Viewer (`FloorPlanViewer.jsx`):**
  - High-res architectural layouts, 2D/3D floor diagrams, dimension specs (sqft).
* **Lease Term & Pricing Calculator (`CostBreakdown.jsx`):**
  - Flexible terms: 12 Months ($898 - $1,209), 10 Months, 6 Months with automatic pro-rated calculation.
  - Transparent fees breakdown: Base Rent, Trash ($15), Pest Control ($5), Parking ($35), Admin Fee ($150), Deposit ($250).
* **Individual Unit Inventory Grid (`UnitControls.jsx`):**
  - Unit #1002, #2104, #3505, #4101 with real-time status: `Available`, `Occupied`, `Under Maintenance`.
* **Reserve Unit & Paddle Checkout (`PaddleCheckoutModal.jsx`):**
  - One-time payment for Holding Deposit ($250) or Application Fee ($50) via Paddle Gateway.

---

### 🏊 Page 3: Amenities & Community Life (`/amenities` - `amenities.astro` & `AmenitiesView.jsx`)
* **Apartment Features Section:**
  - Fully Equipped Kitchens, Energy-Efficient Appliances, Walk-in Closets, Private Patios/Balconies, Central HVAC.
* **Community Amenities Section:**
  - Resort-Style Swimming Pool & Sundeck, 24-Hour Fitness Hub, Executive Business Center, Children's Play Area.
* **Pet Policy & Perks:**
  - Pet friendly guidelines, Dog park details, Pet rent ($20/mo) and one-time deposit details.

---

### 📸 Page 4: Photo Gallery (`/photos` - `photos.astro` & `PhotoGallery.jsx`)
* **Categorized Media Tabs:**
  - "All Photos", "Interiors", "Exteriors & Grounds", "Amenities & Pool", "Floor Plan Models".
* **Interactive Lightbox Viewer:**
  - Full-screen HD viewer, keyboard arrows navigation, zoom, high-res captions.

---

### 🕶️ Page 5: 3D Virtual Tour (`/virtual-tour` - `virtual-tour.astro` & `VirtualTourView.jsx`)
* **Interactive 360 Walkthrough Viewer:**
  - Simulated 3D tour player with room switcher (Living room, Master bedroom, Kitchen, Patio).
* **Floor Plan Quick Selector:**
  - Switch between 1-Bedroom (614 sqft), 2-Bedroom (769 sqft), 3-Bedroom (920 sqft), 4-Bedroom (1,077 sqft).

---

### 🗺️ Page 6: Neighborhood & Interactive Map (`/map` - `map.astro` & `MapDirectionsView.jsx`)
* **Google Maps Embed & Directions:**
  - Exact property pin: `4500 Campus Dr, Fort Worth, TX 76119`.
* **Points of Interest Categories:**
  - 🎓 Schools & Higher Education: Texas Wesleyan University, Tarrant County College.
  - 🛒 Shopping & Groceries: Renaissance Square, Walmart Supercenter.
  - 🌳 Parks & Recreation: Cobb Park, Lake Arlington, Fort Worth Zoo.
  - 🏥 Healthcare & Emergency: JPS Health Network, Baylor Scott & White.

---

### 📊 Page 7: Income Guidelines & Qualification (`/income-guidelines` - `IncomeGuidelines.jsx`)
* **Affordable Housing & AMI Guidelines:**
  - Fort Worth Area Median Income (AMI 60% & 80%) qualifications explanation.
* **Interactive Eligibility Calculator:**
  - Household Size selector (1 to 8 Persons).
  - Maximum Annual Income limits table ($41,400 to $78,050).
  - Minimum monthly gross income (2.5x to 3x rent).
* **Application Checklist:**
  - Required documents: Government Photo ID, 3 months paystubs, W-2 forms, rental history verification.

---

### ❓ Page 8: FAQ (`/faq` - `faq.astro` & `FAQView.jsx`)
* **Categorized Accordion Sections:**
  - Application & Lease Process, Rent Payments & Fees, Pet Guidelines, Parking & Storage, Maintenance Requests.
* **Instant Search & Filter:**
  - Live query box to instantly highlight matching answers.

---

### 📞 Page 9: Contact Us & Schedule Tour (`/contact` - `ContactUsView.jsx`)
* **Contact & Tour Booking Form:**
  - Prospect Name, Email, Phone, Preferred Floor Plan, Desired Move-in Date, Message.
  - Saves in real-time to MySQL `inquiries` and `tours` tables.
* **Property Information Sidebar:**
  - Direct Phone: `+1 817-857-8782`, Email: `leasing@monarchpassapts.com`.
  - Office Hours: Mon-Fri 10am-6pm, Sat 10am-5pm, Sun 1pm-5pm.
  - Turn-by-turn driving directions.

---

## 👤 2. Resident / User Portal Dashboard (`/dashboard`)

Dedicated portal for apartment residents with **7 interactive sections**:

1. **📊 Overview:**
   - Resident greeting card (e.g. *Sarah Johnson - Unit #2104*).
   - "Good Standing" status badge.
   - Current Rent Due card ($967/mo due in 12 days).
   - Active maintenance ticket counter & quick shortcut buttons.
2. **📑 My Lease:**
   - Unit details: Unit #2104 (Two Bedroom, 2 Bed / 1 Bath, 769 sqft).
   - Lease Start Date, Lease Expiration Date, Lease Term (12 Months).
   - Security Deposit recorded: $250.
   - Comprehensive rent breakdown (Base Rent $909 + Trash $15 + Pest $5 + Carport $35 + Washer/Dryer $40).
3. **💳 Payments & Paddle Gateway:**
   - **One-Time Pay via Paddle Button:** Allows resident to pay current month rent ($909) securely via Paddle Billing v2.
   - Payment History table: Month, Amount, Date, Payment Method (Online, Paddle, Auto-pay), Status (Paid, Late).
4. **🔧 Maintenance Service Requests:**
   - "Submit New Work Order" interactive modal (Category: HVAC, Plumbing, Electrical, Appliances; Priority: Low, Medium, High, Emergency).
   - Live tickets tracking board with real-time status: `pending`, `in-progress`, `completed`.
5. **📦 Add-ons & Amenities Management:**
   - Reserved Covered Carport ($35/mo) - Toggle Active / Cancel.
   - Extra Storage Locker ($45/mo) - Request Locker.
   - In-Unit Washer & Dryer Set ($40/mo) - Toggle Active.
6. **📁 Documents & Records:**
   - View & Download PDF simulations: Lease Agreement 2025–2026, Move-In Inspection Report, Community Rules, Renters Insurance Policy.
7. **🔔 Community Notifications:**
   - Real-time notice feed: Rent due reminders, maintenance completion alerts, pool maintenance schedules.

---

## ⚙️ 3. Admin Panel / Property CMS (`/admin`)

Comprehensive property management suite with **12 complete modules**:

1. **📈 Overview & Property Analytics:**
   - KPI metrics: Occupancy Rate (84%), Total Monthly Revenue ($48,900), Active Residents (112), Open Maintenance Tickets (3).
   - 6-Month Revenue trends bar chart.
   - Recent inquiries and pending applications quick widgets.
2. **🏢 Floor Plans Manager:**
   - Live editor for 1-Bed, 2-Bed, 3-Bed, and 4-Bed models.
   - Modify Base Rents (12m, 10m, 6m), Security Deposit, Total Units, and Occupied count.
3. **🚪 Units Inventory Management:**
   - Tabular list of all physical units (#1002, #2104, #3505, #4101, etc.).
   - Edit unit status: `Available`, `Occupied`, `Maintenance`, `Reserved`.
   - Assign tenant name, rent override, and move-in dates.
4. **📝 Applications Review Workflow:**
   - Application queue (`APP-001` to `APP-005`).
   - Review Applicant Name, Desired Unit, Monthly Income, Credit Score.
   - One-click Actions: **Approve**, **Reject**, or Mark as **Pending**.
5. **👥 Residents Directory:**
   - Complete tenant directory with Unit number, Lease End dates, Monthly Rent, and Status (`Current`, `Notice Given`).
6. **🔧 Maintenance Work Order Board:**
   - Filter tickets by status: All, Pending, In Progress, Completed.
   - Category tags: HVAC, Plumbing, Electrical, Appliance, Turnover.
   - Priority indicators: High (Red), Medium (Amber), Low (Blue).
   - Update ticket status and technician notes.
7. **📦 Add-ons & Extras Control:**
   - Set monthly rates for Covered Carports, Storage Units, and In-Unit Washers.
   - View total active subscriptions.
8. **✉️ Email Notification Logs:**
   - Audit trail of automated emails sent to prospects and tenants (Tour confirmations, payment receipts, maintenance updates).
9. **💬 Contact Support & Leads CRM:**
   - View prospect inquiries submitted via website forms.
   - Filter by status: `New`, `In-Progress`, `Resolved`.
   - Add internal staff notes and follow-up logging.
10. **📜 Pages & Legal CMS:**
    - Live content editor for **Terms & Conditions**, **Privacy Policy**, and **Accessibility Statement**.
    - Rich text editing, last updated date tracker, and one-click save.
11. **⚙️ Site Settings CMS:**
    - Property Name, Tagline, Phone, Secondary Phone, Leasing Email, Support Email.
    - Physical Street Address, City, State, Zip Code.
    - Office Hours (Mon-Fri, Sat, Sun).
    - Social Media Links (Facebook, Instagram).
    - Resident & Applicant External Portal URLs.
12. **🎨 Theme & Colors Live Styler (`themeConfig.js`):**
    - Live Color Picker: Primary Accent Color, Secondary Color, Dark Mode Card tones.
    - 6 Pre-configured Designer Themes: *Emerald Teal (Default)*, *Navy Prestige*, *Sunset Luxury*, *Rose Gold*, *Midnight Amber*, *Forest Green*.
    - AI-Powered Harmonious Palette Generator.
    - Instant preview across the live website.

---

## 🗄️ 4. Database Import / Export & Dummy Data Manager (`/database`)

Dedicated administrative dashboard to seed, format, export, and import database tables modularly:

* **Modular Card Selection:**
  - Har table ka alag card: Floor Plans, Units, Applications, Residents, Maintenance Tickets, Add-ons, Email Logs, Inquiries, Tours, Site Settings, Theme Config, Legal Pages, Documents, Notifications, Paddle Transactions.
* **Multi-Select & Bulk Controls:**
  - "Select All" aur "Deselect All" buttons.
  - Multi-select checkboxes for granular control.
* **Modular Actions:**
  1. **Seed Dummy Data (Selected Only):** Selected cards mein fresh, realistic demo data daalta hai.
  2. **Format / Clear Tables (Selected Only):** Selected tables ko wipe/truncate karta hai bina baaqi tables ko chede.
  3. **Export to JSON (Selected Only):** Selected tables ka data `.json` file ke taur par download karta hai.
  4. **Import from JSON:** Kisi bhi exported JSON file ko database mein restore karta hai.
  5. **Reset Entire Database to Default Demo State:** 1-Click complete reset.

---

## 💾 5. MySQL Database Tables Schema Summary

| # | Table Name | Purpose | Key Fields |
|---|---|---|---|
| 1 | `floor_plans` | Floor plans specs & pricing | `slug`, `name`, `beds`, `baths`, `sqft`, `price_12m`, `price_10m`, `price_6m`, `deposit` |
| 2 | `units` | Physical apartment inventory | `unit_number`, `floor_plan_slug`, `beds`, `floor`, `rent`, `status`, `tenant_name` |
| 3 | `applications` | Prospect lease applications | `app_id`, `applicant_name`, `floor_plan_slug`, `income`, `credit_score`, `status` |
| 4 | `residents` | Current and past tenants | `name`, `email`, `phone`, `unit_number`, `lease_start`, `lease_end`, `rent`, `status` |
| 5 | `maintenance_tickets` | Work orders and repairs | `ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status` |
| 6 | `addons` | Extra rentable amenities | `addon_key`, `name`, `price`, `active_count`, `icon` |
| 7 | `email_logs` | Sent email transaction logs | `recipient`, `subject`, `template`, `status`, `sent_at` |
| 8 | `inquiries` | Lead capture & contact forms | `tracking_id`, `name`, `email`, `phone`, `category`, `message`, `status` |
| 9 | `tours` | Scheduled property visits | `tracking_id`, `name`, `email`, `phone`, `tour_date`, `tour_time`, `tour_type`, `status` |
| 10 | `site_settings` | Global CMS site configuration | `setting_key`, `setting_value` (JSON) |
| 11 | `theme_config` | Visual styling & color palettes | `theme_key`, `theme_data` (JSON) |
| 12 | `legal_pages` | Terms, Privacy & Accessibility | `slug`, `title`, `last_updated`, `content` |
| 13 | `documents` | Downloadable tenant documents | `name`, `category`, `file_size`, `doc_date`, `file_url`, `unit_number` |
| 14 | `notifications` | User alerts & notices | `user_unit`, `type`, `message`, `time_text`, `is_read` |
| 15 | `transactions` | Paddle one-time payment orders | `txn_id`, `paddle_order_id`, `user_name`, `user_email`, `amount`, `status` |

---

## 🔒 6. Security & Payment Safeguards

1. **Paddle Billing v2 (One-Time Payments Only):**
   - `billing_cycle => null` explicitly set in Paddle checkout creation. No auto-renewal, no recurring subscriptions.
2. **Direct Download Protection:**
   - `backend/config/.env`, `backend/migrations/*.sql`, and `backend/data/*.json` are protected via Apache `.htaccess` (`Deny from all`) and `.gitignore`.
3. **Database Security:**
   - PDO Prepared statements used across all API endpoints with parameterized queries to prevent SQL Injection.
