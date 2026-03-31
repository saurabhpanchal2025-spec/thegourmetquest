"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import {
  CUISINES,
  DIETARY_PREFERENCES,
  NUTRITIONAL_VARIANTS,
  TIME_CATEGORIES,
} from "@/lib/constants";

const LOADING_TIPS = [
  "Planning your week of deliciousness...",
  "Balancing flavours across 7 days...",
  "Picking the perfect breakfast combos...",
  "Crafting lunch specials...",
  "Designing dinner masterpieces...",
  "Almost done — finalising your menu...",
];

export default function WeeklyMenuForm() {
  const router = useRouter();
  const [cuisine, setCuisine] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("none");
  const [nutritionalVariants, setNutritionalVariants] = useState<string[]>([]);
  const [timeCategory, setTimeCategory] = useState("");
  const [includeAppetizers, setIncludeAppetizers] = useState(false);
  const [includeDesserts, setIncludeDesserts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  const toggleNutritionalVariant = (value: string) => {
    setNutritionalVariants((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTipIndex(0);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 4000);

    try {
      const res = await fetch("/api/weekly-menu/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuisine,
          dietaryPreference,
          nutritionalVariants,
          timeCategory,
          includeAppetizers,
          includeDesserts,
        }),
      });

      clearInterval(tipInterval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate weekly menu");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("weeklyMenu", JSON.stringify(data));
      localStorage.setItem("weeklyMenuPrefs", JSON.stringify({
        cuisine,
        dietaryPreference,
        includeAppetizers,
        includeDesserts,
      }));
      router.push("/weekly-menu/result");
    } catch {
      clearInterval(tipInterval);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-center gap-2">
          <span className="text-lg">&#9888;</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border-l-4 border-l-emerald-400 bg-emerald-50/60 p-4">
          <Select
            id="cuisine"
            label="Cuisine"
            icon="🌍"
            options={CUISINES}
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Select cuisine"
            required
          />
        </div>
        <div className="rounded-xl border-l-4 border-l-blue-400 bg-blue-50/60 p-4">
          <Select
            id="timeCategory"
            label="Time per Meal"
            icon="⏱️"
            options={TIME_CATEGORIES}
            value={timeCategory}
            onChange={(e) => setTimeCategory(e.target.value)}
            placeholder="Select time range"
            required
          />
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-l-purple-400 bg-purple-50/60 p-4">
        <Select
          id="dietaryPreference"
          label="Dietary Preference"
          icon="🥗"
          options={DIETARY_PREFERENCES}
          value={dietaryPreference}
          onChange={(e) => setDietaryPreference(e.target.value)}
        />
      </div>

      <div className="rounded-xl border-l-4 border-l-teal-400 bg-teal-50/60 p-4">
        <p className="text-sm font-semibold text-foreground mb-3">
          🎯 Nutritional Focus <span className="text-xs font-normal text-muted">(select any)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {NUTRITIONAL_VARIANTS.map((variant) => {
            const isSelected = nutritionalVariants.includes(variant.value);
            return (
              <label
                key={variant.value}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                  isSelected
                    ? "bg-teal-500 text-white shadow-sm"
                    : "bg-white border border-border text-foreground hover:bg-teal-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleNutritionalVariant(variant.value)}
                  className="sr-only"
                />
                <span>{variant.icon}</span>
                <span>{variant.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Appetizers & Desserts toggles */}
      <div className="rounded-xl border-l-4 border-l-amber-400 bg-amber-50/60 p-4">
        <p className="text-sm font-semibold text-foreground mb-3">
          🍽️ Extra Courses <span className="text-xs font-normal text-muted">(for lunch &amp; dinner)</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <label
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${
              includeAppetizers
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white border border-border text-foreground hover:bg-amber-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeAppetizers}
              onChange={(e) => setIncludeAppetizers(e.target.checked)}
              className="sr-only"
            />
            <span className="text-lg">🥗</span>
            <span>Include Appetizers</span>
          </label>
          <label
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${
              includeDesserts
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white border border-border text-foreground hover:bg-amber-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeDesserts}
              onChange={(e) => setIncludeDesserts(e.target.checked)}
              className="sr-only"
            />
            <span className="text-lg">🍰</span>
            <span>Include Desserts</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" className="border-white/30 border-t-white" />
            <span className="animate-pulse">{LOADING_TIPS[tipIndex]}</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">📅</span>
            Generate Weekly Menu
          </span>
        )}
      </button>
    </form>
  );
}
