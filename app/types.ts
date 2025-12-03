export type Screen =
  | "landing"
  | "campus"
  | "map"
  | "interaction"
  | "victory"
  | "expressApply";
export type LevelStatus = "locked" | "unlocked" | "completed";

export type ScenarioType =
  | "single-select-correct" // single select with correct answer
  | "single-select-no-correct" // single select with no right answer
  | "multiple-select" // multiple select
  | "text-field" // custom answer text field
  | "single-select-or-text" // single select or custom text input
  | "llm-interactive"; // dynamic LLM-powered interactive scenario

export interface Scenario {
  id: number;
  scenario: string;
  imageUrl: string;
  type: ScenarioType;
  options: Array<{
    id: number;
    text: string;
    correct?: boolean; // Required for single-select-correct and multiple-select
    feedback: string;
  }>;
  allowTextInput?: boolean; // For text-field and single-select-or-text types
  // For llm-interactive type:
  initialPrompt?: string; // System prompt for the LLM
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>; // Conversation history for dynamic scenarios
}

export interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  icon: string;
  scenarios: Scenario[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  levels: Level[];
}

export interface ImageData {
  id: number;
  scene: string;
  prompt: string;
  description: string;
  tags: string[];
  uploadUrl: string;
}
