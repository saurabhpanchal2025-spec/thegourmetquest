import OpenAI from "openai";
import { recipeOutputSchema, weeklyMenuOutputSchema } from "./validators";
import type { RecipeOutput, WeeklyMenuInput, WeeklyMenuOutput } from "./validators";
import type { GenerateRecipeInput } from "@/types/recipe";

const MODEL = "google/gemini-2.0-flash-001";

let _client: OpenAI | null = null;

function getClient() {
  if (!_client) {
    _client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "The Gourmet Quest",
      },
    });
  }
  return _client;
}

function buildPrompt(input: GenerateRecipeInput): string {
  const parts = [
    `Generate a ${input.recipeType.replace("_", " ")} recipe`,
    `using the ${input.cookingMethod.replace("_", " ")} cooking method`,
    `in ${input.cuisine.replace("_", " ")} cuisine`,
    `Time constraint: ${input.timeCategory.replace("_", "-").replace("under-", "under ")} minutes`,
  ];

  if (input.dietaryPreference && input.dietaryPreference !== "none") {
    const dietMap: Record<string, string> = {
      vegetarian: "The recipe MUST be vegetarian (no meat, no fish, no poultry, and NO eggs). Dairy is allowed but eggs are NOT allowed.",
      vegan: "The recipe MUST be vegan (no animal products at all — no meat, fish, dairy, eggs, or honey).",
      gluten_free: "The recipe MUST be gluten-free (no wheat, barley, rye, or gluten-containing ingredients).",
      vegan_gluten_free: "The recipe MUST be both vegan AND gluten-free (no animal products and no gluten-containing ingredients).",
      eggetarian: "The recipe MUST be egg-etarian (vegetarian with eggs allowed, but no meat, fish, or poultry). Dairy and eggs are allowed.",
    };
    parts.push(dietMap[input.dietaryPreference] || "");
  }

  if (input.excludeIngredients && input.excludeIngredients.length > 0) {
    parts.push(`Do NOT use these ingredients (the user doesn't have them): ${input.excludeIngredients.join(", ")}. Find suitable substitutes or use completely different ingredients instead`);
  }

  if (input.nutritionalVariants && input.nutritionalVariants.length > 0) {
    const variantLabels = input.nutritionalVariants.map((v) =>
      v.replace("_", " ")
    );
    parts.push(`The recipe should be nutritionally focused on being: ${variantLabels.join(", ")}. Prioritize ingredients that are naturally high in these nutrients`);
  }

  if (input.ingredients.length > 0) {
    parts.push(`Must include these ingredients: ${input.ingredients.join(", ")}`);
  }

  return parts.join(". ") + ".";
}

const SYSTEM_PROMPT = `You are a world-class chef and recipe creator. Generate a recipe based on the user's requirements. Return ONLY valid JSON matching this exact schema (no markdown, no code fences, just raw JSON):
{
  "title": "string",
  "description": "string (2-3 sentences)",
  "ingredients": [{ "name": "string", "amount": "string", "unit": "string" }],
  "instructions": [{ "step": 1, "text": "string" }],
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "nutrition": { "calories": number, "protein": "string with unit", "carbs": "string with unit", "fat": "string with unit", "fiber": "string with unit" }
}

Important rules:
- ALWAYS use metric units (grams, ml, litres) for ingredient amounts. Never use ounces, pounds, cups, or imperial units. For small amounts use teaspoons (tsp) and tablespoons (tbsp)
- Ensure prep + cook time respects the user's time constraint
- Ingredients should be specific with realistic amounts
- Instructions should be clear, numbered steps
- Nutrition values should be reasonable estimates per serving
- Return ONLY the JSON object, nothing else`;

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<RecipeOutput> {
  const userMessage = buildPrompt(input);

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI model");
  }

  // Strip potential markdown fences
  const jsonStr = content.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();

  const parsed = JSON.parse(jsonStr);
  const validated = recipeOutputSchema.parse(parsed);
  return validated;
}

// Weekly Menu Generation
const WEEKLY_MENU_SYSTEM_PROMPT = `You are a world-class meal planner and chef. Generate a complete 7-day weekly meal plan based on the user's preferences. Return ONLY valid JSON (no markdown, no code fences):
{
  "weeklyMenu": [
    {
      "day": "Monday",
      "breakfast": { "title": "string", "description": "string (1 sentence)", "prepTime": number, "cookTime": number },
      "lunch": {
        "appetizer": { "title": "string", "description": "string", "prepTime": number, "cookTime": number } or null,
        "main": { "title": "string", "description": "string (1 sentence)", "prepTime": number, "cookTime": number },
        "dessert": { "title": "string", "description": "string", "prepTime": number, "cookTime": number } or null
      },
      "dinner": {
        "appetizer": { ... } or null,
        "main": { "title": "string", "description": "string (1 sentence)", "prepTime": number, "cookTime": number },
        "dessert": { ... } or null
      }
    }
    ... (all 7 days: Monday through Sunday)
  ]
}

Rules:
- Generate all 7 days (Monday to Sunday)
- Every day MUST have breakfast, lunch.main, and dinner.main
- Set appetizer and dessert to null unless the user requested them
- Ensure variety across the week — avoid repeating the same dish
- Keep descriptions short (1 sentence max)
- prepTime and cookTime in minutes
- ALWAYS use metric units in descriptions
- Return ONLY the JSON object`;

function buildWeeklyMenuPrompt(input: WeeklyMenuInput): string {
  const parts = [
    `Generate a 7-day weekly meal plan`,
    `Cuisine: ${input.cuisine.replace("_", " ")}`,
    `General time per meal: ${input.timeCategory.replace("_", "-").replace("under-", "under ")} minutes`,
  ];

  if (input.dietaryPreference && input.dietaryPreference !== "none") {
    const dietMap: Record<string, string> = {
      vegetarian: "ALL meals MUST be vegetarian (no meat, fish, poultry, or eggs). Dairy allowed.",
      vegan: "ALL meals MUST be vegan (no animal products).",
      gluten_free: "ALL meals MUST be gluten-free.",
      vegan_gluten_free: "ALL meals MUST be vegan AND gluten-free.",
      eggetarian: "ALL meals MUST be egg-etarian (no meat/fish, eggs and dairy allowed).",
    };
    parts.push(dietMap[input.dietaryPreference] || "");
  }

  if (input.nutritionalVariants.length > 0) {
    parts.push(`Nutritional focus: ${input.nutritionalVariants.map((v) => v.replace("_", " ")).join(", ")}`);
  }

  if (input.includeAppetizers) {
    parts.push("Include appetizers for lunch and dinner");
  } else {
    parts.push("Set appetizer to null for all meals");
  }

  if (input.includeDesserts) {
    parts.push("Include desserts for lunch and dinner");
  } else {
    parts.push("Set dessert to null for all meals");
  }

  return parts.join(". ") + ".";
}

export async function generateWeeklyMenu(
  input: WeeklyMenuInput
): Promise<WeeklyMenuOutput> {
  const userMessage = buildWeeklyMenuPrompt(input);

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: WEEKLY_MENU_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.8,
    max_tokens: 8000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI model");
  }

  const jsonStr = content.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);
  const validated = weeklyMenuOutputSchema.parse(parsed);
  return validated;
}
