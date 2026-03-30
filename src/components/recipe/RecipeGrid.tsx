import RecipeCard from "./RecipeCard";
import type { RecipeWithMeta } from "@/types/recipe";

interface RecipeGridProps {
  recipes: RecipeWithMeta[];
  emptyMessage?: string;
}

export default function RecipeGrid({ recipes, emptyMessage = "No recipes found." }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
