"use client";

import { Calendar } from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Calendar</h1>
        <p className="text-muted">View and manage scheduled tasks</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span className="text-muted">Meeting</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span className="text-muted">Review</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-muted">Client</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-muted">Deadline</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-muted">1:1</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-[#ec4899]" />
          <span className="text-muted">Reminder</span>
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar />
    </div>
  );
}
