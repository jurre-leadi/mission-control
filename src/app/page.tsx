"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SearchBar } from "@/components/SearchBar";
import { SeedButton } from "@/components/SeedButton";
import Link from "next/link";

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / 3600000);
  
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function Dashboard() {
  const activities = useQuery(api.activities.list, { limit: 5 });
  const actionTypes = useQuery(api.activities.getActionTypes);

  const recentActivities = activities?.activities ?? [];
  const totalTypes = actionTypes?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mission Control</h1>
        <p className="text-muted">Monitor AI assistant activities, schedule tasks, and search everything</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl">
        <SearchBar />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <div className="text-2xl font-bold">{recentActivities.length}+</div>
              <div className="text-sm text-muted">Recent Activities</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <div className="text-2xl font-bold">{totalTypes}</div>
              <div className="text-sm text-muted">Activity Types</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-2xl font-bold">
                {recentActivities.filter((a) => a.status === "success").length}
              </div>
              <div className="text-sm text-muted">Successful Actions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/activity"
          className="bg-card hover:bg-card-hover border border-border rounded-xl p-6 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                Activity Feed
              </h3>
              <p className="text-sm text-muted">View all AI actions and events</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>

        <Link
          href="/calendar"
          className="bg-card hover:bg-card-hover border border-border rounded-xl p-6 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                Calendar
              </h3>
              <p className="text-sm text-muted">Schedule and view tasks</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>

        <Link
          href="/search"
          className="bg-card hover:bg-card-hover border border-border rounded-xl p-6 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                Global Search
              </h3>
              <p className="text-sm text-muted">Search across everything</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link href="/activity" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-muted mb-4">No activities yet. Seed some example data to get started.</p>
            <SeedButton />
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center gap-3 p-3 bg-background rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-success"
                      : activity.status === "failed"
                      ? "bg-error"
                      : "bg-warning"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seed Data */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-6">
        <div>
          <h3 className="font-semibold mb-1">Seed Example Data</h3>
          <p className="text-sm text-muted">
            Populate the database with sample activities, tasks, and documents
          </p>
        </div>
        <SeedButton />
      </div>
    </div>
  );
}
