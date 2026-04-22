# CS5200 Final Project
## FleetHQ — Food Truck Fleet Management System

> A full-stack web application for managing and optimizing operations for a fleet of food trucks — built for CS 5200 Database Management Systems.


## 👥 Team

**CS5200 Group 4**

- GitHub: Jenny Nguyen - [@jennyncodes (https://github.com/jennyncodes)]

- GitHub: Julia Kim - [@juliahnkim (https://github.com/juliahnkim)]

- GitHub: Reva Kakaria - [@rkakaria (https://github.com/rkakaria)]

- Github: Emily Huang - [@ (https://github.com/)]


---

## 📖 About The Project

The FleetHQ Food Truck Fleet Management System is a comprehensive database-backed web application that streamlines operations for a multi-truck mobile food business. The application:
 
- 🚚 Tracks and manages an entire fleet of food trucks in real time
- 📅 Handles scheduling, location assignments, and conflict detection
- 📦 Monitors inventory levels and triggers low-stock alerts
- 🧾 Manages the full order lifecycle from placement to completion
- 👥 Maintains customer loyalty profiles and tier rewards
- 🎪 Coordinates event bookings and staff certifications
- 📈 Provides business intelligence queries 

 
## Tech Stack
- **Database:** PostgreSQL 18 (Cloud SQL)
- **Backend:** Python 3.12 + Flask
- **Frontend:** React + TypeScript + Vite
- **Deployment:** Google App Engine
 
---

## ✨ Features
 
- Complete CRUD operations for trucks, menus, orders, customers
- Automated business logic via database triggers
- Real-time analytics dashboard
- Cloud deployment on Google Cloud Platform
 
 
---

## 🚀 Getting Started
 
### Prerequisites
 
Before you begin, ensure you have the following installed:
 
- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version
  ```
  Download: [https://nodejs.org/](https://nodejs.org/)
 
- **npm** (v9.0.0 or higher, comes with Node.js)
  ```bash
  npm --version
  ```
 
- **Python** (v3.9 or higher)
  ```bash
  python --version
  ```
  Download: [https://www.python.org/](https://www.python.org/)
 
- **Postgres** (local or GCP Compute Engine VM)
- [Google Cloud Platform](https://cloud.google.com/) (cloud)
 
- **Git**
  ```bash
  git --version
  ```
  Download: [https://git-scm.com/](https://git-scm.com/)
 
### Installation
 
1. **Clone the repository**
   ```bash
   git clone https://github.com/jennyncodes/FleetHQ.git
   cd fleethq
   ```
 
2. **Install Frontend Dependencies**
   ```bash
   cd fleet-hq/frontend
   npm install
   ```
 
3. **Install Backend Dependencies**
   ```bash
   cd fleethq
   python -m venv venv
   source venv/bin/activate     # Mac / Linux
   # venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```
 

 
## 🎮 Running the Application
 
You need **two terminal windows** — one for the backend, one for the frontend.
 
**Terminal 1 — Start Flask Backend**
```bash
cd fleethq/backend
source venv/bin/activate      # Mac / Linux
# venv\Scripts\activate       # Windows
 
python main.py
```
✅ Backend will run on: `http://localhost:8080`
 
**Terminal 2 — Start React Frontend**
```bash
cd fleet-hq/frontend
npm run dev
```
✅ Frontend will run on: `http://localhost:5173`
 
Then open **http://localhost:5173** in your browser. Vite automatically proxies all `/api/*` requests to Flask on port 8080 — no extra configuration needed.
 
### Production Build
 
**Build Frontend (outputs into Flask's static folder):**
```bash
cd fleet-hq/frontend
npm run build
```
 
**Deploy to GCP App Engine:**
```bash
cd fleethq
gcloud app deploy
gcloud app browse
```
 
---
 
## 🗄️ Database Schema
 
Based on the Phase 2 EER Diagram — 13 tables implementing the full relational model:
 
| Table | Description |
|---|---|
| `FOOD_TRUCK` | Fleet vehicles with status and cuisine type |
| `LOCATION` | Operating spots with GPS coordinates and zone type |
| `SCHEDULE` | Truck-location time assignments (Scheduled_At relationship) |
| `MENU` | One menu per truck |
| `DISH` | Individual menu items with pricing and cost |
| `INGREDIENT` | Ingredient master list |
| `DISH_INGREDIENT` | Many-to-many: dishes ↔ ingredients |
| `INVENTORY` | Per-truck ingredient stock levels with min thresholds |
| `CUSTOMER` | Customer profiles with loyalty tiers (soft delete) |
| `ORDER_` | Customer orders with full lifecycle tracking |
| `ORDER_ITEM` | Weak entity — line items per order |
| `EMPLOYEE` | Staff with IS-A → DRIVER / MANAGER subtypes |
| `EVENT` | Events and festivals |
| `EVENT_BOOKING` | Many-to-many: events ↔ trucks |
 
---
 
## 🌐 API Endpoints
 
### Trucks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trucks` | List all trucks |
| GET | `/api/trucks/:id` | Get one truck |
| POST | `/api/trucks` | Create a truck |
| PUT | `/api/trucks/:id` | Update a truck |
| DELETE | `/api/trucks/:id` | Delete a truck |
 
### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create an order |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Soft-delete an order |
 
### Analytics (Phase 2 Queries)
| Method | Endpoint | Query |
|---|---|---|
| GET | `/api/analytics/summary` | Dashboard KPIs |
| GET | `/api/analytics/revenue-by-truck` | Query 7 — Revenue per truck |
| GET | `/api/analytics/top-dishes` | Query 20 — Top 10 dishes |
| GET | `/api/analytics/profit-margins` | Query 21 — Profit margins |
| GET | `/api/analytics/daily-avg-sales` | Query 9 — Sales by day |
| GET | `/api/analytics/expiring-certs` | Query 25 — Expiring permits |
| GET | `/api/analytics/schedule-conflicts` | Query 15 — Double bookings |
| GET | `/api/analytics/customer-retention` | Query 22 — Retention rate |
 
All list endpoints support `?q=search_term` for filtering.
 
> Full endpoint list for all 10 entities (Locations, Schedules, Menu, Inventory, Customers, Staff, Events) follows the same REST pattern above.
 
---
 
## 📁 Project Structure
 
```
FleetHQ/
├── fleet-hq/
│   ├── backend/
│   │   ├── main.py                    # Flask application with all endpoints
│   │   ├── requirements.txt           # Python dependencies
│   │   ├── app.yaml                   # App Engine deployment config
│   │   └── .env                       # Environment variables (local only)
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.tsx         # Navigation header with routing
│       │   │   └── UtilityComponents.tsx
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx      # Real-time metrics dashboard
│       │   │   ├── TruckList.tsx      # Truck management with CRUD
│       │   │   ├── TruckForm.tsx      # Add/Edit truck form
│       │   │   ├── Analytics.tsx      # Analytics with complex queries
│       │   │   ├── MenuList.tsx       # Menu management (stub)
│       │   │   └── OtherPages.tsx     # Additional feature stubs
│       │   ├── App.tsx                # Main app with React Router
│       │   ├── main.tsx               # React entry point
│       │   └── main.css               # Complete styling system
│       ├── index.html                 # HTML template
│       ├── package.json               # Frontend dependencies
│       ├── vite.config.ts             # Vite configuration
│       └── tsconfig.json              # TypeScript configuration
│
└── README.md                      # This file
 
---
 
## 🔧 Development Workflow
 
### Creating a New Feature
 
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
 
2. **Make your changes**
   - Write code and test locally
   - Make sure both Flask and Vite are running
 
3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add description of your feature"
   ```
 
4. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```
 
5. **Create a Pull Request**
   - Go to GitHub
   - Open a new Pull Request
   - Request a review from a teammate
 
### Commit Message Convention
 
Follow [Conventional Commits](https://www.conventionalcommits.org/):
 
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes
- `refactor:` — Code refactoring
- `db:` — Schema or query changes
 
**Examples:**
```bash
git commit -m "feat: Add inventory low-stock alert banner"
git commit -m "fix: Resolve schedule conflict detection query"
git commit -m "db: Add EVENT_BOOKING junction table"
git commit -m "docs: Update API endpoint table in README"
```
 
---
 
