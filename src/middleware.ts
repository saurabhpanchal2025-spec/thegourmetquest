import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/generate", "/my-recipes", "/history"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/generate", "/my-recipes", "/history"],
};
