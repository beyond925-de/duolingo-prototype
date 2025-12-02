"use server";

// Clerk and database disabled for demo mode
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
// import db from "@/db/drizzle";
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
// import { challengeProgress, challenges, userProgress } from "@/db/schema";

export const upsertUserProgress = async (courseId: number) => {
  // Auth and database disabled for demo mode
  // const { userId } = await auth();
  // const user = await currentUser();
  // if (!userId || !user) throw new Error("Unauthorized.");
  // ... rest of logic
  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  // Auth and database disabled for demo mode
  // Return success for demo purposes
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  return { error: null };
};

export const refillHearts = async () => {
  // Database disabled for demo mode
  // Just revalidate paths for demo
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
