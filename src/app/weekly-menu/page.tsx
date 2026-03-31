import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import WeeklyMenuForm from "@/components/weekly-menu/WeeklyMenuForm";

export default async function WeeklyMenuPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="bg-gradient-to-br from-purple-100 via-fuchsia-50 to-violet-100 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-3">📅</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Plan Your Week of Meals
          </h1>
          <p className="mt-3 text-muted text-base sm:text-lg max-w-lg mx-auto">
            Set your preferences and let AI create a full 7-day meal plan with breakfast, lunch, and dinner.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="rounded-2xl border border-border bg-white shadow-xl p-6 sm:p-8">
          <WeeklyMenuForm />
        </div>
      </div>
    </div>
  );
}
