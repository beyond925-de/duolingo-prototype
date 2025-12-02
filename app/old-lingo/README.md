# Old Lingo Project

This directory contains the original Duolingo mockup project routes and pages.

## Importing Components

You can import components from the old-lingo project in your new app:

```tsx
// Import UI components (these are still at the root level)
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

// Import old-lingo specific components
import { LessonButton } from "@/app/old-lingo/(main)/learn/lesson-button";
import { Quiz } from "@/app/old-lingo/lesson/quiz";

// Import actions
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { getUserProgress } from "@/db/queries";
```

## Available Routes

The old routes are now under `/old-lingo` prefix:
- `/old-lingo/learn` - Learning page
- `/old-lingo/courses` - Courses page
- `/old-lingo/lesson` - Lesson page
- etc.

## Components Location

- **UI Components**: `components/ui/` (shared, can be used in new app)
- **Feature Components**: `components/` (shared, can be used in new app)
- **Old Routes**: `app/old-lingo/` (moved here)
- **Actions**: `actions/` (shared, can be used in new app)
- **Database Queries**: `db/queries.ts` (shared, can be used in new app)

