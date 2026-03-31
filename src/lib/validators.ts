import { z } from "zod";

export const generateRecipeSchema = z.object({
  recipeType: z.string().min(1, "Recipe type is required"),
  cookingMethod: z.string().min(1, "Cooking method is required"),
  cuisine: z.string().min(1, "Cuisine is required"),
  timeCategory: z.string().min(1, "Time category is required"),
  dietaryPreference: z.string().default("none"),
  nutritionalVariants: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  excludeIngredients: z.array(z.string()).default([]),
});

export const recipeOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
      unit: z.string(),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.number(),
      text: z.string(),
    })
  ),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  nutrition: z.object({
    calories: z.number(),
    protein: z.string(),
    carbs: z.string(),
    fat: z.string(),
    fiber: z.string(),
  }),
});

export type GenerateRecipeInput = z.infer<typeof generateRecipeSchema>;
export type RecipeOutput = z.infer<typeof recipeOutputSchema>;
