import { Scenario } from "../../types";

export interface BaseScenarioViewProps {
  scenario: Scenario;
  selectedOption?: number;
  selectedOptions?: number[];
  textAnswer: string;
  status: "none" | "wrong" | "correct";
  onOptionSelect: (id: number | undefined) => void;
  onOptionsToggle?: (id: number) => void;
  onTextAnswerChange: (value: string) => void;
  onContinue: () => void;
}

