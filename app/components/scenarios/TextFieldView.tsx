import { ArrowRight } from "lucide-react";
import { BaseScenarioViewProps } from "./ScenarioViewProps";

interface TextFieldViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
}

export function TextFieldView({
  textAnswer,
  hasAnswer,
  onTextAnswerChange,
  onContinue,
}: TextFieldViewProps) {
  return (
    <>
      <h3 className="font-semibold text-slate-800">Gib deine Antwort ein</h3>

      <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => onTextAnswerChange(e.target.value)}
            placeholder="Gib deine Antwort ein..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pr-14 text-base focus:border-purple-300 focus:outline-none"
          />
          <button
            onClick={onContinue}
            disabled={!textAnswer.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple-500 p-2 text-white transition hover:bg-purple-600 disabled:bg-slate-300"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}

