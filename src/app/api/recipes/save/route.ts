import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await request.json();
    if (!recipeId) {
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });
    }

    await prisma.savedRecipe.create({
      data: {
        userId: session.user.id,
        recipeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await request.json();
    if (!recipeId) {
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });
    }

    await prisma.savedRecipe.deleteMany({
      where: {
        userId: session.user.id,
        recipeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsave recipe" },
      { status: 500 }
    );
  }
}
