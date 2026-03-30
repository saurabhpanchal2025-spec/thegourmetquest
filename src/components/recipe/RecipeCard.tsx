import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { RecipeWithMeta } from "@/types/recipe";

interface RecipeCardProps {
  recipe: RecipeWithMeta;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card hover>
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {recipe.title}
        </h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">{recipe.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="primary">{recipe.cuisine.replace("_", " ")}</Badge>
          <Badge variant="secondary">{recipe.cookingMethod.replace("_", " ")}</Badge>
          <Badge>{recipe.prepTime + recipe.cookTime} min</Badge>
          <Badge variant="accent">{recipe.difficulty}</Badge>
        </div>
      </Card>
    </Link>
  );
}
