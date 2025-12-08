import { useCallback, useEffect, useRef, useState } from "react";

import { X } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CompanyConfig, Level, Scenario } from "../types";
import {
  SingleSelectCorrectView,
  SingleSelectNoCorrectView,
  MultipleSelectView,
  TextFieldView,
  SingleSelectOrTextView,
  LLMInteractiveView,
  BentoGridView,
  ScenarioText,
} from "./scenarios";

interface InteractionViewProps {
  config: CompanyConfig;
  currentLevel: Level;
  currentScenario: Scenario;
  currentLevelId: number;
  currentScenarioIndex: number;
  totalScenarios: number;
  totalLevels: number;
  completedLevels: number;
  selectedOption?: number;
  selectedOptions?: number[]; // For multiple-select type
  textAnswer: string;
  status: "none" | "wrong" | "correct";
  showHint: boolean;
  debugMode?: boolean;
  onOptionSelect: (id: number | undefined) => void;
  onOptionsToggle?: (id: number) => void; // For multiple-select type
  onTextAnswerChange: (value: string) => void;
  onContinue: () => void;
  onSettingsClick: () => void;
  onHintToggle: () => void;
  onExpressApply: () => void;
  onExit: () => void;
  onDebugCompleteLevel?: () => void;
}

interface Particle {
  id: number;
  left: number;
}

