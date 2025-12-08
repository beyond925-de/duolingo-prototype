# Configuration Specification

This document describes all configuration options for Jobs, Levels, and Scenarios. It is designed to be readable by both humans and LLMs for content generation.

---

## Table of Contents

1. [Job Configuration](#job-configuration)
2. [Level Configuration](#level-configuration)
3. [Scenario Configuration](#scenario-configuration)
4. [Path Mode Options](#path-mode-options)
5. [Complete Examples](#complete-examples)

---

## Job Configuration

A **Job** represents a complete career path or training program that users can explore.

### Required Fields

```typescript
{
  id: string;                    // Unique identifier (e.g., "industriemechaniker")
  title: string;                 // Display name (e.g., "Industriemechaniker:in")
  description: string;           // Short description shown in job cards
  icon: string;                  // Emoji or icon (e.g., "🛠️")
  color: string;                 // Hex color code (e.g., "#3b82f6")
  tags: string[];               // Array of tag strings (e.g., ["🛠️ Hands on", "⚙️ Technik"])
  levels: Level[];              // Array of levels (see Level Configuration below)
}
```

### Optional Fields

```typescript
{
  pathModeId?: "linear" | "branching" | "global-map";
  // Determines how the job's path is visualized on the map:
  // - "linear": Single zig-zag trail (default)
  // - "branching": Graph with explicit branches/merges
  // - "global-map": Part of a multi-job zoomable canvas
  
  pathOverrides?: {
    global?: {
      column?: number;           // Column position in global-map mode (0-based)
      row?: number;              // Row position in global-map mode (0-based)
    };
  };
}
```

### Field Descriptions

- **id**: Must be unique across all jobs. Used internally for routing and state management.
- **title**: Shown in job cards, headers, and throughout the UI. Should be concise (typically 1-3 words).
- **description**: 1-2 sentence summary. Shown in job cards and recommendation screens.
- **icon**: Single emoji or icon character. Used in buttons, cards, and map nodes.
- **color**: Primary brand color for this job. Used for buttons, borders, progress indicators, and accents.
- **tags**: 2-4 short descriptive tags. Typically include emoji + text (e.g., "🛠️ Hands on").
- **levels**: Ordered array of levels that make up the job progression.
- **pathModeId**: Visual layout strategy. See [Path Mode Options](#path-mode-options) for details.
- **pathOverrides**: Only used when `pathModeId === "global-map"`. Controls position in the global canvas.

---

## Level Configuration

A **Level** represents a stage or milestone within a job path. Users progress through levels sequentially (or via branches).

### Required Fields

```typescript
{
  id: number;                    // Unique identifier within the job (typically 1, 2, 3...)
  title: string;                 // Display name (e.g., "Ausbildungsstart")
  status: "locked" | "unlocked" | "completed";
  // - "locked": User cannot access yet (default for all except first level)
  // - "unlocked": User can start this level (first level should be "unlocked")
  // - "completed": User has finished this level
  
  icon: string;                 // Emoji or icon (e.g., "🛠️")
  scenarios: Scenario[];         // Array of scenarios (see Scenario Configuration below)
}
```

### Optional Fields (for Branching Paths)

```typescript
{
  row?: number;                  // Row number (0-based). Multiple levels can share the same row.
  // Used with pathModeId: "branching" to create parallel branches.
  // Example: Levels 2 and 3 both have row: 1, creating a branch from level 1.
  
  nextLevelIds?: number[];      // Array of level IDs this level connects to.
  // If omitted, connects to the next sequential level (id + 1).
  // Used with pathModeId: "branching" to create explicit graph connections.
  // Example: Level 1 has nextLevelIds: [2, 3] to branch into two paths.
}
```

### Field Descriptions

- **id**: Must be unique within the job. Typically sequential (1, 2, 3...) but can be any number.
- **title**: Shown on level buttons and in headers. Should be concise (1-3 words).
- **status**: Controls access and visual state. First level should be `"unlocked"`, others `"locked"`.
- **icon**: Emoji shown on the level button in the map view.
- **scenarios**: Ordered array of interactive scenarios. Users complete all scenarios to finish the level.
- **row**: Only needed for branching layouts. Defines which row the level appears on (0 = top).
- **nextLevelIds**: Only needed for branching layouts. Explicitly defines which levels come next.

### Level Progression Rules

1. **Sequential (default)**: If `row` and `nextLevelIds` are omitted, levels connect sequentially (1 → 2 → 3).
2. **Branching**: Use `row` to place multiple levels on the same row, and `nextLevelIds` to define connections.
3. **Unlocking**: Levels unlock when their prerequisite level(s) are completed.

---

## Scenario Configuration

A **Scenario** is an interactive question, task, or information display within a level.

### Required Fields

```typescript
{
  id: number;                    // Unique identifier within the level (typically 1, 2, 3...)
  scenario: string;              // The question, prompt, or information text
  imageUrl: string;              // URL to an image displayed with the scenario
  type: ScenarioType;            // One of the scenario types (see below)
  options: Array<Option>;        // Array of answer options (see Option Configuration below)
}
```

### Optional Fields

```typescript
{
  allowTextInput?: boolean;      // Required for "text-field" and "single-select-or-text" types
  conversationHistory?: Array<{   // Only for "llm-interactive" type
    role: "user" | "assistant";
    content: string;
  }>;
  facts?: Array<Fact>;           // Only for "bento-grid" type (see below)
}
```

### Scenario Types

#### 1. `"single-select-correct"`

**Purpose**: Multiple choice question with one correct answer.

**Required**:
- `options` array with at least 2 options
- Each option must have `correct: true` (exactly one) or `correct: false`
- Each option must have `feedback` string

**Behavior**: User must select the correct answer to proceed. Shows immediate feedback.

**Example**:
```typescript
{
  id: 1,
  scenario: "Warum ist es wichtig, Materialien vor der Verarbeitung zu prüfen?",
  imageUrl: "https://...",
  type: "single-select-correct",
  options: [
    {
      id: 1,
      text: "Damit ich weiß, ob das Material die richtige Größe hat",
      correct: true,
      feedback: "Perfekt! Genau so arbeitet man professionell. 🎯"
    },
    {
      id: 2,
      text: "Weil der Ausbilder es so will",
      correct: false,
      feedback: "Es gibt einen guten Grund: Falsche Maße führen zu Ausschuss. 💭"
    }
  ]
}
```

---

#### 2. `"single-select-no-correct"`

**Purpose**: Multiple choice question with no right/wrong answer (opinion, preference, etc.).

**Required**:
- `options` array with at least 2 options
- Each option must have `feedback` string
- `correct` property is NOT needed (and ignored if present)

**Behavior**: User can select any option to proceed. Shows feedback for the selected option.

**Example**:
```typescript
{
  id: 1,
  scenario: "Wie fühlst du dich bei neuen Projekten?",
  imageUrl: "https://...",
  type: "single-select-no-correct",
  options: [
    {
      id: 1,
      text: "Sehr motiviert und neugierig",
      feedback: "Das ist genau die richtige Einstellung! 🚀"
    },
    {
      id: 2,
      text: "Etwas unsicher, aber bereit zu lernen",
      feedback: "Unsicherheit ist völlig normal am Anfang. 💪"
    }
  ]
}
```

---

#### 3. `"multiple-select"`

**Purpose**: Multiple choice question where user must select ALL correct options.

**Required**:
- `options` array with at least 2 options
- Each option must have `correct: true` or `correct: false`
- At least one option must be `correct: true`
- Each option must have `feedback` string

**Behavior**: User can select multiple options. Must select ALL correct options (and no incorrect ones) to proceed.

**Example**:
```typescript
{
  id: 1,
  scenario: "Welche Sicherheitsmaßnahmen sind wichtig? (Wähle alle zutreffenden)",
  imageUrl: "https://...",
  type: "multiple-select",
  options: [
    {
      id: 1,
      text: "Schutzbrille tragen",
      correct: true,
      feedback: "Richtig! Schutzbrillen schützen deine Augen. 👓"
    },
    {
      id: 2,
      text: "Handschuhe anziehen",
      correct: true,
      feedback: "Genau! Handschuhe schützen vor Schnitten. 🧤"
    },
    {
      id: 3,
      text: "Lange Haare offen tragen",
      correct: false,
      feedback: "Falsch! Lange Haare müssen zusammengebunden werden. ⚠️"
    }
  ]
}
```

---

#### 4. `"text-field"`

**Purpose**: Free-text answer input.

**Required**:
- `options` can be empty array `[]` or omitted
- `allowTextInput: true` (required)
- No `correct` properties needed

**Behavior**: User enters free text. Can proceed once text is entered (no validation).

**Example**:
```typescript
{
  id: 1,
  scenario: "Beschreibe kurz, wie du vorgehen würdest, um das Problem zu lösen.",
  imageUrl: "https://...",
  type: "text-field",
  options: [],
  allowTextInput: true
}
```

---

#### 5. `"single-select-or-text"`

**Purpose**: User can either select from options OR enter custom text.

**Required**:
- `options` array with at least 1 option
- `allowTextInput: true` (required)
- Each option must have `feedback` string
- `correct` property is NOT needed (and ignored if present)

**Behavior**: User can select a predefined option OR type custom text. Both paths allow progression.

**Example**:
```typescript
{
  id: 1,
  scenario: "Passt die Ausbildung bei Sollich zu dir?",
  imageUrl: "https://...",
  type: "single-select-or-text",
  allowTextInput: true,
  options: [
    {
      id: 1,
      text: "Ja, das klingt genau nach mir!",
      feedback: "Perfekt! Lass uns quatschen. 🚀"
    },
    {
      id: 2,
      text: "Klingt gut, aber ich bin noch unsicher",
      feedback: "Kein Problem! Wir beantworten alle deine Fragen. 💬"
    }
  ]
}
```

---

#### 6. `"llm-interactive"`

**Purpose**: Dynamic conversation powered by an LLM (Large Language Model).

**Required**:
- `options` can be empty array `[]` or omitted
- `conversationHistory` is optional (used to resume conversations)

**Behavior**: User has a free-form conversation with an AI. The scenario text serves as the initial prompt/context.

**Example**:
```typescript
{
  id: 1,
  scenario: "Du stehst in der großen Montagehalle bei SOLLICH und baust an einer neuen Anlage für Schokoriegel 🍫. Ein schweres Bauteil will sich einfach nicht in den Rahmen schieben lassen, obwohl es laut Plan passen müsste. Ein falscher Handgriff könnte das teure Material beschädigen. Was machst du? 🛠️",
  imageUrl: "https://...",
  type: "llm-interactive",
  options: []
}
```

---

#### 7. `"bento-grid"`

**Purpose**: Informational display in a grid layout (no interaction required).

**Required**:
- `facts` array with at least 1 fact
- `options` can be empty array `[]` or omitted

**Facts Structure**:
```typescript
facts: Array<{
  title: string;                 // Fact title/heading
  value: string;                 // Fact description/content
  icon: string;                  // Emoji or icon
  layout?: {
    colSpan?: number;            // Column span (1-2, default: 1)
    rowSpan?: number;            // Row span (1-2, default: 1)
  };
}>
```

**Behavior**: Displays information in a grid. User can proceed immediately (no answer required).

**Example**:
```typescript
{
  id: 1,
  scenario: "Lerne mehr über Sollich",
  imageUrl: "https://...",
  type: "bento-grid",
  options: [],
  facts: [
    {
      title: "Führerschein-Support",
      value: "Wir unterstützen dich finanziell bei deinem Führerschein.",
      icon: "🚗",
      layout: { colSpan: 1, rowSpan: 1 }
    },
    {
      title: "Ausschlafen inklusive",
      value: "Bei uns geht's entspannt um 9:00 Uhr los.",
      icon: "⏰",
      layout: { colSpan: 2, rowSpan: 1 }
    }
  ]
}
```

---

### Option Configuration

Each option in a scenario's `options` array has the following structure:

```typescript
{
  id: number;                    // Unique identifier within the scenario (typically 1, 2, 3...)
  text: string;                  // The option text displayed to the user
  correct?: boolean;             // Required for "single-select-correct" and "multiple-select"
                                 // true = correct answer, false = incorrect answer
                                 // Ignored for other scenario types
  feedback: string;              // Feedback message shown after selection (required for all types)
}
```

**Notes**:
- `id` must be unique within the scenario
- `text` should be concise (typically 1-2 sentences)
- `correct` is only used for types that have right/wrong answers
- `feedback` is always shown after the user interacts with the option

---

## Path Mode Options

Path modes control how job paths are visualized on the map screen.

### Available Modes

#### 1. `"linear"` (Default)

**Description**: Single trail that snakes down the page in a zig-zag pattern.

**Best For**: Classic onboarding flows, sequential training programs.

**Level Requirements**: No special fields needed. Levels connect sequentially (1 → 2 → 3).

**Example Use Case**: A straightforward apprenticeship program with clear stages.

---

#### 2. `"branching"`

**Description**: Graph layout with shared rows and explicit branches defined per level.

**Best For**: Role trees, career paths with multiple specializations, decision points.

**Level Requirements**:
- Use `row` to place multiple levels on the same row (creates branches)
- Use `nextLevelIds` to explicitly define which levels connect to which

**Example**:
```typescript
{
  id: 1,
  title: "Ausbildungsstart",
  row: 0,
  nextLevelIds: [2, 3],  // Branches into two paths
  // ...
},
{
  id: 2,
  title: "CAD Spezialist",
  row: 1,                 // Same row as level 3 = parallel branches
  nextLevelIds: [4],      // Merges back into level 4
  // ...
},
{
  id: 3,
  title: "Konstrukteur",
  row: 1,                 // Same row as level 2 = parallel branches
  nextLevelIds: [4],      // Merges back into level 4
  // ...
},
{
  id: 4,
  title: "Finale",
  row: 2,                 // After merge
  // ...
}
```

---

#### 3. `"global-map"`

**Description**: Nested multi-job map that plots every path onto a single zoomable canvas.

**Best For**: Overview of all available jobs, exploration mode, talent atlas.

**Level Requirements**: Same as `"linear"` (sequential connections).

**Job Requirements**: Use `pathOverrides.global` to position the job on the canvas:
```typescript
{
  id: "job-id",
  pathModeId: "global-map",
  pathOverrides: {
    global: {
      column: 0,  // Left column
      row: 0      // Top row
    }
  },
  // ...
}
```

**Note**: Only one job should use `"global-map"` mode (typically a special "Alle Berufe" job).

---

## Complete Examples

### Example 1: Simple Linear Job

```typescript
{
  id: "industriemechaniker",
  title: "Industriemechaniker:in",
  description: "Maschinen bauen, reparieren und optimieren",
  icon: "🛠️",
  color: "#3b82f6",
  tags: ["🛠️ Hands on", "⚙️ Technik"],
  pathModeId: "linear",  // Optional, "linear" is default
  levels: [
    {
      id: 1,
      title: "Ausbildungsstart",
      status: "unlocked",
      icon: "🛠️",
      scenarios: [
        {
          id: 1,
          scenario: "Warum ist Präzision wichtig?",
          imageUrl: "https://...",
          type: "single-select-correct",
          options: [
            {
              id: 1,
              text: "Weil es Qualität sichert",
              correct: true,
              feedback: "Richtig! 🎯"
            },
            {
              id: 2,
              text: "Weil der Chef es will",
              correct: false,
              feedback: "Es gibt einen guten Grund. 💭"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Fertigung",
      status: "locked",  // Will unlock when level 1 is completed
      icon: "📋",
      scenarios: [
        // ... more scenarios
      ]
    }
  ]
}
```

### Example 2: Branching Job

```typescript
{
  id: "technischer-zeichner",
  title: "Technischer Zeichner:in",
  description: "Vom Blatt Papier zum digitalen 3D-Modell",
  icon: "📐",
  color: "#8b5cf6",
  tags: ["📐 Genauigkeit", "🖥️ Digital"],
  pathModeId: "branching",
  levels: [
    {
      id: 1,
      title: "Ausbildungsstart",
      status: "unlocked",
      icon: "🖥️",
      row: 0,
      nextLevelIds: [2, 3],  // Branches into two paths
      scenarios: [
        // ... scenarios
      ]
    },
    {
      id: 2,
      title: "CAD Spezialist",
      status: "locked",
      icon: "🔧",
      row: 1,                 // Same row as level 3
      nextLevelIds: [4],      // Merges into level 4
      scenarios: [
        // ... scenarios
      ]
    },
    {
      id: 3,
      title: "Konstrukteur",
      status: "locked",
      icon: "📐",
      row: 1,                 // Same row as level 2 (parallel branch)
      nextLevelIds: [4],      // Merges into level 4
      scenarios: [
        // ... scenarios
      ]
    },
    {
      id: 4,
      title: "Finale",
      status: "locked",
      icon: "🏁",
      row: 2,                 // After merge
      scenarios: [
        // ... scenarios
      ]
    }
  ]
}
```

### Example 3: Scenario Type Examples

```typescript
// Multiple Select
{
  id: 1,
  scenario: "Welche Sicherheitsmaßnahmen sind wichtig? (Wähle alle)",
  imageUrl: "https://...",
  type: "multiple-select",
  options: [
    { id: 1, text: "Schutzbrille", correct: true, feedback: "Richtig! 👓" },
    { id: 2, text: "Handschuhe", correct: true, feedback: "Genau! 🧤" },
    { id: 3, text: "Offene Haare", correct: false, feedback: "Falsch! ⚠️" }
  ]
}

// Text Field
{
  id: 2,
  scenario: "Beschreibe deine Vorgehensweise.",
  imageUrl: "https://...",
  type: "text-field",
  options: [],
  allowTextInput: true
}

// LLM Interactive
{
  id: 3,
  scenario: "Du stehst vor einem Problem. Was machst du?",
  imageUrl: "https://...",
  type: "llm-interactive",
  options: []
}

// Bento Grid
{
  id: 4,
  scenario: "Lerne mehr über uns",
  imageUrl: "https://...",
  type: "bento-grid",
  options: [],
  facts: [
    {
      title: "Führerschein-Support",
      value: "Wir unterstützen dich finanziell.",
      icon: "🚗",
      layout: { colSpan: 1, rowSpan: 1 }
    },
    {
      title: "Ausschlafen",
      value: "Start um 9:00 Uhr.",
      icon: "⏰",
      layout: { colSpan: 2, rowSpan: 1 }
    }
  ]
}
```

---

## Validation Rules

### Job Validation

- ✅ `id` must be unique across all jobs
- ✅ `title`, `description`, `icon`, `color` are required
- ✅ `tags` must be a non-empty array
- ✅ `levels` must be a non-empty array
- ✅ `pathModeId` must be one of: `"linear"`, `"branching"`, `"global-map"` (or omitted for default)
- ✅ If `pathModeId === "global-map"`, `pathOverrides.global` should be provided

### Level Validation

- ✅ `id` must be unique within the job
- ✅ `title`, `status`, `icon`, `scenarios` are required
- ✅ `status` must be one of: `"locked"`, `"unlocked"`, `"completed"`
- ✅ First level should have `status: "unlocked"`
- ✅ `scenarios` must be a non-empty array
- ✅ If `pathModeId === "branching"`, `row` and `nextLevelIds` should be provided
- ✅ `nextLevelIds` must reference valid level IDs within the same job

### Scenario Validation

- ✅ `id` must be unique within the level
- ✅ `scenario`, `imageUrl`, `type`, `options` are required
- ✅ `type` must be one of the 7 scenario types
- ✅ For `"single-select-correct"`: Exactly one option must have `correct: true`
- ✅ For `"multiple-select"`: At least one option must have `correct: true`
- ✅ For `"text-field"` and `"single-select-or-text"`: `allowTextInput: true` is required
- ✅ For `"bento-grid"`: `facts` array is required (at least 1 fact)
- ✅ All options must have `feedback` string

### Option Validation

- ✅ `id` must be unique within the scenario
- ✅ `text` and `feedback` are required
- ✅ `correct` is required for `"single-select-correct"` and `"multiple-select"` types

---

## Content Guidelines

### Writing Scenarios

- **Be conversational**: Use "Du" (informal "you" in German) to create a personal connection
- **Include context**: Reference the company, role, or situation
- **Use emojis sparingly**: 1-2 emojis per scenario text is enough
- **Keep it concise**: Scenario text should be 1-3 sentences
- **Make it engaging**: Use questions, challenges, or real-world situations

### Writing Options

- **Be clear**: Options should be 1-2 sentences max
- **Avoid ambiguity**: Make sure correct answers are clearly correct
- **Provide helpful feedback**: Feedback should explain WHY an answer is right/wrong
- **Use positive tone**: Even for wrong answers, be encouraging

### Writing Feedback

- **Be specific**: Explain what makes the answer right or wrong
- **Be encouraging**: Use positive language even when correcting
- **Include emojis**: 1 emoji per feedback message adds personality
- **Keep it brief**: 1-2 sentences is ideal

---

## Common Patterns

### Pattern 1: Progressive Difficulty

Start with easy questions and gradually increase complexity:

```typescript
levels: [
  {
    id: 1,
    title: "Grundlagen",
    scenarios: [
      { type: "single-select-correct", /* easy question */ },
      { type: "single-select-correct", /* medium question */ }
    ]
  },
  {
    id: 2,
    title: "Vertiefung",
    scenarios: [
      { type: "multiple-select", /* harder question */ },
      { type: "text-field", /* open-ended */ }
    ]
  }
]
```

### Pattern 2: Mix of Question Types

Vary question types to keep users engaged:

```typescript
scenarios: [
  { type: "single-select-correct" },    // Knowledge check
  { type: "multiple-select" },          // Comprehensive check
  { type: "single-select-no-correct" }, // Opinion/preference
  { type: "llm-interactive" },          // Open conversation
  { type: "bento-grid" }                // Information display
]
```

### Pattern 3: Branching Career Paths

Create decision points that lead to different specializations:

```typescript
{
  id: 1,
  row: 0,
  nextLevelIds: [2, 3],  // User chooses path
  // ...
},
{
  id: 2,
  title: "Spezialisierung A",
  row: 1,
  // ...
},
{
  id: 3,
  title: "Spezialisierung B",
  row: 1,  // Parallel to level 2
  // ...
}
```

---

## Summary Checklist

When creating a new job, ensure:

- [ ] Job has unique `id`, `title`, `description`, `icon`, `color`, `tags`
- [ ] Job has at least one level
- [ ] First level has `status: "unlocked"`
- [ ] Each level has at least one scenario
- [ ] Each scenario has valid `type` and required fields for that type
- [ ] All options have `feedback` strings
- [ ] If using branching, `row` and `nextLevelIds` are properly configured
- [ ] All image URLs are valid and accessible
- [ ] Text is in German (or appropriate language)
- [ ] Emojis are used appropriately (not overused)

---

**Last Updated**: 2024
**Version**: 1.0

