import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRecipeSchema } from "@/lib/validators";
import { generateRecipe } from "@/lib/openrouter";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const input = generateRecipeSchema.parse(body);

    // Rate limit
    const { success: withinLimit } = await checkRateLimit(session.user.id);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Generate recipe via AI
    const recipe = await generateRecipe(input);

    // Save to database
    const saved = await prisma.recipe.create({
      data: {
        userId: session.user.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        nutrition: recipe.nutrition,
        recipeType: input.recipeType,
        cookingMethod: input.cookingMethod,
        cuisine: input.cuisine,
        timeCategory: input.timeCategory,
        dietaryPreference: input.dietaryPreference,
        inputIngredients: input.ingredients,
      },
    });

    return NextResponse.json({ id: saved.id, ...recipe });
  } catch (error) {
    console.error("Recipe generation error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input. Please check your selections." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}
