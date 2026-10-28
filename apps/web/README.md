# QuickLabz - HealthTech Digital Pathology Marketplace

> **"Blood Tests, From the Comfort of Home."**  
> Official Website: [https://quicklabzz.netlify.app](https://quicklabzz.netlify.app)  
> Helpline / WhatsApp: **+91 7018623940** | Email: **quicklabzofficial@gmail.com**

QuickLabz is a modern Indian B2C HealthTech / Digital Pathology marketplace that enables patients to browse pathology blood tests, compare accredited partner laboratories, select their preferred processing lab, book doorstep sample collection by certified phlebotomists, track sample progress in real-time, and access cryptographically verified digital reports.

---

## 🏥 Marketplace Philosophy & Statutory Clarity

1. **Pure Digital Marketplace**: QuickLabz is a technology facilitator connecting patients with independent, certified diagnostic laboratories and trained phlebotomists.
2. **Not a Diagnostic Laboratory**: QuickLabz does **not** claim to perform laboratory tests itself. All pathology assays are processed by verified partner laboratories.
3. **No Fake Claims**: No fabricated medical claims, doctor credentials, customer numbers, or disease guarantees.
4. **Data Isolation & Business Rule**: Lab wholesale base costs and QuickLabz gross margins are strictly isolated from customer-facing interfaces and APIs.

---

## 🎨 Brand Design System

- **Primary Blue**: `#1663F5` (Dominant brand accent)
- **Secondary Orange**: `#FF7A1A` (Action / CTAs)
- **Light Surface**: `#F5F7FF`
- **Dark Text**: `#0F172A`
- **Muted Text**: `#6B7280`
- **Border**: `#E5E7EB`
- **Typography**: Inter (Body) & Poppins (Headings)

---

## 🚀 Key Modules & Architecture

### 1. Public Marketplace & Test Catalog
- **Searchable 28+ Test Catalog**: Categorized across Diabetes, Thyroid, Vitamins, Blood Tests, Liver, Kidney, Lipid, Infection, Hormonal, Urine, and Cardiac.
- **Fasting Preparation Warnings**: Automatic tagging of fasting-required tests (e.g. 10-12h for FBS/Lipid) with clinical guidelines.
- **Partner Laboratory Directory**: Compare nearby laboratories, distance, turnaround times, and verified ratings.
- **Curated Preventive Packages**: Featuring the **Full Body Health Package (₹2999)** with 75+ parameters.
- **Location & Service Area Checker**: 6-digit PIN code checker with waitlist lead capture for non-served zones.

### 2. 6-Step Doorstep Booking Engine
1. **Patient Demographics**: Name, age, gender, mobile, email.
2. **Doorstep Address**: House/flat, street, area, city, PIN code, landmark.
3. **Test Confirmation**: Review selected test / health package.
4. **Lab Choice**: Choose preferred processing laboratory.
5. **Collection Slot**: Fasting morning windows (6:00 AM - 10:00 AM) or flexible slots.
6. **Referral Attribution & Healthcare Consent**: Mandatory data consent checkbox + instant referral validation.
7. **Confirmation**: Unique identifier (e.g. `QLZ-2026-00001`).

### 3. Live 9-Stage Status Tracking
Visual timeline tracking every step of the diagnostic lifecycle:
`Booking Received` ➔ `Lab Confirmed` ➔ `Collector Assigned` ➔ `Collection Scheduled` ➔ `Sample Collected` ➔ `Sample Received at Lab` ➔ `Testing in Progress` ➔ `Report Ready` ➔ `Report Delivered`.

### 4. Four Role-Based Dashboards & Portals
- **Patient Portal (`/dashboard`)**: Upcoming & past bookings, report vault, saved addresses.
- **Admin Command Center (`/admin`)**: Executive revenue metrics, gross margin tracking, dynamic test price editor (change selling & wholesale prices on the fly without code changes), referral commission payouts, partner lab management.
- **Partner Lab Portal (`/lab-portal`)**: Lab-specific accession queue, update test progress, sign off & upload digital reports, monthly wholesale settlements.
- **Phlebotomist Mobile Portal (`/collector-portal`)**: Mobile-first card UI for phlebotomists, route list, Google Maps navigation link, click-to-call patient, one-tap status updates ("On the Way", "Sample Collected", "Unable to Collect").

### 5. Fixed Referral Commission Engine
Built-in partner referral codes (`CLINIC001`, `MEDICAL001`, `DOC002`) with configurable admin slabs:
- **Small Tests (₹99 - ₹349)**: ₹30 payout
- **Regular Tests (₹350 - ₹799)**: ₹60 payout
- **Advanced Tests (₹800 - ₹1299)**: ₹120 payout
- **Full Body Package (₹2999)**: ₹300 payout

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM & Database**: Prisma ORM (SQLite for local zero-config execution; ready for PostgreSQL)
- **Icons**: Lucide React
- **Validation**: Zod & TypeScript type safety

---

## 📦 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Seed Data
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Role Switcher
You can instantly switch personas from the top navigation bar to test all 4 portals:
- **Patient**: `/dashboard`
- **Admin**: `/admin`
- **Partner Lab**: `/lab-portal`
- **Phlebotomist**: `/collector-portal`

---

## 🌐 Production Deployment

### Netlify / Vercel
1. Connect the GitHub repository.
2. Set Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string or persistent storage URL.
   - `JWT_SECRET`: A secure random secret string.
   - `NEXT_PUBLIC_APP_URL`: `https://quicklabzz.netlify.app`
3. Build Command: `prisma generate && next build`
4. Output Directory: `.next`
