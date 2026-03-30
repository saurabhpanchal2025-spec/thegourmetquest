"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface BookmarkButtonProps {
  recipeId: string;
  initialSaved?: boolean;
}

export default function BookmarkButton({ recipeId, initialSaved = false }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const method = saved ? "DELETE" : "POST";

    try {
      const res = await fetch("/api/recipes/save", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      if (res.ok) {
        setSaved(!saved);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={saved ? "primary" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
    >
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
