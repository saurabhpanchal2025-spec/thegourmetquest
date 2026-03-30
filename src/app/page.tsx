import Link from "next/link";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: "🍽️",
    title: "Multiple Cuisines",
    description:
      "Choose from Indian, Italian, Mexican, Japanese, Thai, and many more world cuisines.",
  },
  {
    icon: "🔥",
    title: "Cooking Methods",
    description:
      "Baking, frying, grilling, steaming, air frying, slow cooking — pick your preferred style.",
  },
  {
    icon: "⏱️",
    title: "Time-Based",
    description:
      "Quick 15-minute meals or elaborate 2-hour feasts — recipes that fit your schedule.",
  },
  {
    icon: "🥕",
    title: "Use Your Ingredients",
    description:
      "Tell us what you have in your kitchen and get recipes tailored to your pantry.",
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    description:
      "Powered by Gemini Flash AI for creative, unique, and practical recipes every time.",
  },
  {
    icon: "📚",
    title: "Save & Organize",
    description:
      "Bookmark your favorites and build your personal recipe collection over time.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-orange-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Your Next Meal,{" "}
            <span className="text-primary">AI-Generated</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted leading-8">
            Tell us your cuisine preference, cooking method, available ingredients,
            and how much time you have. Our AI chef creates a personalized recipe
            just for you.
          </p>
          <div className="mt-10">
            <Link href="/auth/signin">
              <Button size="lg">
                Start Cooking with AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-center text-muted max-w-xl mx-auto">
            Customize every aspect of your recipe and let AI do the creative work.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:bg-card-hover"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-6">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Cook Something Amazing?
          </h2>
          <p className="mt-4 text-muted">
            Log in and let AI craft your next favorite meal.
          </p>
          <div className="mt-8">
            <Link href="/auth/signin">
              <Button size="lg">Log In to Get Started</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
