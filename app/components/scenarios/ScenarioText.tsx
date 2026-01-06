import { Loader2 } from "lucide-react";
import { Scenario } from "../../types";

interface ScenarioTextProps {
  scenario: Scenario;
  currentScenarioText?: string;
  isLLMLoading?: boolean;
}

export function ScenarioText({
  scenario,
  currentScenarioText,
  isLLMLoading,
}: ScenarioTextProps) {
  const isLLMInteractive = scenario.type === "llm-interactive";

  return (
    <div className="mx-4 mb-6 mt-4 rounded-3xl border-4 border-slate-200 bg-purple-200/50 bg-white px-4 py-4">
      {isLLMInteractive ? (
        <div>
          {isLLMLoading ? (
            <div className="flex items-center gap-2 rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <p className="text-base text-purple-600 lg:text-lg">
                Lade nächste Situation...
              </p>
            </div>
          ) : (
            <div className="rounded-xl">
              <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
                {currentScenarioText || scenario.scenario}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
          {scenario.scenario}
        </p>
      )}
    </div>
  );
}
