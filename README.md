# 🐱 Nekofolio

A modern, full-featured personal portfolio website with an integrated admin panel, AI chatbot, and dynamic content management — built with Next.js 16, TypeScript, and Tailwind CSS.

---

## ✨ Features

### Public-Facing Portfolio
- **Hero Section** – Animated introduction with personal branding
- **About Section** – Personal background and story
- **Tech Stack Section** – Visual display of technical skills and tools
- **Projects Section** – Showcase of GitHub repositories and personal projects fetched dynamically
- **Leadership Section** – Highlights of leadership experiences
- **AI Section** – Dedicated section highlighting AI-related work
- **Contact Section** – Contact form or links for reaching out
- **Chatbot Widget** – Floating AI chatbot powered by a custom chat service (`chatchit.ts`)
- **Cookie Consent Banner** – GDPR-friendly cookie notice
- **Footer & Navbar** – Responsive navigation and site footer

### Admin Panel (`/admin`)
- **Authentication Guard** – Protected routes; only accessible after login (`/login`)
- **Dashboard** – Overview of site content and metrics
- **CV Manager** – Upload and manage CV files via API
- **Repo Manager** – Manage which GitHub repositories appear in the portfolio
- **Admin Sidebar & Bar** – Clean admin navigation shell

### Developer Experience
- **Zustand** – Lightweight global state management (auth store)
- **TanStack Query** – Server state, caching, and async data fetching
- **React Hook Form + Zod** – Type-safe form validation
- **Axios** – HTTP client with centralized endpoint configuration
- **Framer Motion** – Smooth animations and transitions
- **shadcn/ui** – Accessible, composable UI component library built on Radix UI
- **next-themes** – Dark/light mode support
- **Sonner** – Toast notification system

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + tailwindcss-animate |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand |
| Data Fetching | TanStack React Query + Axios |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Markdown | react-markdown |
| Notifications | Sonner |
| Testing | Testing Library + jsdom |
| Linting | ESLint 9 + TypeScript ESLint |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home / portfolio page
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # 404 page
│   ├── login/              # Login page
│   └── admin/              # Admin panel (protected)
│       ├── layout.tsx
│       ├── page.tsx
│       └── dashboard/
├── components/             # UI components
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── TechStackSection.tsx
│   ├── ProjectsSection.tsx
│   ├── LeadershipSection.tsx
│   ├── AISection.tsx
│   ├── ContactSection.tsx
│   ├── ChatbotWidget.tsx
│   ├── CookieConsent.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── home-page.tsx
│   ├── providers.tsx
│   ├── admin/              # Admin-specific components
│   │   ├── AdminAuthGuard.tsx
│   │   ├── AdminBar.tsx
│   │   ├── AdminDashboardShell.tsx
│   │   ├── CVManager.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RepoManager.tsx
│   │   └── Sidebar.tsx
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                    # Utility functions
│   ├── utils.ts
│   ├── auth-constants.ts
│   ├── unwrap-api-list.ts
│   └── unwrap-payload-data.ts
├── services/               # API service layer
│   ├── endpoint.ts         # Centralized API endpoints
│   ├── authService.ts
│   ├── chatchit.ts         # AI chatbot service
│   ├── cvService.ts
│   └── repoService.ts
├── stores/                 # Zustand global stores
│   ├── auth-store.ts
│   └── index.ts
├── types/                  # TypeScript type definitions
│   ├── admin.ts
│   ├── auth.ts
│   ├── cv.ts
│   └── repo.ts
└── index.css               # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nguyenlyminhman/nekofolio.git

# 2. Navigate into the project directory
cd nekofolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 🔐 Admin Panel

The admin panel is accessible at `/admin` and requires authentication. Log in via `/login` using your credentials. The auth state is persisted via Zustand and protected by `AdminAuthGuard`.

Admin capabilities:
- View dashboard metrics
- Manage and upload CV files
- Add, edit, or remove repository entries shown on the portfolio

---

## 🤖 AI Chatbot

A floating chatbot widget (`ChatbotWidget.tsx`) is embedded on the portfolio page. It communicates with a backend chat service via `chatchit.ts` and supports conversational interactions about the portfolio owner.

---

## 🧪 Testing

This project is set up with Testing Library and jsdom. Run tests with:

```bash
npm test
```

Test setup is configured in `src/test/setup.ts`.

---

## 📦 Deployment

This project can be deployed to any platform that supports Next.js:

- **Vercel** (recommended) – Connect your GitHub repo for zero-config deploys
- **Netlify** – Supported via Next.js adapter
- **Self-hosted** – Run `npm run build && npm start`

---

## 📄 License

This project is private. All rights reserved by [nguyenlyminhman](https://github.com/nguyenlyminhman).
