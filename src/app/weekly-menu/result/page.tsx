"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WeeklyMenuChart from "@/components/weekly-menu/WeeklyMenuChart";
import type { WeeklyMenuOutput } from "@/lib/validators";

export default function WeeklyMenuResultPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<WeeklyMenuOutput | null>(null);
  const [prefs, setPrefs] = useState<{
    cuisine?: string;
    cuisines?: string[];
    dietaryPreference: string;
    includeAppetizers: boolean;
    includeDesserts: boolean;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("weeklyMenu");
    const storedPrefs = localStorage.getItem("weeklyMenuPrefs");
    if (!stored) {
      router.push("/weekly-menu");
      return;
    }
    try {
      setMenu(JSON.parse(stored));
      if (storedPrefs) setPrefs(JSON.parse(storedPrefs));
    } catch {
      router.push("/weekly-menu");
    }
  }, [router]);

  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted">Loading your weekly menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="bg-gradient-to-br from-purple-100 via-fuchsia-50 to-violet-100 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            📅 Your Weekly Menu
          </h1>
          <p className="mt-2 text-muted text-sm sm:text-base capitalize">
            {prefs?.cuisines
              ? prefs.cuisines.map((c) => c.replace(/_/g, " ")).join(", ")
              : prefs?.cuisine?.replace(/_/g, " ")}
            {prefs?.dietaryPreference && prefs.dietaryPreference !== "none" && (
              <span> &middot; {prefs.dietaryPreference.replace(/_/g, " ")}</span>
            )}
          </p>
          <p className="mt-1 text-xs text-muted">
            Click on meals to mark them as done
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <WeeklyMenuChart
          menu={menu.weeklyMenu}
          includeAppetizers={prefs?.includeAppetizers ?? false}
          includeDesserts={prefs?.includeDesserts ?? false}
        />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/weekly-menu">
            <button className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-md transition-all">
              Generate New Menu
            </button>
          </Link>
          <button
            onClick={() => {
              // Build shareable text summary
              const lines = menu.weeklyMenu.map(
                (day) =>
                  `${day.day}: ${day.breakfast.title} | ${day.lunch.main.title} | ${day.dinner.main.title}`
              );
              const text = `My Weekly Menu Plan:\n${lines.join("\n")}`;
              if (navigator.share) {
                navigator.share({ title: "My Weekly Menu", text });
              } else {
                navigator.clipboard.writeText(text);
                alert("Menu copied to clipboard!");
              }
            }}
            className="px-6 py-3 rounded-xl font-semibold text-sm border border-border text-foreground hover:bg-gray-50 transition-all"
          >
            📤 Share Menu
          </button>
          <Link href="/generate">
            <button className="px-6 py-3 rounded-xl font-semibold text-sm border border-border text-foreground hover:bg-gray-50 transition-all">
              Generate Single Recipe
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
