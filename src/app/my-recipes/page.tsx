import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import type { RecipeWithMeta, Ingredient, Instruction, Nutrition } from "@/types/recipe";

export default async function MyRecipesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const savedRecipes = await prisma.savedRecipe.findMany({
    where: { userId: session.user.id },
    include: { recipe: true },
    orderBy: { createdAt: "desc" },
  });

  const recipes: RecipeWithMeta[] = savedRecipes.map((sr) => ({
    id: sr.recipe.id,
    title: sr.recipe.title,
    description: sr.recipe.description,
    ingredients: sr.recipe.ingredients as unknown as Ingredient[],
    instructions: sr.recipe.instructions as unknown as Instruction[],
    prepTime: sr.recipe.prepTime,
    cookTime: sr.recipe.cookTime,
    servings: sr.recipe.servings,
    difficulty: sr.recipe.difficulty as "Easy" | "Medium" | "Hard",
    nutrition: sr.recipe.nutrition as unknown as Nutrition,
    recipeType: sr.recipe.recipeType,
    cookingMethod: sr.recipe.cookingMethod,
    cuisine: sr.recipe.cuisine,
    timeCategory: sr.recipe.timeCategory,
    dietaryPreference: sr.recipe.dietaryPreference,
    inputIngredients: sr.recipe.inputIngredients,
    createdAt: sr.recipe.createdAt.toISOString(),
    isSaved: true,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">My Saved Recipes</h1>
      <RecipeGrid
        recipes={recipes}
        emptyMessage="No saved recipes yet. Generate a recipe and save it to see it here."
      />
    </div>
  );
}
