// Clerk middleware disabled for demo mode
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api/webhooks/stripe",
// ]);

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) await auth.protect();
// });

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pass-through middleware - no auth required for demo
export default function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
