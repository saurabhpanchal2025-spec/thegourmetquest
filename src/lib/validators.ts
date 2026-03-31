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

// Weekly Menu schemas
export const weeklyMenuInputSchema = z.object({
  cuisine: z.string().min(1, "Cuisine is required"),
  dietaryPreference: z.string().default("none"),
  nutritionalVariants: z.array(z.string()).default([]),
  timeCategory: z.string().min(1, "Time preference is required"),
  includeAppetizers: z.boolean().default(false),
  includeDesserts: z.boolean().default(false),
});

const mealItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.number(),
  cookTime: z.number(),
});

const mealWithCoursesSchema = z.object({
  appetizer: mealItemSchema.nullable(),
  main: mealItemSchema,
  dessert: mealItemSchema.nullable(),
});

const dayMenuSchema = z.object({
  day: z.string(),
  breakfast: mealItemSchema,
  lunch: mealWithCoursesSchema,
  dinner: mealWithCoursesSchema,
});

export const weeklyMenuOutputSchema = z.object({
  weeklyMenu: z.array(dayMenuSchema).length(7),
});

export type GenerateRecipeInput = z.infer<typeof generateRecipeSchema>;
export type RecipeOutput = z.infer<typeof recipeOutputSchema>;
export type WeeklyMenuInput = z.infer<typeof weeklyMenuInputSchema>;
export type WeeklyMenuOutput = z.infer<typeof weeklyMenuOutputSchema>;
export type DayMenu = z.infer<typeof dayMenuSchema>;
export type MealItem = z.infer<typeof mealItemSchema>;
