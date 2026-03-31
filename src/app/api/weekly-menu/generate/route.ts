import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { weeklyMenuInputSchema } from "@/lib/validators";
import { generateWeeklyMenu } from "@/lib/openrouter";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const input = weeklyMenuInputSchema.parse(body);

    const { success: withinLimit } = await checkRateLimit(session.user.id);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const menu = await generateWeeklyMenu(input);

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Weekly menu generation error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input. Please check your selections." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate weekly menu. Please try again." },
      { status: 500 }
    );
  }
}
