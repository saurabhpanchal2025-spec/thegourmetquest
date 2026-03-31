"use client";

import { useState } from "react";
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
}: {
  meal: MealItem;
  label: string;
  emoji: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
        checked
          ? "bg-green-50 border border-green-200"
          : "bg-white border border-border hover:bg-gray-50"
      }`}
    >
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
  );
}

export default function WeeklyMenuChart({
  menu,
  includeAppetizers,
  includeDesserts,
}: WeeklyMenuChartProps) {
  // Track checked state: key = "day-meal-course", e.g. "Monday-breakfast" or "Monday-lunch-appetizer"
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalMeals = menu.reduce((count, day) => {
    let c = 3; // breakfast + lunch main + dinner main
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
          <p className="text-sm font-semibold text-foreground">
            Weekly Progress
          </p>
          <p className="text-sm text-muted">
            {checkedCount}/{totalMeals} meals checked
          </p>
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
                />
              )}
              <MealCard
                meal={day.lunch.main}
                label="Main"
                emoji="🍛"
                checked={checked.has(`${day.day}-lunch`)}
                onToggle={() => toggle(`${day.day}-lunch`)}
              />
              {includeDesserts && day.lunch.dessert && (
                <MealCard
                  meal={day.lunch.dessert}
                  label="Dessert"
                  emoji="🍰"
                  checked={checked.has(`${day.day}-lunch-dessert`)}
                  onToggle={() => toggle(`${day.day}-lunch-dessert`)}
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
                />
              )}
              <MealCard
                meal={day.dinner.main}
                label="Main"
                emoji="🍽️"
                checked={checked.has(`${day.day}-dinner`)}
                onToggle={() => toggle(`${day.day}-dinner`)}
              />
              {includeDesserts && day.dinner.dessert && (
                <MealCard
                  meal={day.dinner.dessert}
                  label="Dessert"
                  emoji="🍰"
                  checked={checked.has(`${day.day}-dinner-dessert`)}
                  onToggle={() => toggle(`${day.day}-dinner-dessert`)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
