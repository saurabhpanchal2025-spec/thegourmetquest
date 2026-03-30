"use client";

import { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({
  label,
  tags,
  onTagsChange,
  placeholder = "Type and press Enter",
  className,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      )}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-primary-dark"
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>
      <p className="mt-1 text-xs text-muted">Press Enter or comma to add</p>
    </div>
  );
}
