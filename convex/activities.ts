import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get activities with filtering and pagination
export const list = query({
  args: {
    actionType: v.optional(v.string()),
    status: v.optional(v.union(v.literal("success"), v.literal("failed"), v.literal("pending"))),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    let q = ctx.db.query("activities").order("desc");
    
    if (args.actionType) {
      q = ctx.db.query("activities")
        .withIndex("by_actionType", (q) => q.eq("actionType", args.actionType!))
        .order("desc");
    }
    
    if (args.status) {
      q = ctx.db.query("activities")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc");
    }
    
    const results = await q.take(limit + 1);
    
    const hasMore = results.length > limit;
    const activities = hasMore ? results.slice(0, -1) : results;
    
    return {
      activities,
      hasMore,
      nextCursor: hasMore ? activities[activities.length - 1]._id : null,
    };
  },
});

// Search activities by description
export const search = query({
  args: {
    query: v.string(),
    actionType: v.optional(v.string()),
    status: v.optional(v.union(v.literal("success"), v.literal("failed"), v.literal("pending"))),
  },
  handler: async (ctx, args) => {
    if (!args.query) return { activities: [] };
    
    const results = await ctx.db
      .query("activities")
      .withSearchIndex("search_activities", (q) => {
        let search = q.search("description", args.query);
        if (args.actionType) {
          search = search.eq("actionType", args.actionType);
        }
        if (args.status) {
          search = search.eq("status", args.status);
        }
        return search;
      })
      .take(50);
    
    return { activities: results };
  },
});

// Get unique action types for filtering
export const getActionTypes = query({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    const types = [...new Set(activities.map((a) => a.actionType))];
    return types.sort();
  },
});

// Add a new activity
export const add = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("pending")),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      target: v.optional(v.string()),
      duration: v.optional(v.number()),
      error: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      timestamp: Date.now(),
      ...args,
    });
  },
});

// Update activity status
export const updateStatus = mutation({
  args: {
    id: v.id("activities"),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("pending")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
