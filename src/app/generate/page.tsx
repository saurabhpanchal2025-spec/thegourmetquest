import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import RecipeGeneratorForm from "@/components/recipe/RecipeGeneratorForm";

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Colourful header */}
      <div className="bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <Image src="/logo.jpg" alt="The Gourmet Quest" width={80} height={80} className="rounded-full mx-auto mb-3 shadow-lg border-2 border-white" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What are we cooking today?
          </h1>
          <p className="mt-3 text-muted text-base sm:text-lg max-w-lg mx-auto">
            Pick your preferences below and our AI chef will whip up something delicious for you.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="rounded-2xl border border-border bg-white shadow-xl p-6 sm:p-8">
          <RecipeGeneratorForm />
        </div>
      </div>
    </div>
  );
}
