"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import TagInput from "@/components/ui/TagInput";
import Spinner from "@/components/ui/Spinner";
import {
  RECIPE_TYPES,
  COOKING_METHODS,
  CUISINES,
  TIME_CATEGORIES,
  DIETARY_PREFERENCES,
} from "@/lib/constants";

const LOADING_TIPS = [
  "Preheating the AI oven...",
  "Chopping virtual ingredients...",
  "Seasoning with creativity...",
  "Simmering the perfect recipe...",
  "Plating your masterpiece...",
];

export default function RecipeGeneratorForm() {
  const router = useRouter();
  const [recipeType, setRecipeType] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [timeCategory, setTimeCategory] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("none");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTipIndex(0);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 3000);

    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeType,
          cookingMethod,
          cuisine,
          timeCategory,
          dietaryPreference,
          ingredients,
        }),
      });

      clearInterval(tipInterval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate recipe");
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/recipe/${data.id}`);
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
        <div className="rounded-xl border-l-4 border-l-orange-400 bg-orange-50/60 p-4">
          <Select
            id="recipeType"
            label="Recipe Type"
            icon="🍽️"
            options={RECIPE_TYPES}
            value={recipeType}
            onChange={(e) => setRecipeType(e.target.value)}
            placeholder="Select recipe type"
            required
          />
        </div>
        <div className="rounded-xl border-l-4 border-l-red-400 bg-red-50/60 p-4">
          <Select
            id="cookingMethod"
            label="Cooking Method"
            icon="🔥"
            options={COOKING_METHODS}
            value={cookingMethod}
            onChange={(e) => setCookingMethod(e.target.value)}
            placeholder="Select cooking method"
            required
          />
        </div>
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
            label="Time Available"
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

      <div className="rounded-xl border-l-4 border-l-amber-400 bg-amber-50/60 p-4">
        <TagInput
          label="🥕 Ingredients (optional)"
          tags={ingredients}
          onTagsChange={setIngredients}
          placeholder="Add ingredients you have on hand"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" className="border-white/30 border-t-white" />
            <span className="animate-pulse">{LOADING_TIPS[tipIndex]}</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">&#10024;</span>
            Generate My Recipe
            <span className="text-xl">&#10024;</span>
          </span>
        )}
      </button>
    </form>
  );
}
