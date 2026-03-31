"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="The Gourmet Quest" width={36} height={36} className="rounded-full" />
            <span className="text-lg font-bold text-foreground">
              The Gourmet Quest
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {session && (
              <>
                <Link
                  href="/generate"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Generate
                </Link>
                <Link
                  href="/my-recipes"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  My Recipes
                </Link>
                <Link
                  href="/weekly-menu"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Weekly Menu
                </Link>
                <Link
                  href="/history"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  History
                </Link>
              </>
            )}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">{session.user?.name || session.user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {session && (
              <>
                <Link href="/generate" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  Generate
                </Link>
                <Link href="/my-recipes" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  My Recipes
                </Link>
                <Link href="/weekly-menu" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  Weekly Menu
                </Link>
                <Link href="/history" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  History
                </Link>
              </>
            )}
            {session ? (
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/signin"><Button variant="outline" size="sm">Sign In</Button></Link>
                <Link href="/auth/signup"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
