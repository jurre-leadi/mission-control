"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useCallback } from "react";

const actionTypeIcons: Record<string, string> = {
  email_sent: "📧",
  file_created: "📄",
  file_uploaded: "📤",
  search_performed: "🔍",
  calendar_sync: "📅",
  task_completed: "✅",
  api_call: "🔗",
  notification_sent: "🔔",
  backup_created: "💾",
  code_review: "👀",
  default: "⚡",
};

const statusColors: Record<string, string> = {
  success: "text-success",
  failed: "text-error",
  pending: "text-warning",
};

const statusBgColors: Record<string, string> = {
  success: "bg-success/10",
  failed: "bg-error/10",
  pending: "bg-warning/10",
};

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

type ActivityStatus = "success" | "failed" | "pending";

interface ActivityFeedProps {
  searchQuery?: string;
  filterType?: string;
  filterStatus?: string;
}

export function ActivityFeed({ searchQuery, filterType, filterStatus }: ActivityFeedProps) {
  const [visibleCount, setVisibleCount] = useState(20);

  const statusValue = (filterStatus || undefined) as ActivityStatus | undefined;

  const listResult = useQuery(api.activities.list, {
    actionType: filterType || undefined,
    status: statusValue,
    limit: visibleCount,
  });

  const searchResult = useQuery(
    api.activities.search,
    searchQuery ? { query: searchQuery, actionType: filterType, status: statusValue } : "skip"
  );

  const activities = searchQuery
    ? searchResult?.activities ?? []
    : listResult?.activities ?? [];

  const hasMore = !searchQuery && (listResult?.hasMore ?? false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      hasMore
    ) {
      setVisibleCount((prev) => prev + 20);
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!activities) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-border rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-muted">
          {searchQuery ? "No activities match your search" : "No activities yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className="bg-card hover:bg-card-hover rounded-lg p-4 transition-colors animate-fadeIn border border-border"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-2xl">
              {actionTypeIcons[activity.actionType] || actionTypeIcons.default}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">
                  {activity.description}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${statusBgColors[activity.status]} ${statusColors[activity.status]}`}
                >
                  {activity.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                <span>{formatTimestamp(activity.timestamp)}</span>
                <span className="px-2 py-0.5 bg-border rounded text-xs">
                  {activity.actionType.replace(/_/g, " ")}
                </span>
              </div>

              {/* Metadata tags */}
              {activity.metadata?.tags && activity.metadata.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {activity.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Error message */}
              {activity.metadata?.error && (
                <div className="mt-2 text-sm text-error bg-error/10 rounded px-2 py-1">
                  Error: {activity.metadata.error}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center py-4">
          <div className="text-muted animate-pulse">Loading more...</div>
        </div>
      )}
    </div>
  );
}
