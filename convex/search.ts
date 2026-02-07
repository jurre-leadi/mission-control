import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Global search across all content types
export const globalSearch = query({
  args: {
    query: v.string(),
    contentType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.query || args.query.trim().length === 0) {
      return { results: [], activities: [], tasks: [] };
    }
    
    const limit = args.limit ?? 20;
    
    // Search in searchIndex (documents/memory)
    const docResults = await ctx.db
      .query("searchIndex")
      .withSearchIndex("search_content", (q) => {
        let search = q.search("content", args.query);
        if (args.contentType) {
          search = search.eq("contentType", args.contentType);
        }
        return search;
      })
      .take(limit);
    
    // Also search activities
    const activityResults = await ctx.db
      .query("activities")
      .withSearchIndex("search_activities", (q) =>
        q.search("description", args.query)
      )
      .take(limit);
    
    // Also search tasks
    const taskResults = await ctx.db
      .query("scheduledTasks")
      .withSearchIndex("search_tasks", (q) =>
        q.search("title", args.query)
      )
      .take(limit);
    
    return {
      results: docResults,
      activities: activityResults,
      tasks: taskResults,
    };
  },
});

// Get content types for filtering
export const getContentTypes = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("searchIndex").collect();
    const types = [...new Set(items.map((i) => i.contentType))];
    return types.sort();
  },
});

// Index a new document/content
export const indexContent = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    contentType: v.string(),
    sourcePath: v.optional(v.string()),
    preview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const preview = args.preview ?? args.content.slice(0, 200) + (args.content.length > 200 ? "..." : "");
    
    return await ctx.db.insert("searchIndex", {
      title: args.title,
      content: args.content,
      contentType: args.contentType,
      sourcePath: args.sourcePath,
      timestamp: Date.now(),
      preview,
    });
  },
});

// Remove content from index
export const removeContent = mutation({
  args: { id: v.id("searchIndex") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Update indexed content
export const updateContent = mutation({
  args: {
    id: v.id("searchIndex"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    preview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(id, {
        ...filtered,
        timestamp: Date.now(),
      });
    }
  },
});
