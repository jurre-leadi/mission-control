"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showResults?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = "Search everything...",
  showResults = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onSearch?.(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const searchResults = useQuery(
    api.search.globalSearch,
    debouncedQuery.length >= 2 ? { query: debouncedQuery, limit: 10 } : "skip"
  );

  const hasResults =
    searchResults &&
    (searchResults.results.length > 0 ||
      searchResults.activities.length > 0 ||
      searchResults.tasks.length > 0);

  const showDropdown = showResults && isFocused && debouncedQuery.length >= 2;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto animate-fadeIn">
          {!searchResults ? (
            <div className="p-4 text-center text-muted">Searching...</div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-muted">
              No results for &quot;{debouncedQuery}&quot;
            </div>
          ) : (
            <div className="p-2">
              {/* Documents */}
              {searchResults.results.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1 text-xs text-muted uppercase tracking-wider">
                    Documents
                  </div>
                  {searchResults.results.map((doc) => (
                    <div
                      key={doc._id}
                      className="px-3 py-2 hover:bg-card-hover rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="font-medium">
                          {highlightMatches(doc.title, debouncedQuery)}
                        </span>
                        <span className="text-xs text-muted ml-auto">
                          {doc.contentType}
                        </span>
                      </div>
                      <p className="text-sm text-muted mt-1 line-clamp-2">
                        {highlightMatches(doc.preview, debouncedQuery)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Activities */}
              {searchResults.activities.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1 text-xs text-muted uppercase tracking-wider">
                    Activities
                  </div>
                  {searchResults.activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity._id}
                      className="px-3 py-2 hover:bg-card-hover rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span className="font-medium text-sm">
                          {highlightMatches(activity.description, debouncedQuery)}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {formatTimestamp(activity.timestamp)} • {activity.actionType.replace(/_/g, " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {searchResults.tasks.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs text-muted uppercase tracking-wider">
                    Tasks
                  </div>
                  {searchResults.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task._id}
                      className="px-3 py-2 hover:bg-card-hover rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: task.color || "#3b82f6" }}
                        />
                        <span className="font-medium text-sm">
                          {highlightMatches(task.title, debouncedQuery)}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {formatTimestamp(task.startTime)} • {task.taskType}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
