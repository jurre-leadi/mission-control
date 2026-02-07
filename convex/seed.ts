import { mutation } from "./_generated/server";

// Seed the database with example data
export const seedData = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    // Check if data already exists
    const existingActivities = await ctx.db.query("activities").take(1);
    if (existingActivities.length > 0) {
      return { message: "Data already seeded" };
    }

    // Seed Activities
    const activities = [
      {
        timestamp: now - 10 * 60 * 1000, // 10 minutes ago
        actionType: "email_sent",
        description: "Sent weekly status report to team@company.com",
        status: "success" as const,
        metadata: { target: "team@company.com", tags: ["report", "weekly"] },
      },
      {
        timestamp: now - 30 * 60 * 1000,
        actionType: "file_created",
        description: "Created meeting notes for Q1 planning session",
        status: "success" as const,
        metadata: { source: "voice-transcription", tags: ["meeting", "planning"] },
      },
      {
        timestamp: now - hour,
        actionType: "search_performed",
        description: "Searched for project roadmap documents",
        status: "success" as const,
        metadata: { duration: 1200, tags: ["search"] },
      },
      {
        timestamp: now - 2 * hour,
        actionType: "calendar_sync",
        description: "Synced calendar with Google Calendar",
        status: "success" as const,
        metadata: { source: "google-calendar", duration: 3500 },
      },
      {
        timestamp: now - 3 * hour,
        actionType: "task_completed",
        description: "Completed: Review pull request #142",
        status: "success" as const,
        metadata: { tags: ["github", "review"] },
      },
      {
        timestamp: now - 4 * hour,
        actionType: "api_call",
        description: "Failed to fetch weather data - API timeout",
        status: "failed" as const,
        metadata: { error: "ETIMEDOUT", duration: 30000 },
      },
      {
        timestamp: now - 5 * hour,
        actionType: "notification_sent",
        description: "Sent reminder: Team standup in 15 minutes",
        status: "success" as const,
        metadata: { target: "slack", tags: ["reminder"] },
      },
      {
        timestamp: now - 6 * hour,
        actionType: "file_uploaded",
        description: "Uploaded presentation.pdf to shared drive",
        status: "success" as const,
        metadata: { target: "google-drive", tags: ["upload", "presentation"] },
      },
      {
        timestamp: now - day,
        actionType: "backup_created",
        description: "Created daily backup of workspace files",
        status: "success" as const,
        metadata: { duration: 45000, tags: ["backup", "daily"] },
      },
      {
        timestamp: now - day - 2 * hour,
        actionType: "email_sent",
        description: "Sent project proposal to client@external.com",
        status: "success" as const,
        metadata: { target: "client@external.com", tags: ["proposal", "client"] },
      },
      {
        timestamp: now - day - 4 * hour,
        actionType: "code_review",
        description: "Reviewed and approved PR #138 - Add user authentication",
        status: "success" as const,
        metadata: { source: "github", tags: ["review", "auth"] },
      },
      {
        timestamp: now - 2 * day,
        actionType: "search_performed",
        description: "Searched internal docs for API documentation",
        status: "success" as const,
        metadata: { duration: 800, tags: ["search", "docs"] },
      },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    // Seed Scheduled Tasks
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const weekStart = getWeekStart(new Date());

    const tasks = [
      {
        title: "Team Standup",
        description: "Daily sync with the development team",
        startTime: weekStart + day + 9 * hour,
        endTime: weekStart + day + 9.5 * hour,
        taskType: "meeting",
        status: "scheduled" as const,
        color: "#3b82f6",
        metadata: { recurring: true, attendees: ["team"] },
      },
      {
        title: "Code Review Session",
        description: "Review pending pull requests",
        startTime: weekStart + day + 14 * hour,
        endTime: weekStart + day + 15 * hour,
        taskType: "review",
        status: "scheduled" as const,
        color: "#8b5cf6",
      },
      {
        title: "Client Call",
        description: "Weekly check-in with Acme Corp",
        startTime: weekStart + 2 * day + 10 * hour,
        endTime: weekStart + 2 * day + 11 * hour,
        taskType: "meeting",
        status: "scheduled" as const,
        color: "#10b981",
        metadata: { location: "Zoom", attendees: ["client@acme.com"] },
      },
      {
        title: "Project Deadline",
        description: "Submit Q1 deliverables",
        startTime: weekStart + 3 * day + 17 * hour,
        taskType: "deadline",
        status: "scheduled" as const,
        color: "#ef4444",
        metadata: { priority: "high" },
      },
      {
        title: "1:1 with Manager",
        description: "Weekly one-on-one meeting",
        startTime: weekStart + 4 * day + 11 * hour,
        endTime: weekStart + 4 * day + 12 * hour,
        taskType: "meeting",
        status: "scheduled" as const,
        color: "#f59e0b",
      },
      {
        title: "Sprint Planning",
        description: "Plan next sprint stories",
        startTime: weekStart + 4 * day + 14 * hour,
        endTime: weekStart + 4 * day + 16 * hour,
        taskType: "meeting",
        status: "scheduled" as const,
        color: "#3b82f6",
        metadata: { attendees: ["dev-team"] },
      },
      {
        title: "Deploy to Production",
        description: "Release v2.3.0",
        startTime: weekStart + 5 * day + 10 * hour,
        taskType: "reminder",
        status: "scheduled" as const,
        color: "#ec4899",
        metadata: { priority: "high" },
      },
    ];

    for (const task of tasks) {
      await ctx.db.insert("scheduledTasks", task);
    }

    // Seed Search Index (Documents/Memory)
    const documents = [
      {
        title: "Project Roadmap Q1 2025",
        content: "The Q1 roadmap focuses on three main objectives: improving user onboarding, enhancing API performance, and launching the new dashboard. Key milestones include the beta release in February and GA in March.",
        contentType: "document",
        sourcePath: "/docs/roadmap-q1.md",
        timestamp: now - 7 * day,
        preview: "The Q1 roadmap focuses on three main objectives: improving user onboarding...",
      },
      {
        title: "Meeting Notes - Client Kickoff",
        content: "Attendees: John, Sarah, Mike from Acme Corp. Discussed project scope, timeline, and deliverables. Client wants MVP by end of February. Budget approved for phase 1.",
        contentType: "memory",
        sourcePath: "/memory/2025-01-15.md",
        timestamp: now - 14 * day,
        preview: "Attendees: John, Sarah, Mike from Acme Corp. Discussed project scope...",
      },
      {
        title: "API Documentation",
        content: "REST API endpoints for the mission control system. Authentication uses JWT tokens. Rate limiting is set to 100 requests per minute. All endpoints return JSON.",
        contentType: "document",
        sourcePath: "/docs/api.md",
        timestamp: now - 3 * day,
        preview: "REST API endpoints for the mission control system. Authentication uses JWT...",
      },
      {
        title: "Weekly Review Notes",
        content: "This week: completed authentication module, fixed 12 bugs, reviewed 8 PRs. Team velocity is on track. Need to discuss scaling strategy next week.",
        contentType: "memory",
        sourcePath: "/memory/2025-02-01.md",
        timestamp: now - day,
        preview: "This week: completed authentication module, fixed 12 bugs, reviewed 8 PRs...",
      },
      {
        title: "Architecture Decision Record - Database",
        content: "Decided to use Convex for the database layer. Reasons: real-time sync, TypeScript support, automatic scaling. Alternative considered: Supabase.",
        contentType: "document",
        sourcePath: "/docs/adr-001.md",
        timestamp: now - 10 * day,
        preview: "Decided to use Convex for the database layer. Reasons: real-time sync...",
      },
    ];

    for (const doc of documents) {
      await ctx.db.insert("searchIndex", doc);
    }

    return { message: "Database seeded successfully", counts: { activities: activities.length, tasks: tasks.length, documents: documents.length } };
  },
});

// Clear all data (for testing)
export const clearData = mutation({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    const tasks = await ctx.db.query("scheduledTasks").collect();
    const docs = await ctx.db.query("searchIndex").collect();

    for (const a of activities) await ctx.db.delete(a._id);
    for (const t of tasks) await ctx.db.delete(t._id);
    for (const d of docs) await ctx.db.delete(d._id);

    return { message: "All data cleared" };
  },
});
