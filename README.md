# Mission Control Dashboard

A real-time dashboard for monitoring AI assistant activities, scheduling tasks, and searching across all your data.

![Mission Control](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Convex](https://img.shields.io/badge/Convex-Database-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

### ⚡ Activity Feed (`/activity`)
- Real-time feed of all AI assistant actions
- Filter by action type, status, and date
- Search within activities
- Infinite scroll for large datasets
- Color-coded status indicators

### 📅 Calendar View (`/calendar`)
- Weekly calendar with time slots
- Navigate between weeks
- Today highlighted
- Color-coded task types
- Click tasks for detailed modal view

### 🔍 Global Search (`/search`)
- Search across everything: documents, activities, tasks
- Instant results with relevance scoring
- Preview snippets with highlighted matches
- Filter by content type

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Database**: Convex (real-time sync)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
# Login to Convex (or create an account)
npx convex login

# Initialize Convex and start the dev server
npx convex dev
```

This will:
- Create a new Convex project (or connect to existing)
- Generate the `_generated` types
- Start the Convex dev server

### 3. Configure environment

After running `npx convex dev`, copy the deployment URL:

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Seed example data

Click the "Seed Example Data" button on the dashboard to populate with sample activities, tasks, and documents.

## Project Structure

```
mission-control/
├── convex/
│   ├── schema.ts          # Database schema
│   ├── activities.ts      # Activity queries & mutations
│   ├── tasks.ts           # Task queries & mutations
│   ├── search.ts          # Global search functionality
│   └── seed.ts            # Seed data function
├── src/
│   ├── app/
│   │   ├── page.tsx       # Dashboard
│   │   ├── activity/      # Activity feed page
│   │   ├── calendar/      # Calendar page
│   │   └── search/        # Global search page
│   └── components/
│       ├── ActivityFeed.tsx
│       ├── Calendar.tsx
│       ├── SearchBar.tsx
│       ├── Navigation.tsx
│       ├── ConvexClientProvider.tsx
│       └── ThemeProvider.tsx
└── ...
```

## Database Schema

### Activities
```typescript
{
  timestamp: number,
  actionType: string,
  description: string,
  status: "success" | "failed" | "pending",
  metadata?: { source, target, duration, error, tags }
}
```

### Scheduled Tasks
```typescript
{
  title: string,
  description?: string,
  startTime: number,
  endTime?: number,
  taskType: string,
  status: "scheduled" | "completed" | "cancelled",
  color?: string,
  metadata?: { location, attendees, priority, recurring }
}
```

### Search Index
```typescript
{
  title: string,
  content: string,
  contentType: string,
  sourcePath?: string,
  timestamp: number,
  preview: string
}
```

## Dark Mode

Dark mode is enabled by default. Toggle with the 🌙/☀️ button in the navigation bar. Theme preference is persisted in localStorage.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
