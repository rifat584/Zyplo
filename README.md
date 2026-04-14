# Zyplo

> Developer-focused project management app built with Next.js for planning workspaces, tracking tasks, and collaborating across multiple dashboard views.

## Live Demo

- [Visit ZYPLO](https://zyplo-six.vercel.app/)

## Features

- Marketing site with landing, pricing, blog, roadmap, contact, demo, and resource pages
- Email/password authentication plus Google and GitHub sign-in with NextAuth
- Protected dashboard routing for authenticated users
- Workspace creation, starring, deletion, and role-aware access controls
- Workspace views for overview, timeline, board, calendar, list, timesheet, members, and settings
- Drag-and-drop task workflows with task details, comments, due dates, and status management
- Real-time dashboard updates and notifications through Socket.IO
- Workspace invitation and invite-acceptance flow
- GitHub App connection flow from workspace settings
- Billing proxy routes for checkout, customer portal, and subscription status
- Image upload flows for profile/task media through ImgBB and Cloudinary configuration

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- TanStack React Query
- DnD Kit
- FullCalendar
- Recharts
- React Hook Form + Zod

### Auth and Server-Side App Logic

- NextAuth
- Next.js Route Handlers
- Next.js Proxy (`src/proxy.js`)
- Socket.IO client

### External Services Used by This Repo

- Backend API via `BASE_URL` / `NEXT_PUBLIC_BACKEND_URL`
- Google OAuth
- GitHub OAuth
- GitHub App installation flow
- ImgBB upload API
- Cloudinary unsigned upload configuration

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Zyplo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your local environment file

```bash
cp .env.example .env.local
```

## Environment Variables

Create a root `.env.local` file and use safe placeholder values like the following:

```env
BASE_URL=https://your-backend-api.example.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.example.com
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_GITHUB_APP_SLUG=your_github_app_slug
IMG_HOST_KEY=your_imgbb_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_cloudinary_unsigned_preset
```

Notes:

- `BASE_URL` and `NEXT_PUBLIC_BACKEND_URL` both point to the paired backend service used by auth, dashboard, and billing proxies.
- This repository does not include the backend implementation, so backend setup details should come from that service's codebase or deployment config.

## Usage

### Run the development server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Other useful scripts

```bash
npm run lint
npm run build
npm run start
```

## Project Structure

```text
Zyplo/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (main)/
│   │   └── api/
│   ├── components/
│   │   ├── Home/
│   │   ├── Pricing/
│   │   ├── auth/
│   │   ├── board/
│   │   └── dashboard/
│   ├── Context/
│   ├── Provider/
│   └── lib/
├── .env.example
├── package.json
└── README.md
```

---

## Project Context

- This project was originally developed as a group project.
- This fork is maintained by Md Mahmud Ullah Hasan for portfolio and personal GitHub presentation.

## Team

- [Md Mahmud Ullah Hasan](https://github.com/rifat584)
- [Israt Jahan](https://github.com/israt9528)
- [Arifun Nahar Lipi](https://github.com/arifunnahar)
- [Md Al Helal Mohammod Bayijid](https://github.com/Dsx7)
- [MD Ebrahim Ali](https://github.com/ebrahim2355)

## Author

- Md Mahmud Ullah Hasan
- LinkedIn: [https://www.linkedin.com/in/md-mahmud-ullah-hasan/](https://www.linkedin.com/in/md-mahmud-ullah-hasan/)
- Email: [contactwithrifat@gmail.com](mailto:contactwithrifat@gmail.com)
