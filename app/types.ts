export type Screen =
  | "landing"
  | "campus"
  | "map"
  | "interaction"
  | "victory"
  | "expressApply";
export type LevelStatus = "locked" | "unlocked" | "completed";

export interface Scenario {
  id: number;
  scenario: string;
  imageUrl: string;
  type: "validation" | "reflection";
  options: Array<{
    id: number;
    text: string;
    correct?: boolean;
    feedback: string;
  }>;
  allowTextInput?: boolean;
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
