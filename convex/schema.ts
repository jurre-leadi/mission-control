import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Activities table - tracks all AI assistant actions
  activities: defineTable({
    timestamp: v.number(), // Unix timestamp
    actionType: v.string(), // email_sent, file_created, search_performed, etc.
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("pending")),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      target: v.optional(v.string()),
      duration: v.optional(v.number()),
      error: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_actionType", ["actionType"])
    .index("by_status", ["status"])
    .searchIndex("search_activities", {
      searchField: "description",
      filterFields: ["actionType", "status"],
    }),

  // Scheduled tasks for the calendar
  scheduledTasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(), // Unix timestamp
    endTime: v.optional(v.number()),
    taskType: v.string(), // meeting, reminder, deadline, recurring, etc.
    status: v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled")),
    color: v.optional(v.string()), // For color coding
    metadata: v.optional(v.object({
      location: v.optional(v.string()),
      attendees: v.optional(v.array(v.string())),
      priority: v.optional(v.string()),
      recurring: v.optional(v.boolean()),
    })),
  })
    .index("by_startTime", ["startTime"])
    .index("by_taskType", ["taskType"])
    .index("by_status", ["status"])
    .searchIndex("search_tasks", {
      searchField: "title",
      filterFields: ["taskType", "status"],
    }),

  // Search index for global search across documents and memory files
  searchIndex: defineTable({
    title: v.string(),
    content: v.string(),
    contentType: v.string(), // memory, document, note, etc.
    sourcePath: v.optional(v.string()),
    timestamp: v.number(),
    preview: v.string(), // Short preview snippet
  })
    .index("by_contentType", ["contentType"])
    .index("by_timestamp", ["timestamp"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["contentType"],
    }),
});
