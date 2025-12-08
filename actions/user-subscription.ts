"use server";

// Clerk and Stripe disabled for demo mode
// import { auth, currentUser } from "@clerk/nextjs/server";

// import { getUserSubscription } from "@/db/queries";
// import { stripe } from "@/lib/stripe";
//import { absoluteUrl } from "@/lib/utils";

const returnUrl = "/"; // absoluteUrl("/shop");

export const createStripeUrl = async () => {
  // Auth and Stripe disabled for demo mode
  // Return shop URL for demo
  return { data: returnUrl };
};
