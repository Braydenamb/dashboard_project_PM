# Aether Analytics Dashboard

A production-style local AI analytics dashboard concept built with **Next.js + TypeScript + Tailwind CSS + shadcn/ui patterns + Recharts + Prisma + SQLite**.

## Tech Stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui-style component architecture (`src/components/ui/*`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Backend/API:** Next.js Route Handlers (`src/app/api/*`)
- **Database:** SQLite + Prisma ORM
- **Auth:** Local demo email/password login with secure HTTP-only cookie session
- **State Management:** Zustand (live metric simulation)
- **Theme:** Dark/light mode with `next-themes`

---

## 1) Full Folder Structure

```text
.
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── auth/logout/route.ts
│   │   │   ├── dashboard/metrics/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   └── users/route.ts
│   │   ├── login/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/login-form.tsx
│   │   ├── dashboard/*
│   │   ├── layout/*
│   │   ├── providers/theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── ui/*
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── data.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── store/dashboard-store.ts
│   └── types/dashboard.ts
├── .env.example
├── package.json
└── README.md
```

---

## 2) Package Installation Commands

```bash
npm install
```

---

## 3) Environment Setup

Create `.env` from the example:

```bash
cp .env.example .env
```

Default env values:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-strong-local-secret"
DEMO_EMAIL="demo@acme-ai.local"
DEMO_PASSWORD="DemoPass123!"
```

---

## 4) Prisma Schema

See `prisma/schema.prisma` for full models:

- `User`
- `Activity`
- `Notification`
- `MetricSnapshot`
- `UserRole` enum

---

## 5) Database Seed Script

Seed script is in `prisma/seed.ts` and creates:

- Demo users (including login user)
- KPI trend snapshots (30 days)
- Activity feed events
- Notification records

Run:

```bash
npm run db:push
npm run db:seed
```

---

## 6) Run Instructions

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open: `http://localhost:3000`

---

## 7) Localhost Testing Instructions

1. Open `http://localhost:3000`
2. Login with demo credentials
3. Verify:
   - KPI cards render
   - Charts animate/update in realtime simulation
   - Activity feed + notification center show seeded data
   - User table search and role filter work
   - Sidebar navigation to Dashboard/Profile/Settings
   - Theme toggle switches light/dark mode
4. Validate APIs:
   - `GET /api/dashboard/metrics`
   - `GET /api/users?search=noah&role=ANALYST`
   - `GET /api/notifications`

---

## 8) Example Credentials

- **Email:** `demo@acme-ai.local`
- **Password:** `DemoPass123!`

---

## 9) Scripts

```bash
npm run dev
npm run lint
npm run build
npm run db:push
npm run db:seed
```

---

## 10) Notes

- This project is designed for fully local execution with seeded demo data.
- Login is intentionally simple for local demonstration.
