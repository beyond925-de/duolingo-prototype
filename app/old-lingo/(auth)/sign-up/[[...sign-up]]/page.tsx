// Clerk SignUp component disabled for demo mode
// import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
  // Clerk disabled for demo mode - redirect to home
  // return <SignUp />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <p className="text-muted-foreground">Authentication is disabled in demo mode.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
};

export default SignUpPage;
