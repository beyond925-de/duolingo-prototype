import { cn } from "@/lib/utils";
import { BaseScenarioViewProps } from "./ScenarioViewProps";

interface SingleSelectCorrectViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
}

export function SingleSelectCorrectView({
  scenario,
  selectedOption,
  status,
  hasAnswer,
  onOptionSelect,
  onContinue,
}: SingleSelectCorrectViewProps) {
  return (
    <>
      <h3 className="font-semibold text-slate-800">Wähle deine Antwort</h3>

      <div className="space-y-3">
        {scenario.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showFeedback = isSelected && status !== "none";

          return (
            <div key={option.id}>
              <button
                onClick={() => onOptionSelect(option.id)}
                disabled={status === "correct"}
                className={cn(
                  "w-full rounded-2xl border-2 px-5 py-3 text-left text-base font-medium transition",
                  isSelected &&
                    status === "none" &&
                    "border-sky-300 bg-sky-50",
                  isSelected &&
                    status === "correct" &&
                    "border-green-300 bg-green-50 text-green-700",
                  isSelected &&
                    status === "wrong" &&
                    "border-rose-300 bg-rose-50 text-rose-700",
                  !isSelected &&
                    "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {option.text}
              </button>

              {showFeedback && (
                <div
                  className={cn(
                    "mt-2 rounded-xl border-2 p-3 text-sm",
                    status === "correct" &&
                      "border-green-300 bg-green-50 text-green-700",
                    status === "wrong" &&
                      "border-rose-300 bg-rose-50 text-rose-700"
                  )}
                >
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

