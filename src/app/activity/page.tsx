"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useState } from "react";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const actionTypes = useQuery(api.activities.getActionTypes);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Activity Feed</h1>
        <p className="text-muted">All AI assistant actions and events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Types</option>
          {actionTypes?.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Active Filters */}
      {(searchQuery || filterType || filterStatus) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted">Active filters:</span>
          {searchQuery && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm flex items-center gap-1">
              &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery("")} className="hover:text-foreground">
                ✕
              </button>
            </span>
          )}
          {filterType && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm flex items-center gap-1">
              {filterType.replace(/_/g, " ")}
              <button onClick={() => setFilterType("")} className="hover:text-foreground">
                ✕
              </button>
            </span>
          )}
          {filterStatus && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm flex items-center gap-1">
              {filterStatus}
              <button onClick={() => setFilterStatus("")} className="hover:text-foreground">
                ✕
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="text-sm text-muted hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Activity Feed */}
      <ActivityFeed
        searchQuery={searchQuery}
        filterType={filterType}
        filterStatus={filterStatus}
      />
    </div>
  );
}
