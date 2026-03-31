import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import RecipeDetail from "@/components/recipe/RecipeDetail";
import type { RecipeWithMeta, Ingredient, Instruction, Nutrition } from "@/types/recipe";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      savedBy: session?.user?.id
        ? { where: { userId: session.user.id } }
        : false,
    },
  });

  if (!recipe) {
    notFound();
  }

  const recipeData: RecipeWithMeta = {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients as unknown as Ingredient[],
    instructions: recipe.instructions as unknown as Instruction[],
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard",
    nutrition: recipe.nutrition as unknown as Nutrition,
    recipeType: recipe.recipeType,
    cookingMethod: recipe.cookingMethod,
    cuisine: recipe.cuisine,
    timeCategory: recipe.timeCategory,
    dietaryPreference: recipe.dietaryPreference,
    nutritionalVariants: recipe.nutritionalVariants,
    inputIngredients: recipe.inputIngredients,
    createdAt: recipe.createdAt.toISOString(),
    isSaved: Array.isArray(recipe.savedBy) && recipe.savedBy.length > 0,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <RecipeDetail recipe={recipeData} showBookmark={!!session} />
    </div>
  );
}
