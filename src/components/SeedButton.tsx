"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function SeedButton() {
  const seedData = useMutation(api.seed.seedData);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setStatus("loading");
    try {
      const result = await seedData();
      setMessage(result.message);
      setStatus("done");
    } catch (error) {
      setMessage("Error seeding data");
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSeed}
        disabled={status === "loading"}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          status === "loading"
            ? "bg-muted text-background cursor-not-allowed"
            : status === "done"
            ? "bg-success text-white"
            : status === "error"
            ? "bg-error text-white"
            : "bg-accent text-white hover:bg-accent-hover"
        }`}
      >
        {status === "loading"
          ? "Seeding..."
          : status === "done"
          ? "✓ Seeded"
          : "Seed Example Data"}
      </button>
      {message && <span className="text-sm text-muted">{message}</span>}
    </div>
  );
}
