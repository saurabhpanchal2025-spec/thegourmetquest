"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import BookmarkButton from "@/components/recipe/BookmarkButton";
import type { RecipeWithMeta } from "@/types/recipe";

interface RecipeDetailProps {
  recipe: RecipeWithMeta;
  showBookmark?: boolean;
}

export default function RecipeDetail({ recipe, showBookmark = true }: RecipeDetailProps) {
  const router = useRouter();
  const [missingIngredients, setMissingIngredients] = useState<Set<number>>(new Set());
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const toggleMissing = (index: number) => {
    setMissingIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleRegenerate = async () => {
    setError("");
    setRegenerating(true);

    const excludeNames = recipe.ingredients
      .filter((_, i) => missingIngredients.has(i))
      .map((ing) => ing.name);

    const availableNames = recipe.ingredients
      .filter((_, i) => !missingIngredients.has(i))
      .map((ing) => ing.name);

    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeType: recipe.recipeType,
          cookingMethod: recipe.cookingMethod,
          cuisine: recipe.cuisine,
          timeCategory: recipe.timeCategory,
          dietaryPreference: recipe.dietaryPreference || "none",
          ingredients: availableNames,
          excludeIngredients: excludeNames,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to regenerate recipe");
        setRegenerating(false);
        return;
      }

      const data = await res.json();
      window.location.href = `/recipe/${data.id}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">{recipe.title}</h1>
          {showBookmark && <BookmarkButton recipeId={recipe.id} initialSaved={recipe.isSaved} />}
        </div>
        <p className="mt-3 text-muted leading-7">{recipe.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="primary">{recipe.cuisine.replace("_", " ")}</Badge>
          <Badge variant="secondary">{recipe.cookingMethod.replace("_", " ")}</Badge>
          <Badge variant="accent">{recipe.recipeType.replace("_", " ")}</Badge>
          <Badge>{recipe.difficulty}</Badge>
          {recipe.dietaryPreference && recipe.dietaryPreference !== "none" && (
            <Badge variant="secondary">{recipe.dietaryPreference.replace("_", " ").replace("eggetarian", "Egg-etarian")}</Badge>
          )}
        </div>
      </div>

      {/* Time & Servings */}
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-orange-50 p-4">
        <div className="text-center">
          <p className="text-xs text-muted uppercase tracking-wide">Prep Time</p>
          <p className="text-lg font-semibold text-foreground">{recipe.prepTime} min</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted uppercase tracking-wide">Cook Time</p>
          <p className="text-lg font-semibold text-foreground">{recipe.cookTime} min</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted uppercase tracking-wide">Servings</p>
          <p className="text-lg font-semibold text-foreground">{recipe.servings}</p>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Ingredients</h2>
        <p className="text-xs text-muted mb-4">Mark ingredients you don&apos;t have, then regenerate a new recipe without them.</p>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => {
            const isMissing = missingIngredients.has(i);
            return (
              <li
                key={i}
                onClick={() => toggleMissing(i)}
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  isMissing
                    ? "bg-red-50 border border-red-200"
                    : "bg-white border border-border hover:bg-gray-50"
                }`}
              >
                <span className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center text-xs border ${
                  isMissing
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-border text-transparent"
                }`}>
                  {isMissing ? "x" : ""}
                </span>
                <span className={isMissing ? "line-through text-muted" : ""}>
                  <span className="font-medium">{ing.amount} {ing.unit}</span>{" "}
                  {ing.name}
                </span>
                {isMissing && (
                  <span className="ml-auto text-xs text-red-500 font-medium">Missing</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Regenerate button */}
        {missingIngredients.size > 0 && (
          <div className="mt-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 mb-3">
                {error}
              </div>
            )}
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {regenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="border-white/30 border-t-white" />
                  Cooking up a new recipe...
                </span>
              ) : (
                <span>
                  Regenerate without {missingIngredients.size} ingredient{missingIngredients.size > 1 ? "s" : ""}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions.map((inst) => (
            <li key={inst.step} className="flex gap-4">
              <span className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
                {inst.step}
              </span>
              <p className="text-sm text-foreground leading-6 pt-0.5">{inst.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Nutrition */}
      {recipe.nutrition && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Nutrition (per serving)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Calories", value: `${recipe.nutrition.calories}`, icon: "🔥" },
              { label: "Protein", value: recipe.nutrition.protein, icon: "💪" },
              { label: "Carbs", value: recipe.nutrition.carbs, icon: "🌾" },
              { label: "Fat", value: recipe.nutrition.fat, icon: "🫒" },
              { label: "Fiber", value: recipe.nutrition.fiber, icon: "🥬" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border p-3 text-center"
              >
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Nutritional Focus */}
          {recipe.nutritionalVariants && recipe.nutritionalVariants.length > 0 && (
            <div className="mt-5 rounded-xl bg-teal-50 border border-teal-200 p-4">
              <h3 className="text-sm font-semibold text-teal-800 mb-3">
                🎯 Nutritional Focus of This Recipe
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recipe.nutritionalVariants.map((variant) => {
                  const infoMap: Record<string, { icon: string; label: string; description: string }> = {
                    protein_rich: {
                      icon: "💪",
                      label: "Protein Rich",
                      description: "High in protein to support muscle growth and repair. Key sources in this recipe include legumes, dairy, and whole grains.",
                    },
                    fibre_rich: {
                      icon: "🌾",
                      label: "Fibre Rich",
                      description: "Packed with dietary fibre for healthy digestion. Ingredients like vegetables, whole grains, and legumes boost fibre content.",
                    },
                    iron_rich: {
                      icon: "🩸",
                      label: "Iron Rich",
                      description: "Rich in iron to support healthy blood and energy levels. Includes leafy greens, lentils, and iron-fortified ingredients.",
                    },
                    calcium_rich: {
                      icon: "🦴",
                      label: "Calcium Rich",
                      description: "Good source of calcium for strong bones and teeth. Features dairy, sesame, leafy greens, or fortified ingredients.",
                    },
                  };
                  const info = infoMap[variant];
                  if (!info) return null;
                  return (
                    <div key={variant} className="flex gap-3 rounded-lg bg-white p-3 border border-teal-100">
                      <span className="text-2xl flex-shrink-0">{info.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-teal-800">{info.label}</p>
                        <p className="text-xs text-teal-600 leading-relaxed mt-0.5">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
