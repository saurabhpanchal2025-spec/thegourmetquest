import SignUpForm from "@/components/auth/SignUpForm";
import Card from "@/components/ui/Card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted">
            Join The Gourmet Quest and start generating recipes
          </p>
        </div>
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <a href="/auth/signin" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}
