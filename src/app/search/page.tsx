"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-warning/30 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [contentType, setContentType] = useState("");

  const contentTypes = useQuery(api.search.getContentTypes);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const searchResults = useQuery(
    api.search.globalSearch,
    debouncedQuery.length >= 2
      ? { query: debouncedQuery, contentType: contentType || undefined, limit: 50 }
      : "skip"
  );

  const totalResults = searchResults
    ? searchResults.results.length +
      searchResults.activities.length +
      searchResults.tasks.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Global Search</h1>
        <p className="text-muted">
          Search across memory files, documents, activities, and tasks
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything..."
            className="w-full pl-14 pr-4 py-4 bg-card border border-border rounded-xl text-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Types</option>
          {contentTypes?.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {debouncedQuery.length >= 2 && (
        <div>
          {/* Results Count */}
          <div className="mb-4 text-sm text-muted">
            {searchResults ? (
              `${totalResults} results for "${debouncedQuery}"`
            ) : (
              "Searching..."
            )}
          </div>

          {searchResults && totalResults === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted">No results found for "{debouncedQuery}"</p>
              <p className="text-sm text-muted mt-2">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {/* Documents */}
          {searchResults && searchResults.results.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📄</span>
                Documents & Memory
                <span className="text-sm font-normal text-muted">
                  ({searchResults.results.length})
                </span>
              </h2>
              <div className="space-y-3">
                {searchResults.results.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-card hover:bg-card-hover border border-border rounded-lg p-4 transition-colors cursor-pointer animate-fadeIn"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">
                          {highlightMatches(doc.title, debouncedQuery)}
                        </h3>
                        <p className="text-sm text-muted line-clamp-2">
                          {highlightMatches(doc.preview, debouncedQuery)}
                        </p>
                        {doc.sourcePath && (
                          <div className="text-xs text-muted mt-2 font-mono">
                            {doc.sourcePath}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs">
                          {doc.contentType}
                        </span>
                        <span className="text-xs text-muted">
                          {formatTimestamp(doc.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {searchResults && searchResults.activities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span>
                Activities
                <span className="text-sm font-normal text-muted">
                  ({searchResults.activities.length})
                </span>
              </h2>
              <div className="space-y-3">
                {searchResults.activities.map((activity) => (
                  <Link
                    key={activity._id}
                    href="/activity"
                    className="block bg-card hover:bg-card-hover border border-border rounded-lg p-4 transition-colors animate-fadeIn"
                  >
                    <div className="flex items-center gap-3">
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
                        <p className="text-sm">
                          {highlightMatches(activity.description, debouncedQuery)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-border rounded text-xs">
                          {activity.actionType.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-muted">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {searchResults && searchResults.tasks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📅</span>
                Tasks
                <span className="text-sm font-normal text-muted">
                  ({searchResults.tasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                {searchResults.tasks.map((task) => (
                  <Link
                    key={task._id}
                    href="/calendar"
                    className="block bg-card hover:bg-card-hover border border-border rounded-lg p-4 transition-colors animate-fadeIn"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.color || "#3b82f6" }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">
                          {highlightMatches(task.title, debouncedQuery)}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-muted truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-border rounded text-xs">
                          {task.taskType}
                        </span>
                        <span className="text-xs text-muted">
                          {formatTimestamp(task.startTime)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {debouncedQuery.length < 2 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-muted text-lg">Start typing to search</p>
          <p className="text-sm text-muted mt-2">
            Search across documents, memory files, activities, and tasks
          </p>

          {/* Search Tips */}
          <div className="mt-8 max-w-md mx-auto text-left">
            <h3 className="text-sm font-medium mb-3">Search tips:</h3>
            <ul className="text-sm text-muted space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Try searching for "roadmap" or "meeting"
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Search activity descriptions like "email" or "sync"
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Find tasks by title like "standup" or "deadline"
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
