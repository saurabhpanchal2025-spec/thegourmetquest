import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        savedBy: session?.user?.id
          ? { where: { userId: session.user.id } }
          : false,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const isSaved = Array.isArray(recipe.savedBy) && recipe.savedBy.length > 0;

    return NextResponse.json({
      ...recipe,
      isSaved,
      savedBy: undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe || recipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.recipe.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
