"use server";

// Clerk and database disabled for demo mode
// import { auth } from "@clerk/nextjs/server";
// import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS } from "@/constants";
// import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
// import { challengeProgress, challenges, userProgress } from "@/db/schema";

export const upsertChallengeProgress = async (challengeId: number) => {
  // Auth and database disabled for demo mode
  // Just revalidate paths for demo
  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  return { error: null };
};
