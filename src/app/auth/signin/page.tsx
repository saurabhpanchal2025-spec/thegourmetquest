import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import Card from "@/components/ui/Card";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to generate and save recipes
          </p>
        </div>
        <SignInForm />
        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}
