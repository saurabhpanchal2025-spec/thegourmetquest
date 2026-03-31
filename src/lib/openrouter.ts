import OpenAI from "openai";
import { recipeOutputSchema } from "./validators";
import type { RecipeOutput } from "./validators";
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
      vegetarian: "The recipe MUST be vegetarian (no meat, no fish, no poultry). Eggs and dairy are allowed.",
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
