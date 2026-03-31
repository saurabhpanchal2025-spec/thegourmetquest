export const RECIPE_TYPES = [
  { value: "appetizer", label: "Appetizer" },
  { value: "main_course", label: "Main Course" },
  { value: "dessert", label: "Dessert" },
  { value: "snack", label: "Snack" },
  { value: "beverage", label: "Beverage" },
  { value: "soup", label: "Soup" },
  { value: "salad", label: "Salad" },
  { value: "side_dish", label: "Side Dish" },
  { value: "breakfast", label: "Breakfast" },
] as const;

export const COOKING_METHODS = [
  { value: "baking", label: "Baking" },
  { value: "frying", label: "Frying" },
  { value: "grilling", label: "Grilling" },
  { value: "steaming", label: "Steaming" },
  { value: "slow_cooking", label: "Slow Cooking" },
  { value: "no_cook", label: "No-Cook" },
  { value: "air_frying", label: "Air Frying" },
  { value: "roasting", label: "Roasting" },
  { value: "stir_frying", label: "Stir Frying" },
  { value: "boiling", label: "Boiling" },
  { value: "sauteing", label: "Sauteing" },
] as const;

export const CUISINES = [
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "american", label: "American" },
  { value: "thai", label: "Thai" },
  { value: "french", label: "French" },
  { value: "korean", label: "Korean" },
  { value: "middle_eastern", label: "Middle Eastern" },
  { value: "greek", label: "Greek" },
] as const;

export const TIME_CATEGORIES = [
  { value: "under_15", label: "Under 15 min" },
  { value: "15_30", label: "15-30 min" },
  { value: "30_60", label: "30-60 min" },
  { value: "60_120", label: "1-2 hours" },
  { value: "over_120", label: "2+ hours" },
] as const;

export const DIETARY_PREFERENCES = [
  { value: "none", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "vegan_gluten_free", label: "Vegan + Gluten Free" },
  { value: "eggetarian", label: "Egg-etarian" },
] as const;

export const NUTRITIONAL_VARIANTS = [
  { value: "protein_rich", label: "Protein Rich", icon: "💪" },
  { value: "fibre_rich", label: "Fibre Rich", icon: "🌾" },
  { value: "iron_rich", label: "Iron Rich", icon: "🩸" },
  { value: "calcium_rich", label: "Calcium Rich", icon: "🦴" },
] as const;

export type NutritionalVariant = (typeof NUTRITIONAL_VARIANTS)[number]["value"];
export type RecipeType = (typeof RECIPE_TYPES)[number]["value"];
export type CookingMethod = (typeof COOKING_METHODS)[number]["value"];
export type Cuisine = (typeof CUISINES)[number]["value"];
export type TimeCategory = (typeof TIME_CATEGORIES)[number]["value"];
export type DietaryPreference = (typeof DIETARY_PREFERENCES)[number]["value"];
