# Mission Control Dashboard - Requirements

## Overview
Build a Mission Control Dashboard for Jurre to monitor all AI assistant activities.

## Tech Stack
- **Framework**: NextJS 14+ (App Router)
- **Database**: Convex
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Features

### 1. Activity Feed
- Real-time feed showing EVERY action performed by the AI assistant
- Each entry should include:
  - Timestamp
  - Action type (e.g., "email_sent", "file_created", "search_performed", "message_sent")
  - Description of what was done
  - Status (success/failed/pending)
  - Related metadata (file paths, recipients, etc.)
- Filterable by action type, date range, status
- Infinite scroll or pagination
- Search within activities

### 2. Calendar View
- Weekly calendar view showing scheduled tasks
- Tasks from cron jobs and reminders
- Visual timeline with time slots
- Click to see task details
- Navigation to previous/next weeks
- Today highlighted
- Color coding by task type

### 3. Global Search
- Search across:
  - Memory files (MEMORY.md, memory/*.md)
  - Documents (docs/*.md)
  - Activity history
  - Scheduled tasks
- Instant search results
- Relevance scoring
- Preview snippets with highlighted matches
- Click to expand full content

## Data Models (Convex)

### activities
- id, timestamp, actionType, description, status, metadata, userId

### scheduledTasks
- id, title, description, scheduledAt, cronExpression, taskType, status

### searchIndex
- id, source, content, path, lastUpdated

## UI/UX
- Dark mode by default (can toggle)
- Responsive design
- Fast and snappy
- Clean, minimal interface
- Real-time updates where applicable

## API Endpoints (for future integration)
- POST /api/activities - Log new activity
- GET /api/activities - List activities
- GET /api/tasks - List scheduled tasks
- GET /api/search - Search everything

## Initial Data
Seed with some example activities and tasks for demonstration.
