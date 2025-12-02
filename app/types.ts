export type Screen = "landing" | "map" | "interaction" | "victory" | "expressApply";
export type LevelStatus = "locked" | "unlocked" | "completed";

export interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  icon: string;
  type: "validation" | "reflection";
  imageUrl: string;
  content: {
    scenario: string;
    options: Array<{
      id: number;
      text: string;
      correct?: boolean;
      feedback: string;
    }>;
    allowTextInput?: boolean;
  };
}

export interface ImageData {
  id: number;
  scene: string;
  prompt: string;
  description: string;
  tags: string[];
  uploadUrl: string;
}

