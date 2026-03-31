export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Instruction {
  step: number;
  text: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  nutrition: Nutrition;
}

export interface RecipeWithMeta extends GeneratedRecipe {
  id: string;
  recipeType: string;
  cookingMethod: string;
  cuisine: string;
  timeCategory: string;
  dietaryPreference: string;
  inputIngredients: string[];
  createdAt: string;
  isSaved?: boolean;
}

export interface GenerateRecipeInput {
  recipeType: string;
  cookingMethod: string;
  cuisine: string;
  timeCategory: string;
  dietaryPreference: string;
  nutritionalVariants?: string[];
  ingredients: string[];
  excludeIngredients?: string[];
}
