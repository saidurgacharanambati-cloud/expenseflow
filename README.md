# ExpenseFlow — Full-Stack Personal Finance Management Application

> **"Take control of your money."**  
> A production-ready, security-first full-stack personal finance platform built with React, Node.js/Express, and Supabase PostgreSQL.

[![Deployment Status](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Express.js%20REST-000000?logo=express)](https://expressjs.com)
[![Security](https://img.shields.io/badge/Security-Row%20Level%20Security%20(RLS)-blue)](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📌 Project Overview & Purpose

**ExpenseFlow** is an enterprise-grade personal finance management application engineered for seamless transaction tracking, categorical spending analysis, interactive monthly budgeting, and rigorous data protection.

### Primary Goals
- **Track**: Securely record real-time income and expense entries with precise date timestamps and descriptions.
- **Categorize**: Group financial activities into standard semantic domains (Food, Transport, Bills, Shopping, Salary, Freelance, etc.).
- **Analyze**: Interactive visualizations powered by Recharts (Category Donut Distribution, 6-Month Income vs. Expense Comparative Bars, and Daily Spending Area Trends).
- **Budget**: Set dynamic monthly expenditure caps with visual health indicators (`Normal` ≤ 75%, `Warning` 76–100%, and `Exceeded` > 100%).
- **Control**: Server-side filtering, searching, server-side pagination, and Indian Rupee (₹) currency formatting.

---

## 🏗️ Architecture & Data Isolation

ExpenseFlow uses a decoupled REST architecture that executes seamlessly both in local development and within **Vercel's Serverless Edge runtime**:

```
┌─────────────────────────────────────────────────────────────┐
│                    React 18 Single Page App                 │
│         (Vite + Tailwind CSS + Lucide + Recharts)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Axios HTTP (Bearer Supabase JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js + Express.js API                   │
│          (Vercel Serverless Function: /api/index.js)        │
├─────────────────────────────────────────────────────────────┤
│  • authMiddleware: Verifies Bearer JWT with Supabase Auth    │
│  • Enforces User Isolation: Forces user_id = req.user.id    │
│  • REST Endpoints: Transactions, Budgets, Analytics, Profile│
└──────────────────────────────┬──────────────────────────────┘
                               │ Supabase Service Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Supabase PostgreSQL Engine                  │
├─────────────────────────────────────────────────────────────┤
│  • Row Level Security (RLS) policies on all tables          │
│  • Foreign Keys to auth.users(id) with ON DELETE CASCADE    │
│  • Automated updated_at and user profile sync triggers      │
│  • Composite Indexes on (user_id, date, category)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React |
| **Backend** | Node.js, Express.js 4, RESTful APIs, Supabase Client (`@supabase/supabase-js`), CORS, Dotenv |
| **Database** | PostgreSQL on Supabase, Row Level Security (RLS), PL/pgSQL Triggers, Database Constraints |
| **Authentication**| Supabase Auth (Email & Password), JWT Session Persistence, Bearer Token Verification |
| **Deployment** | Vercel (Frontend Static Assets + Express Serverless Function), Git / GitHub |

---

## 🗄️ Database Schema & Security Constraints

The database is built on Supabase PostgreSQL with strict foreign keys, check constraints, and RLS policies defined in [`supabase/schema.sql`](file:///supabase/schema.sql):

### 1. `profiles`
- `id` (UUID, Primary Key, references `auth.users(id)` ON DELETE CASCADE)
- `full_name` (TEXT)
- `email` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- **RLS**: Select, Insert, and Update restricted to `auth.uid() = id`.

### 2. `transactions`
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `type` (TEXT, check constraint `type IN ('income', 'expense')`)
- `amount` (NUMERIC(12,2), check constraint `amount > 0`)
- `category` (TEXT)
- `description` (TEXT)
- `transaction_date` (DATE)
- `created_at`, `updated_at` (TIMESTAMPTZ)
- **Indexes**: `idx_transactions_user_id`, `idx_transactions_user_date`, `idx_transactions_user_category`, `idx_transactions_user_type`.
- **RLS**: Full CRUD restricted to `auth.uid() = user_id`.

### 3. `budgets`
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `month` (INTEGER, check constraint `month BETWEEN 1 AND 12`)
- `year` (INTEGER, check constraint `year >= 2000`)
- `amount` (NUMERIC(12,2), check constraint `amount > 0`)
- `CONSTRAINT unique_user_month_year UNIQUE (user_id, month, year)`
- **RLS**: Full CRUD restricted to `auth.uid() = user_id`.

---

## 🔒 Security Highlights

1. **Zero Client Trust**: The backend never accepts or trusts a client-supplied `user_id`. The user identity is extracted strictly from the validated Bearer session JWT using `supabaseAdmin.auth.getUser(token)`.
2. **Database-Level Isolation (RLS)**: Even in the event of an application misconfiguration, PostgreSQL Row Level Security rejects cross-tenant reads or writes.
3. **Secret Isolation**: `SUPABASE_SERVICE_ROLE_KEY` is exclusively scoped to backend serverless environments and is never exposed in client bundles.
4. **Input Sanitization**: Numerical bounds, date formats, and category parameters are validated prior to database execution.

---

## 🚀 API Endpoints

All protected endpoints require an `Authorization: Bearer <token>` header.

### Transactions
- `GET /api/transactions` — Paginated list with filtering (`page`, `limit`, `type`, `category`, `startDate`, `endDate`, `search`).
- `GET /api/transactions/:id` — Retrieve a single transaction.
- `POST /api/transactions` — Create a transaction.
- `PUT /api/transactions/:id` — Update a transaction.
- `DELETE /api/transactions/:id` — Delete a transaction.

### Budgets
- `GET /api/budgets/current?month=X&year=Y` — Returns budget targets, total spent, remaining funds, and status.
- `POST /api/budgets` — Create or update monthly budget target.
- `PUT /api/budgets/:id` — Update target amount.
- `DELETE /api/budgets/:id` — Remove monthly budget.

### Dashboard Analytics
- `GET /api/dashboard/summary?month=X&year=Y` — Aggregated balance, income, expenses, category breakdown, 6-month comparison, and daily spending trend.

### Profile
- `GET /api/profile` — Fetch user profile.
- `PUT /api/profile` — Update user's full name.

---

## 💻 Local Setup & Development

### 1. Clone & Install
```bash
git clone https://github.com/your-username/expenseflow.git
cd expenseflow
npm install
```

### 2. Environment Variables Configuration
Create a `.env` file in the project root:
```env
# Frontend (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=/api

# Backend (Express / Vercel Serverless)
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NODE_ENV=development
```

### 3. Setup Supabase Database
1. Go to [Supabase](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Copy and run the script in [`supabase/schema.sql`](file:///supabase/schema.sql).
4. *(Optional)* Run [`supabase/seed.sql`](file:///supabase/seed.sql) to inject sample transactions.

### 4. Run Locally
Run both frontend and backend concurrently:
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Express API runs at: `http://localhost:5000` (proxied by Vite to `/api`)

---

## ☁️ Vercel Deployment Guide

ExpenseFlow is configured natively for Vercel deployment with `vercel.json`:

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Configure Environment Variables in the Vercel Project Settings:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_API_URL`: `/api`
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role secret
6. Click **Deploy**.

### Live Production Deployment
- **Live Vercel URL**: `https://expenseflow-finance.vercel.app` *(or your custom Vercel domain)*
- **GitHub Repository**: `https://github.com/your-username/expenseflow`

---

## 📄 License
MIT License. Built for technical interview demonstration and portfolio excellence.
