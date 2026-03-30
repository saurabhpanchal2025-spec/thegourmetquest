"use client";

import Badge from "@/components/ui/Badge";
import BookmarkButton from "@/components/recipe/BookmarkButton";
import type { RecipeWithMeta } from "@/types/recipe";

interface RecipeDetailProps {
  recipe: RecipeWithMeta;
  showBookmark?: boolean;
}

export default function RecipeDetail({ recipe, showBookmark = true }: RecipeDetailProps) {
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <span>
                <span className="font-medium">{ing.amount} {ing.unit}</span>{" "}
                {ing.name}
              </span>
            </li>
          ))}
        </ul>
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
              { label: "Calories", value: `${recipe.nutrition.calories}` },
              { label: "Protein", value: recipe.nutrition.protein },
              { label: "Carbs", value: recipe.nutrition.carbs },
              { label: "Fat", value: recipe.nutrition.fat },
              { label: "Fiber", value: recipe.nutrition.fiber },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border p-3 text-center"
              >
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
