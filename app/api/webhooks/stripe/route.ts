// Stripe and database disabled for demo mode
// import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
// import Stripe from "stripe";

// import db from "@/db/drizzle";
// import { userSubscription } from "@/db/schema";
// import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  // Stripe and database disabled for demo mode - just return success
  // const body = await req.text();
  // const signature = headers().get("Stripe-Signature") as string;
  // ... rest of webhook logic
  return new NextResponse(null, { status: 200 });
}