export function InteractionView({
  config,
  currentLevel,
  currentScenario,
  currentLevelId,
  currentScenarioIndex,
  totalScenarios,
  totalLevels,
  completedLevels,
  selectedOption,
  selectedOptions = [],
  textAnswer,
  status,
  showHint,
  debugMode = false,
  onOptionSelect,
  onOptionsToggle,
  onTextAnswerChange,
  onContinue,
  onSettingsClick: _onSettingsClick,
  onHintToggle,
  onExpressApply,
  onExit,
  onDebugCompleteLevel,
}: InteractionViewProps) {
  const isMultipleSelect = currentScenario.type === "multiple-select";
  const isTextField = currentScenario.type === "text-field";
  const isSingleSelectOrText = currentScenario.type === "single-select-or-text";
  const isSingleSelectNoCorrect =
    currentScenario.type === "single-select-no-correct";
  const isSingleSelectCorrect =
    currentScenario.type === "single-select-correct";
  const isLLMInteractive = currentScenario.type === "llm-interactive";
  const isBentoGrid = currentScenario.type === "bento-grid";

  // LLM Interactive state for ScenarioText display
  const [currentScenarioText, setCurrentScenarioText] = useState(
    currentScenario.scenario
  );
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const [llmTurns, setLlmTurns] = useState(0);
  const llmSubmitRef = useRef<(() => void) | null>(null);

  // Reset LLM state when the scenario changes to avoid carrying over prior text
  useEffect(() => {
    setCurrentScenarioText(currentScenario.scenario);
    setIsLLMLoading(false);
    setLlmTurns(0);
    llmSubmitRef.current = null;
  }, [currentScenario.id, currentScenario.scenario]);

  const isLastScenarioInLevel = currentScenarioIndex === totalScenarios - 1;
  const isFinalStage = currentLevelId === totalLevels && isLastScenarioInLevel;

  const hasAnswer = isBentoGrid
    ? true // Bento grid is informational, always has "answer" to proceed
    : isLLMInteractive
      ? textAnswer.trim().length > 0 && !isLLMLoading
      : isMultipleSelect
        ? selectedOptions.length > 0
        : isTextField || isSingleSelectOrText
          ? selectedOption !== undefined || textAnswer.trim() !== ""
          : selectedOption !== undefined;

  // Calculate progress: completed levels + progress within current level
  const levelProgress = isLastScenarioInLevel
    ? 1
    : (currentScenarioIndex + 1) / totalScenarios;
  const progressPercentage =
    totalLevels > 0
      ? ((completedLevels + levelProgress) / totalLevels) * 100
      : 0;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [, setGearClickCount] = useState(0);
  const [funDialogOpen, setFunDialogOpen] = useState(false);
  const [funDialog50Open, setFunDialog50Open] = useState(false);
  const [funDialog100Open, setFunDialog100Open] = useState(false);

  const spawnParticle = useCallback(() => {
    const id = particleIdCounter;
    const left = Math.random() * 100; // Random position 0-100%
    setParticleIdCounter((prev) => prev + 1);
    setParticles((prev) => [...prev, { id, left }]);

    // Remove particle after animation completes (2 seconds)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 2000);

    // Track clicks and show fun dialogs at milestones
    setGearClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 21) {
        setFunDialogOpen(true);
      } else if (newCount === 50) {
        setFunDialog50Open(true);
      } else if (newCount === 100) {
        setFunDialog100Open(true);
      }
      return newCount;
    });
  }, [particleIdCounter]);

  return (
    <div className="relative flex h-[100dvh] flex-col bg-white">
      <header className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-3 px-2 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 backdrop-blur-sm transition hover:bg-slate-100"
            aria-label="Zurück"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={() => {
              spawnParticle();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 backdrop-blur-sm transition hover:bg-slate-200"
          >
            ⚙️
          </button>
          {debugMode && onDebugCompleteLevel && (
            <button
              onClick={onDebugCompleteLevel}
              className="flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-red-600"
              title="Debug: Complete Level (Ctrl/Cmd + Shift + C)"
            >
              ⚡ Finish Level
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setHelpOpen(true);
              setLoading(true);
              // Simulate loading a tip
              setTimeout(() => {
                setHelpText(
                  "💡 Tipp: Denk daran, dass Sicherheit und Qualität bei TechSteel immer Priorität haben!"
                );
                setLoading(false);
              }, 500);
            }}
            className="flex items-center gap-2 rounded-full bg-slate-100/50 px-2 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-slate-200"
          >
            <span>?</span>
            Tip holen
          </button>
          <div className="flex grow items-center justify-center">
            <div className="size-10 rounded-full bg-slate-100/50 backdrop-blur-sm">
              <CircularProgressbarWithChildren
                value={progressPercentage}
                styles={{
                  path: {
                    stroke: "#8b5cf6",
                    strokeLinecap: "round",
                    transition: "stroke-dashoffset 0.5s ease 0s",
                  },
                  trail: {
                    stroke: "#e5e7eb",
                  },
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">
                    {currentScenarioIndex + 1}/{totalScenarios}
                  </span>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-auto pb-6">
        <div className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden border-b-0 border-purple-200 bg-slate-100">
            <img
              src={currentScenario.imageUrl}
              alt={currentLevel.title}
              className="h-[150px] w-full object-cover lg:h-[320px]"
            />
          </div>

          <ScenarioText
            scenario={currentScenario}
            currentScenarioText={currentScenarioText}
            isLLMLoading={isLLMLoading}
          />

          <div className="px-4">
            {showHint && (
              <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  💡 Tipp: Denk daran, dass Sicherheit und Qualität bei{" "}
                  {config.company.name} immer Priorität haben!
                </p>
              </div>
            )}

            {currentScenario.type === "single-select-correct" && (
              <SingleSelectCorrectView
                scenario={currentScenario}
                selectedOption={selectedOption}
                status={status}
                hasAnswer={hasAnswer}
                onOptionSelect={onOptionSelect}
                onContinue={onContinue}
                selectedOptions={selectedOptions}
                textAnswer={textAnswer}
                onOptionsToggle={onOptionsToggle}
                onTextAnswerChange={onTextAnswerChange}
              />
            )}

            {currentScenario.type === "single-select-no-correct" && (
              <SingleSelectNoCorrectView
                scenario={currentScenario}
                selectedOption={selectedOption}
                hasAnswer={hasAnswer}
                onOptionSelect={onOptionSelect}
                textAnswer={textAnswer}
                onTextAnswerChange={onTextAnswerChange}
                selectedOptions={selectedOptions}
                status={status}
                onOptionsToggle={onOptionsToggle}
                onContinue={onContinue}
              />
            )}

            {currentScenario.type === "multiple-select" && (
              <MultipleSelectView
                scenario={currentScenario}
                selectedOptions={selectedOptions}
                status={status}
                hasAnswer={hasAnswer}
                onOptionsToggle={onOptionsToggle}
                selectedOption={selectedOption}
                textAnswer={textAnswer}
                onOptionSelect={onOptionSelect}
                onTextAnswerChange={onTextAnswerChange}
                onContinue={onContinue}
              />
            )}

            {currentScenario.type === "text-field" && (
              <TextFieldView
                scenario={currentScenario}
                textAnswer={textAnswer}
                hasAnswer={hasAnswer}
                onTextAnswerChange={onTextAnswerChange}
                onContinue={onContinue}
                selectedOption={selectedOption}
                selectedOptions={selectedOptions}
                status={status}
                onOptionSelect={onOptionSelect}
                onOptionsToggle={onOptionsToggle}
              />
            )}

            {currentScenario.type === "single-select-or-text" && (
              <SingleSelectOrTextView
                scenario={currentScenario}
                selectedOption={selectedOption}
                textAnswer={textAnswer}
                hasAnswer={hasAnswer}
                onOptionSelect={onOptionSelect}
                onTextAnswerChange={onTextAnswerChange}
                onContinue={onContinue}
                selectedOptions={selectedOptions}
                status={status}
                onOptionsToggle={onOptionsToggle}
              />
            )}

            {currentScenario.type === "llm-interactive" && (
              <LLMInteractiveView
                scenario={currentScenario}
                textAnswer={textAnswer}
                hasAnswer={hasAnswer}
                onTextAnswerChange={onTextAnswerChange}
                onContinue={onContinue}
                selectedOption={selectedOption}
                selectedOptions={selectedOptions}
                status={status}
                onOptionSelect={onOptionSelect}
                onOptionsToggle={onOptionsToggle}
                onScenarioTextChange={setCurrentScenarioText}
                onLoadingChange={setIsLLMLoading}
                registerSubmit={(fn) => {
                  llmSubmitRef.current = fn;
                }}
              />
            )}

            {currentScenario.type === "bento-grid" && (
              <BentoGridView
                scenario={currentScenario}
                hasAnswer={hasAnswer}
                onContinue={onContinue}
                selectedOption={selectedOption}
                selectedOptions={selectedOptions}
                textAnswer={textAnswer}
                status={status}
                onOptionSelect={onOptionSelect}
                onOptionsToggle={onOptionsToggle}
                onTextAnswerChange={onTextAnswerChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      {(isSingleSelectNoCorrect ||
        isTextField ||
        isSingleSelectOrText ||
        isLLMInteractive ||
        isBentoGrid) &&
        isFinalStage && (
          <footer
            className="border-t-2 bg-white px-4 py-4"
            style={{
              paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
            }}
          >
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={
                  isLLMInteractive
                    ? isLLMLoading || textAnswer.trim().length === 0
                    : !hasAnswer || isLLMLoading
                }
                onClick={() => {
                  if (isLLMInteractive) {
                    if (llmSubmitRef.current) {
                      llmSubmitRef.current();
                    }
                    const nextTurns = llmTurns + 1;
                    setLlmTurns(nextTurns);
                    onContinue();
                  } else {
                    onExpressApply();
                  }
                }}
                size="lg"
                variant="primary"
                className="w-full"
              >
                {isLLMInteractive
                  ? llmTurns >= 3
                    ? "Beenden"
                    : "Weiter"
                  : config.copy.submit}
              </Button>
            </div>
          </footer>
        )}

      {(isSingleSelectCorrect || isMultipleSelect) && (
        <footer
          className="border-t-2 bg-white px-4 py-4"
          style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}
        >
          <div className="mx-auto max-w-2xl">
            <Button
              disabled={!hasAnswer}
              onClick={onContinue}
              size="lg"
              variant={
                status === "wrong"
                  ? "danger"
                  : status === "correct"
                    ? "secondary"
                    : "primary"
              }
              className="w-full"
            >
              {status === "none" && "Absenden"}
              {status === "correct" && "Weiter"}
              {status === "wrong" && "Erneut"}
            </Button>
          </div>
        </footer>
      )}

      {/* Footer for non-final reflection scenarios */}
      {(isSingleSelectNoCorrect ||
        isTextField ||
        isSingleSelectOrText ||
        isLLMInteractive ||
        isBentoGrid) &&
        !isFinalStage && (
          <footer
            className="border-t-2 bg-white px-4 py-4"
            style={{
              paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
            }}
          >
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={
                  isLLMInteractive
                    ? isLLMLoading || textAnswer.trim().length === 0
                    : !hasAnswer || isLLMLoading
                }
                onClick={() => {
                  if (isLLMInteractive) {
                    if (llmSubmitRef.current) {
                      llmSubmitRef.current();
                    }
                    setLlmTurns((prev) => {
                      const next = prev + 1;
                      if (next >= 4) {
                        onContinue();
                      }
                      return next;
                    });
                  } else {
                    onContinue();
                  }
                }}
                size="lg"
                variant="primary"
                className="w-full"
              >
                {isLLMInteractive
                  ? llmTurns >= 3
                    ? "Beenden"
                    : "Weiter"
                  : "Weiter"}
              </Button>
            </div>
          </footer>
        )}

      {/* Particle container - fixed to viewport */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="animate-fall absolute text-4xl"
            style={{
              left: `${particle.left}%`,
              top: "-5rem",
            }}
          >
            ⚙️
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fall {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(100vh + 5rem));
          }
        }
        .animate-fall {
          animation: fall 1.5s linear forwards;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4),
                        0 0 20px 0 rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0),
                        0 0 30px 10px rgba(59, 130, 246, 0.4);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-h-[80%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hilfe</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center overflow-y-auto p-4">
              <div className="text-muted-foreground">Lade Tipp...</div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{helpText}</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={funDialogOpen}
        onOpenChange={(open: boolean) => {
          // Only allow closing via explicit button clicks, not outside clicks
          if (!open) {
            setFunDialogOpen(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>⚙️</DialogTitle>
          </DialogHeader>
          <p>
            Hey, cool dass dir das Zahnrad Spaß macht. Hier passiert leider
            nichts weiter, das ist nur zum Zeitvertreib 😉
          </p>
          <DialogFooter>
            <Button onClick={() => setFunDialogOpen(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={funDialog50Open}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setFunDialog50Open(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>⚙️⚙️</DialogTitle>
          </DialogHeader>
          <p>
            Wow, du machst ja immer noch weiter! Das Zahnrad scheint dich echt
            zu fesseln 😄
          </p>
          <DialogFooter>
            <Button onClick={() => setFunDialog50Open(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={funDialog100Open}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setFunDialog100Open(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>🏆⚙️</DialogTitle>
          </DialogHeader>
          <p>
            Respekt! Du bist definitiv der ungekrönte Klick-Meister. 100 Mal auf
            ein Zahnrad klicken – das ist schon eine Leistung! 🎯
          </p>
          <DialogFooter>
            <Button onClick={() => setFunDialog100Open(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
