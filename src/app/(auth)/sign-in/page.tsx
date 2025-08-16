import { SignInForm } from "@/components/forms/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to your FarmFresh Connect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
