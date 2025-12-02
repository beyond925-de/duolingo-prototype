"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Action to advance to the next lesson when current lesson is completed
export const advanceLessonProgress = async (completedLessonId: number) => {
  const cookieStore = await cookies();
  const currentLesson = cookieStore.get("demo-current-lesson");
  const currentLessonId = currentLesson ? parseInt(currentLesson.value, 10) : 1;
  
  // Only advance if the completed lesson is the current active lesson
  if (completedLessonId === currentLessonId) {
    const nextLessonId = currentLessonId + 1;
    cookieStore.set("demo-current-lesson", nextLessonId.toString(), {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }
  
  revalidatePath("/learn");
  revalidatePath("/lesson");
};

