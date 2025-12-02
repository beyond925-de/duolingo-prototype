import { cache } from "react";
import { cookies } from "next/headers";

// Clerk and database disabled for demo mode
// import { auth } from "@clerk/nextjs/server";
// import { eq } from "drizzle-orm";

// import db from "./drizzle";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";

const DAY_IN_MS = 86_400_000;

// Mock auth function for demo mode
const auth = async () => ({ userId: null });

// Helper to get current active lesson from cookies (for demo mode)
const getCurrentActiveLessonId = async () => {
  const cookieStore = await cookies();
  const currentLesson = cookieStore.get("demo-current-lesson");
  return currentLesson ? parseInt(currentLesson.value, 10) : 1; // Default to lesson 1
};

export const getCourses = cache(async () => {
  // Database disabled for demo mode - return mock data for demo
  // const data = await db.query.courses.findMany();
  // return data;
  return [
    { id: 1, title: "Spanish", imageSrc: "/es.svg" },
    { id: 2, title: "French", imageSrc: "/fr.svg" },
    { id: 3, title: "Italian", imageSrc: "/it.svg" },
    { id: 4, title: "Japanese", imageSrc: "/jp.svg" },
    { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
  ];
});

export const getUserProgress = cache(async () => {
  // Database and auth disabled for demo mode - return mock data for demo
  // const { userId } = await auth();
  // if (!userId) return null;
  // const data = await db.query.userProgress.findFirst({
  //   where: eq(userProgress.userId, userId),
  //   with: {
  //     activeCourse: true,
  //   },
  // });
  // return data;
  return {
    userId: "demo-user",
    userName: "Demo User",
    userImageSrc: "/mascot.svg",
    activeCourseId: 1,
    hearts: 5,
    points: 0,
    activeCourse: {
      id: 1,
      title: "Spanish",
      imageSrc: "/es.svg",
    },
  };
});

export const getUnits = cache(async () => {
  // Database and auth disabled for demo mode - return mock data for demo
  // const { userId } = await auth();
  // const userProgress = await getUserProgress();
  // if (!userId || !userProgress?.activeCourseId) return [];
  // ... rest of query logic
  
  const currentActiveLessonId = await getCurrentActiveLessonId();
  
  return [
    {
      id: 1,
      title: "Unit 1",
      description: "Learn the basics of Spanish",
      order: 1,
      courseId: 1,
      lessons: [
        {
          id: 1,
          title: "Basics",
          order: 1,
          unitId: 1,
          completed: currentActiveLessonId > 1, // Completed if we're past lesson 1
          challenges: [],
        },
        {
          id: 2,
          title: "Greetings",
          order: 2,
          unitId: 1,
          completed: currentActiveLessonId > 2, // Completed if we're past lesson 2
          challenges: [],
        },
      ],
    },
    {
      id: 2,
      title: "Unit 2",
      description: "Build your foundation",
      order: 2,
      courseId: 1,
      lessons: [
        {
          id: 3,
          title: "Common Phrases",
          order: 1,
          unitId: 2,
          completed: currentActiveLessonId > 3, // Completed if we're past lesson 3
          challenges: [],
        },
      ],
    },
  ];
});

export const getCourseById = cache(async (courseId: number) => {
  // Database disabled for demo mode
  // const data = await db.query.courses.findFirst({
  //   where: eq(courses.id, courseId),
  //   with: {
  //     units: {
  //       orderBy: (units, { asc }) => [asc(units.order)],
  //       with: {
  //         lessons: {
  //           orderBy: (lessons, { asc }) => [asc(lessons.order)],
  //         },
  //       },
  //     },
  //   },
  // });
  // return data;
  return null;
});

export const getCourseProgress = cache(async () => {
  // Database and auth disabled for demo mode - return mock data for demo
  const currentActiveLessonId = await getCurrentActiveLessonId();
  
  // Map lesson IDs to their details
  const lessonDetails: Record<number, { title: string; order: number; unitId: number }> = {
    1: { title: "Basics", order: 1, unitId: 1 },
    2: { title: "Greetings", order: 2, unitId: 1 },
    3: { title: "Common Phrases", order: 1, unitId: 2 },
  };
  
  const activeLesson = lessonDetails[currentActiveLessonId] || lessonDetails[1];
  
  return {
    activeLesson: {
      id: currentActiveLessonId,
      title: activeLesson.title,
      order: activeLesson.order,
      unitId: activeLesson.unitId,
      challenges: [],
    },
    activeLessonId: currentActiveLessonId,
  };
});

export const getLesson = cache(async (id?: number | string) => {
  // Database and auth disabled for demo mode - return mock lesson data for demo
  // Return mock lesson with challenges for demo purposes
  // Handle both number and string IDs (Next.js route params are strings)
  const currentActiveLessonId = await getCurrentActiveLessonId();
  const lessonId = id ? (typeof id === "string" ? parseInt(id, 10) : id) : currentActiveLessonId;
  
  // Different lesson content for each lesson
  const lessonContent: Record<number, { title: string; unitId: number; challenges: any[] }> = {
    1: {
      title: "Basics",
      unitId: 1,
      challenges: [
      {
        id: 1,
        lessonId: lessonId,
        type: "SELECT" as const,
        question: "Which one of these is 'the man'?",
        order: 1,
        completed: false,
        challengeOptions: [
          {
            id: 1,
            challengeId: 1,
            text: "el hombre",
            correct: true,
            imageSrc: "/man.svg",
            audioSrc: null,
          },
          {
            id: 2,
            challengeId: 1,
            text: "la mujer",
            correct: false,
            imageSrc: "/woman.svg",
            audioSrc: null,
          },
          {
            id: 3,
            challengeId: 1,
            text: "el niño",
            correct: false,
            imageSrc: "/boy.svg",
            audioSrc: null,
          },
          {
            id: 4,
            challengeId: 1,
            text: "la niña",
            correct: false,
            imageSrc: "/girl.svg",
            audioSrc: null,
          },
        ],
      },
      {
        id: 2,
        lessonId: lessonId,
        type: "ASSIST" as const,
        question: "el hombre",
        order: 2,
        completed: false,
        challengeOptions: [
          {
            id: 5,
            challengeId: 2,
            text: "the man",
            correct: true,
            imageSrc: "/man.svg",
            audioSrc: null,
          },
          {
            id: 6,
            challengeId: 2,
            text: "the woman",
            correct: false,
            imageSrc: "/woman.svg",
            audioSrc: null,
          },
        ],
      },
      {
        id: 3,
        lessonId: lessonId,
        type: "SELECT" as const,
        question: "Which one of these is 'the woman'?",
        order: 3,
        completed: false,
        challengeOptions: [
          {
            id: 7,
            challengeId: 3,
            text: "el hombre",
            correct: false,
            imageSrc: "/man.svg",
            audioSrc: null,
          },
          {
            id: 8,
            challengeId: 3,
            text: "la mujer",
            correct: true,
            imageSrc: "/woman.svg",
            audioSrc: null,
          },
          {
            id: 9,
            challengeId: 3,
            text: "el niño",
            correct: false,
            imageSrc: "/boy.svg",
            audioSrc: null,
          },
          {
            id: 10,
            challengeId: 3,
            text: "la niña",
            correct: false,
            imageSrc: "/girl.svg",
            audioSrc: null,
          },
        ],
      },
    ],
    },
    2: {
      title: "Greetings",
      unitId: 1,
      challenges: [
        {
          id: 11,
          lessonId: 2,
          type: "SELECT" as const,
          question: "How do you say 'hello' in Spanish?",
          order: 1,
          completed: false,
          challengeOptions: [
            {
              id: 11,
              challengeId: 11,
              text: "hola",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 12,
              challengeId: 11,
              text: "adiós",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 13,
              challengeId: 11,
              text: "gracias",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 14,
              challengeId: 11,
              text: "por favor",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
        {
          id: 12,
          lessonId: 2,
          type: "ASSIST" as const,
          question: "buenos días",
          order: 2,
          completed: false,
          challengeOptions: [
            {
              id: 15,
              challengeId: 12,
              text: "good morning",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 16,
              challengeId: 12,
              text: "good night",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
        {
          id: 13,
          lessonId: 2,
          type: "SELECT" as const,
          question: "How do you say 'goodbye'?",
          order: 3,
          completed: false,
          challengeOptions: [
            {
              id: 17,
              challengeId: 13,
              text: "hola",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 18,
              challengeId: 13,
              text: "adiós",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 19,
              challengeId: 13,
              text: "gracias",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 20,
              challengeId: 13,
              text: "por favor",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
      ],
    },
    3: {
      title: "Common Phrases",
      unitId: 2,
      challenges: [
        {
          id: 21,
          lessonId: 3,
          type: "SELECT" as const,
          question: "How do you say 'thank you'?",
          order: 1,
          completed: false,
          challengeOptions: [
            {
              id: 21,
              challengeId: 21,
              text: "gracias",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 22,
              challengeId: 21,
              text: "por favor",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 23,
              challengeId: 21,
              text: "de nada",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 24,
              challengeId: 21,
              text: "perdón",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
        {
          id: 22,
          lessonId: 3,
          type: "ASSIST" as const,
          question: "por favor",
          order: 2,
          completed: false,
          challengeOptions: [
            {
              id: 25,
              challengeId: 22,
              text: "please",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 26,
              challengeId: 22,
              text: "thank you",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
        {
          id: 23,
          lessonId: 3,
          type: "SELECT" as const,
          question: "How do you say 'you're welcome'?",
          order: 3,
          completed: false,
          challengeOptions: [
            {
              id: 27,
              challengeId: 23,
              text: "gracias",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 28,
              challengeId: 23,
              text: "de nada",
              correct: true,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 29,
              challengeId: 23,
              text: "por favor",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
            {
              id: 30,
              challengeId: 23,
              text: "perdón",
              correct: false,
              imageSrc: null,
              audioSrc: null,
            },
          ],
        },
      ],
    },
  };
  
  const content = lessonContent[lessonId] || lessonContent[1];
  
  return {
    id: lessonId,
    title: content.title,
    order: content.unitId === 1 ? lessonId : lessonId - 2,
    unitId: content.unitId,
    challenges: content.challenges,
  };
});

export const getLessonPercentage = cache(async () => {
  // Database disabled for demo mode - return mock percentage for demo
  return 0;
});

export const getUserSubscription = cache(async () => {
  // Database and auth disabled for demo mode
  return null;
});

export const getTopTenUsers = cache(async () => {
  // Database and auth disabled for demo mode
  return [];
});
