"use client";

import { useState } from "react";
import Spinner from "@/components/ui/Spinner";
import type { DayMenu, MealItem } from "@/lib/validators";

interface WeeklyMenuChartProps {
  menu: DayMenu[];
  includeAppetizers: boolean;
  includeDesserts: boolean;
}

const DAY_COLORS: Record<string, string> = {
  Monday: "border-l-red-400 bg-red-50/40",
  Tuesday: "border-l-orange-400 bg-orange-50/40",
  Wednesday: "border-l-amber-400 bg-amber-50/40",
  Thursday: "border-l-emerald-400 bg-emerald-50/40",
  Friday: "border-l-blue-400 bg-blue-50/40",
  Saturday: "border-l-violet-400 bg-violet-50/40",
  Sunday: "border-l-pink-400 bg-pink-50/40",
};

function MealCard({
  meal,
  label,
  emoji,
  checked,
  onToggle,
  onViewRecipe,
  generatingRecipe,
}: {
  meal: MealItem;
  label: string;
  emoji: string;
  checked: boolean;
  onToggle: () => void;
  onViewRecipe: () => void;
  generatingRecipe: boolean;
}) {
  return (
    <div
      className={`px-3 py-2.5 rounded-lg transition-all text-sm ${
        checked
          ? "bg-green-50 border border-green-200"
          : "bg-white border border-border hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3 cursor-pointer" onClick={onToggle}>
        <span
          className={`flex-shrink-0 mt-0.5 h-4 w-4 rounded flex items-center justify-center text-[10px] border ${
            checked
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300"
          }`}
        >
          {checked ? "✓" : ""}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted">{emoji} {label}</p>
          <p className={`font-medium text-sm ${checked ? "line-through text-muted" : "text-foreground"}`}>
            {meal.title}
          </p>
          <p className="text-xs text-muted mt-0.5 truncate">{meal.description}</p>
          <p className="text-[10px] text-muted mt-0.5">
            {meal.prepTime + meal.cookTime} min total
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewRecipe();
        }}
        disabled={generatingRecipe}
        className="mt-2 w-full py-1.5 text-xs font-medium rounded-md border border-primary/30 text-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {generatingRecipe ? (
          <>
            <Spinner size="sm" />
            Generating...
          </>
        ) : (
          "🔍 View Full Recipe"
        )}
      </button>
    </div>
  );
}

export default function WeeklyMenuChart({
  menu,
  includeAppetizers,
  includeDesserts,
}: WeeklyMenuChartProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleViewRecipe = async (meal: MealItem, key: string) => {
    setGeneratingKey(key);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeType: "main_course",
          cookingMethod: "sauteing",
          cuisine: "indian",
          timeCategory: "30_60",
          dietaryPreference: "none",
          ingredients: [],
          recipeName: meal.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = `/recipe/${data.id}`;
      } else {
        alert("Failed to generate recipe. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setGeneratingKey(null);
    }
  };

  const totalMeals = menu.reduce((count, day) => {
    let c = 3;
    if (includeAppetizers) c += (day.lunch.appetizer ? 1 : 0) + (day.dinner.appetizer ? 1 : 0);
    if (includeDesserts) c += (day.lunch.dessert ? 1 : 0) + (day.dinner.dessert ? 1 : 0);
    return count + c;
  }, 0);

  const checkedCount = checked.size;
  const progress = totalMeals > 0 ? Math.round((checkedCount / totalMeals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="rounded-xl bg-white border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">Weekly Progress</p>
          <p className="text-sm text-muted">{checkedCount}/{totalMeals} meals checked</p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Days */}
      {menu.map((day) => (
        <div
          key={day.day}
          className={`rounded-xl border-l-4 p-4 sm:p-5 ${DAY_COLORS[day.day] || "border-l-gray-400 bg-gray-50/40"}`}
        >
          <h3 className="text-lg font-bold text-foreground mb-3">{day.day}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Breakfast */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Breakfast</p>
              <MealCard
                meal={day.breakfast}
                label="Main"
                emoji="🌅"
                checked={checked.has(`${day.day}-breakfast`)}
                onToggle={() => toggle(`${day.day}-breakfast`)}
                onViewRecipe={() => handleViewRecipe(day.breakfast, `${day.day}-breakfast`)}
                generatingRecipe={generatingKey === `${day.day}-breakfast`}
              />
            </div>

            {/* Lunch */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Lunch</p>
              {includeAppetizers && day.lunch.appetizer && (
                <MealCard
                  meal={day.lunch.appetizer}
                  label="Appetizer"
                  emoji="🥗"
                  checked={checked.has(`${day.day}-lunch-appetizer`)}
                  onToggle={() => toggle(`${day.day}-lunch-appetizer`)}
                  onViewRecipe={() => handleViewRecipe(day.lunch.appetizer!, `${day.day}-lunch-appetizer`)}
                  generatingRecipe={generatingKey === `${day.day}-lunch-appetizer`}
                />
              )}
              <MealCard
                meal={day.lunch.main}
                label="Main"
                emoji="🍛"
                checked={checked.has(`${day.day}-lunch`)}
                onToggle={() => toggle(`${day.day}-lunch`)}
                onViewRecipe={() => handleViewRecipe(day.lunch.main, `${day.day}-lunch`)}
                generatingRecipe={generatingKey === `${day.day}-lunch`}
              />
              {includeDesserts && day.lunch.dessert && (
                <MealCard
                  meal={day.lunch.dessert}
                  label="Dessert"
                  emoji="🍰"
                  checked={checked.has(`${day.day}-lunch-dessert`)}
                  onToggle={() => toggle(`${day.day}-lunch-dessert`)}
                  onViewRecipe={() => handleViewRecipe(day.lunch.dessert!, `${day.day}-lunch-dessert`)}
                  generatingRecipe={generatingKey === `${day.day}-lunch-dessert`}
                />
              )}
            </div>

            {/* Dinner */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Dinner</p>
              {includeAppetizers && day.dinner.appetizer && (
                <MealCard
                  meal={day.dinner.appetizer}
                  label="Appetizer"
                  emoji="🥗"
                  checked={checked.has(`${day.day}-dinner-appetizer`)}
                  onToggle={() => toggle(`${day.day}-dinner-appetizer`)}
                  onViewRecipe={() => handleViewRecipe(day.dinner.appetizer!, `${day.day}-dinner-appetizer`)}
                  generatingRecipe={generatingKey === `${day.day}-dinner-appetizer`}
                />
              )}
              <MealCard
                meal={day.dinner.main}
                label="Main"
                emoji="🍽️"
                checked={checked.has(`${day.day}-dinner`)}
                onToggle={() => toggle(`${day.day}-dinner`)}
                onViewRecipe={() => handleViewRecipe(day.dinner.main, `${day.day}-dinner`)}
                generatingRecipe={generatingKey === `${day.day}-dinner`}
              />
              {includeDesserts && day.dinner.dessert && (
                <MealCard
                  meal={day.dinner.dessert}
                  label="Dessert"
                  emoji="🍰"
                  checked={checked.has(`${day.day}-dinner-dessert`)}
                  onToggle={() => toggle(`${day.day}-dinner-dessert`)}
                  onViewRecipe={() => handleViewRecipe(day.dinner.dessert!, `${day.day}-dinner-dessert`)}
                  generatingRecipe={generatingKey === `${day.day}-dinner-dessert`}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
