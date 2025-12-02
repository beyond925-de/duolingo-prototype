// Clerk SignIn component disabled for demo mode
// import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  // Clerk disabled for demo mode - redirect to home
  // return <SignIn />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <p className="text-muted-foreground">Authentication is disabled in demo mode.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
};

export default SignInPage;
