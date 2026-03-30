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

    // Rotate tips every 3 seconds
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="recipeType"
          label="Recipe Type"
          options={RECIPE_TYPES}
          value={recipeType}
          onChange={(e) => setRecipeType(e.target.value)}
          placeholder="Select recipe type"
          required
        />
        <Select
          id="cookingMethod"
          label="Cooking Method"
          options={COOKING_METHODS}
          value={cookingMethod}
          onChange={(e) => setCookingMethod(e.target.value)}
          placeholder="Select cooking method"
          required
        />
        <Select
          id="cuisine"
          label="Cuisine"
          options={CUISINES}
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Select cuisine"
          required
        />
        <Select
          id="timeCategory"
          label="Time Available"
          options={TIME_CATEGORIES}
          value={timeCategory}
          onChange={(e) => setTimeCategory(e.target.value)}
          placeholder="Select time range"
          required
        />
      </div>

      <Select
        id="dietaryPreference"
        label="Dietary Preference"
        options={DIETARY_PREFERENCES}
        value={dietaryPreference}
        onChange={(e) => setDietaryPreference(e.target.value)}
      />

      <TagInput
        label="Ingredients (optional)"
        tags={ingredients}
        onTagsChange={setIngredients}
        placeholder="Add ingredients you have on hand"
      />

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" />
            {LOADING_TIPS[tipIndex]}
          </span>
        ) : (
          "Generate Recipe"
        )}
      </Button>
    </form>
  );
}
