import { cn } from "@/lib/utils";
import { BaseScenarioViewProps } from "./ScenarioViewProps";

interface SingleSelectNoCorrectViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
}

export function SingleSelectNoCorrectView({
  scenario,
  selectedOption,
  hasAnswer,
  onOptionSelect,
  onTextAnswerChange,
}: SingleSelectNoCorrectViewProps) {
  return (
    <>
      <h3 className="font-semibold text-slate-800">Wähle deine Antwort</h3>

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
    </>
  );
}

