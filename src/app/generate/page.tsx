import RecipeGeneratorForm from "@/components/recipe/RecipeGeneratorForm";
import Card from "@/components/ui/Card";

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Generate a Recipe</h1>
        <p className="mt-2 text-muted">
          Customize your preferences and let AI create the perfect recipe for you.
        </p>
      </div>
      <Card>
        <RecipeGeneratorForm />
      </Card>
    </div>
  );
}
