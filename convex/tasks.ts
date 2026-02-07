import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get tasks for a specific week
export const getWeekTasks = query({
  args: {
    weekStart: v.number(), // Unix timestamp of week start (Monday)
    weekEnd: v.number(), // Unix timestamp of week end (Sunday)
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("scheduledTasks")
      .withIndex("by_startTime")
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), args.weekStart),
          q.lte(q.field("startTime"), args.weekEnd)
        )
      )
      .collect();
    
    return tasks;
  },
});

// Get a single task by ID
export const getById = query({
  args: { id: v.id("scheduledTasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get task types for filtering
export const getTaskTypes = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("scheduledTasks").collect();
    const types = [...new Set(tasks.map((t) => t.taskType))];
    return types.sort();
  },
});

// Search tasks
export const search = query({
  args: {
    query: v.string(),
    taskType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.query) return { tasks: [] };
    
    const results = await ctx.db
      .query("scheduledTasks")
      .withSearchIndex("search_tasks", (q) => {
        let search = q.search("title", args.query);
        if (args.taskType) {
          search = search.eq("taskType", args.taskType);
        }
        return search;
      })
      .take(50);
    
    return { tasks: results };
  },
});

// Add a new task
export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    taskType: v.string(),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled"))),
    color: v.optional(v.string()),
    metadata: v.optional(v.object({
      location: v.optional(v.string()),
      attendees: v.optional(v.array(v.string())),
      priority: v.optional(v.string()),
      recurring: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledTasks", {
      ...args,
      status: args.status ?? "scheduled",
    });
  },
});

// Update task
export const update = mutation({
  args: {
    id: v.id("scheduledTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    taskType: v.optional(v.string()),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled"))),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

// Delete task
export const remove = mutation({
  args: { id: v.id("scheduledTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
