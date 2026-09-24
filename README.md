# Shree Shyam Sales (श्री श्याम सेल्स) - E-Commerce & Construction Supplies Platform

A fast, responsive e-commerce web platform for **Shree Shyam Sales**, Chatra & Ranchi, Jharkhand — supplying construction materials (Cement, TMT Rebars, Crash Barriers, MS Barricades, Sand, Aggregate).

## 🚀 Key Features

- **Materials Catalog & Filtering**: Browse UltraTech / ACC Cement, Tata Tiscon / Jindal Panther TMT Steel, Concrete Crash Barriers, and Traffic Safety Barricades.
- **Dynamic Variation Selector**: Grade, diameter, and size selection with real-time pricing and stock status.
- **Cart & WhatsApp Site Delivery Checkout**: Pre-formatted WhatsApp order messages with full contractor address and site contact details.
- **Commercial Bulk Quotation Request**: Multi-ton project estimates with direct WhatsApp quote inquiry builder.
- **Admin Control Center (`/admin`)**:
  - **Protected by Password**: `admin1234` (or `ShreeShyam2026`)
  - **Live Inventory Manager**: Real-time stock counts, inline price updates, add/edit/delete products.
  - **Customer Orders & Bulk Quotes Management**: Update delivery status (`Pending`, `Confirmed`, `Dispatched`, `Delivered`).
  - **Zero-State Analytics & Reset Controls**.
- **Offline-First Storage**: Powered by IndexedDB with LocalStorage fallback.

---

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js 18+ or 20+
- npm (or yarn / pnpm / bun)

### 2. Installation
```bash
# Clone or extract the zip into a folder, then open terminal:
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, Cloudflare Pages, Firebase Hosting, or any web server.

---

## 🔐 Admin Access
- **URL**: Navigate to `/admin` or triple-click the footer copyright text.
- **Master Password**: `admin1234` (or `ShreeShyam2026`)
