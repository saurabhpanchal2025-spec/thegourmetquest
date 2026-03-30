import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import type { RecipeWithMeta, Ingredient, Instruction, Nutrition } from "@/types/recipe";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const dbRecipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      savedBy: { where: { userId: session.user.id } },
    },
  });

  const recipes: RecipeWithMeta[] = dbRecipes.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    ingredients: r.ingredients as unknown as Ingredient[],
    instructions: r.instructions as unknown as Instruction[],
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    servings: r.servings,
    difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
    nutrition: r.nutrition as unknown as Nutrition,
    recipeType: r.recipeType,
    cookingMethod: r.cookingMethod,
    cuisine: r.cuisine,
    timeCategory: r.timeCategory,
    dietaryPreference: r.dietaryPreference,
    inputIngredients: r.inputIngredients,
    createdAt: r.createdAt.toISOString(),
    isSaved: r.savedBy.length > 0,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Recipe History</h1>
      <RecipeGrid
        recipes={recipes}
        emptyMessage="No recipes generated yet. Try generating your first recipe!"
      />
    </div>
  );
}
