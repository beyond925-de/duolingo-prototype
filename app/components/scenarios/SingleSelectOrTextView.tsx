import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseScenarioViewProps } from "./ScenarioViewProps";

interface SingleSelectOrTextViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
}

export function SingleSelectOrTextView({
  scenario,
  selectedOption,
  textAnswer,
  hasAnswer,
  onOptionSelect,
  onTextAnswerChange,
  onContinue,
}: SingleSelectOrTextViewProps) {
  return (
    <>
      <h3 className="font-semibold text-slate-800">
        Wähle eine Antwort oder gib deine eigene ein
      </h3>

      {scenario.options.length > 0 && (
        <div className="space-y-3">
          {scenario.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const showFeedback = isSelected && hasAnswer;

            return (
              <div key={option.id}>
                <button
                  onClick={() => {
                    onOptionSelect(option.id);
                    onTextAnswerChange("");
                  }}
                  className={cn(
                    "w-full rounded-2xl border-2 px-5 py-3 text-left text-base font-medium transition",
                    isSelected &&
                      "border-purple-300 bg-purple-50 text-purple-800",
                    !isSelected &&
                      "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {option.text}
                </button>

                {showFeedback && (
                  <div className="mt-2 rounded-xl border-2 border-purple-200 bg-purple-50 p-3 text-sm text-purple-800">
                    {option.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={cn("mt-6", scenario.options.length > 0 && "border-t-2 border-slate-200 pt-6")}>
        <div className="relative">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => {
              onTextAnswerChange(e.target.value);
              onOptionSelect(undefined);
            }}
            placeholder="Oder gib deine eigene Antwort ein..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pr-14 text-base focus:border-purple-300 focus:outline-none"
          />
          <button
            onClick={() => onTextAnswerChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <span className="text-lg">🗑️</span>
            Leeren
          </button>
        </div>
      </div>
    </>
  );
}

