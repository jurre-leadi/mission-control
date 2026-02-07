"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { Doc } from "../../convex/_generated/dataModel";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekBounds(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface TaskModalProps {
  task: Doc<"scheduledTasks">;
  onClose: () => void;
}

function TaskModal({ task, onClose }: TaskModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-md w-full animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground"
        >
          ✕
        </button>

        <div
          className="w-3 h-3 rounded-full mb-4"
          style={{ backgroundColor: task.color || "#3b82f6" }}
        />

        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <span>📅</span>
            <span>
              {new Date(task.startTime).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted">
            <span>🕐</span>
            <span>
              {formatTime(task.startTime)}
              {task.endTime && ` - ${formatTime(task.endTime)}`}
            </span>
          </div>

          {task.description && (
            <p className="text-foreground mt-4">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <span
              className={`px-2 py-1 rounded text-xs ${
                task.status === "completed"
                  ? "bg-success/10 text-success"
                  : task.status === "cancelled"
                  ? "bg-error/10 text-error"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {task.status}
            </span>
            <span className="px-2 py-1 bg-border rounded text-xs">
              {task.taskType}
            </span>
          </div>

          {task.metadata?.location && (
            <div className="flex items-center gap-2 text-muted mt-2">
              <span>📍</span>
              <span>{task.metadata.location}</span>
            </div>
          )}

          {task.metadata?.attendees && task.metadata.attendees.length > 0 && (
            <div className="flex items-center gap-2 text-muted mt-2">
              <span>👥</span>
              <span>{task.metadata.attendees.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Doc<"scheduledTasks"> | null>(null);

  const { weekStart, weekEnd } = useMemo(
    () => getWeekBounds(currentDate),
    [currentDate]
  );

  const tasks = useQuery(api.tasks.getWeekTasks, {
    weekStart: weekStart.getTime(),
    weekEnd: weekEnd.getTime(),
  });

  const weekDays = useMemo(() => {
    return DAYS.map((_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStart]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks for a specific day/hour cell
  const getTasksForCell = (day: Date, hour: number) => {
    if (!tasks) return [];

    const cellStart = new Date(day);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(day);
    cellEnd.setHours(hour + 1, 0, 0, 0);

    return tasks.filter((task) => {
      const taskStart = new Date(task.startTime);
      return (
        taskStart >= cellStart &&
        taskStart < cellEnd
      );
    });
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {weekStart.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <span className="text-muted text-sm">
            {formatDate(weekStart)} - {formatDate(weekDays[6])}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToPrevWeek}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 bg-card border-b border-border">
          <div className="p-3 text-muted text-sm font-medium" />
          {weekDays.map((day, i) => {
            const isToday =
              day.toDateString() === today.toDateString();
            return (
              <div
                key={i}
                className={`p-3 text-center border-l border-border ${
                  isToday ? "bg-accent/10" : ""
                }`}
              >
                <div className="text-muted text-xs">{DAYS[i]}</div>
                <div
                  className={`text-lg font-semibold ${
                    isToday ? "text-accent" : ""
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="max-h-[600px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
              {/* Time Label */}
              <div className="p-2 text-muted text-xs text-right pr-3">
                {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>

              {/* Day Cells */}
              {weekDays.map((day, dayIndex) => {
                const cellTasks = getTasksForCell(day, hour);
                const isToday = day.toDateString() === today.toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`min-h-[50px] border-l border-border p-1 ${
                      isToday ? "bg-accent/5" : ""
                    }`}
                  >
                    {cellTasks.map((task) => (
                      <button
                        key={task._id}
                        onClick={() => setSelectedTask(task)}
                        className="w-full text-left text-xs p-1.5 rounded mb-1 truncate hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: task.color || "#3b82f6",
                          color: "white",
                        }}
                      >
                        {task.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
