import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@thegourmetquest.com";
const DEMO_PASSWORD = "demo123456";
const DEMO_NAME = "Demo User";

export async function POST() {
  try {
    let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

    if (!user) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
      user = await prisma.user.create({
        data: { name: DEMO_NAME, email: DEMO_EMAIL, passwordHash },
      });
    }

    return NextResponse.json({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to set up demo account" },
      { status: 500 }
    );
  }
}
