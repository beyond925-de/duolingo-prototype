/**
 * Example: How to use old-lingo components in your new app
 * 
 * This file demonstrates how to import and use components from the old-lingo project.
 * You can delete this file once you understand the pattern.
 */

"use client";

// Import shared UI components (these work as-is)
import { Button } from "@/components/ui/button";

// Import old-lingo specific components
// Note: You may need to adjust imports based on what you need
// import { LessonButton } from "@/app/old-lingo/(main)/learn/lesson-button";
// import { Quiz } from "@/app/old-lingo/lesson/quiz";

// Import actions/queries (these work as-is)
// import { getUserProgress } from "@/db/queries";
// import { upsertChallengeProgress } from "@/actions/challenge-progress";

export function ComponentsExample() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Using Old Lingo Components</h2>
      <p className="mb-4">
        You can import components from the old-lingo project:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>UI Components: <code className="bg-gray-100 px-2 py-1 rounded">@/components/ui/*</code></li>
        <li>Feature Components: <code className="bg-gray-100 px-2 py-1 rounded">@/components/*</code></li>
        <li>Old Routes: <code className="bg-gray-100 px-2 py-1 rounded">@/app/old-lingo/**</code></li>
        <li>Actions: <code className="bg-gray-100 px-2 py-1 rounded">@/actions/*</code></li>
        <li>Queries: <code className="bg-gray-100 px-2 py-1 rounded">@/db/queries</code></li>
      </ul>
      <Button>Example Button from Old Lingo</Button>
    </div>
  );
}

