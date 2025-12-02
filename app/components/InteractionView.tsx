import { useCallback, useState } from "react";

import { ArrowRight, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

import { config } from "../config";
import { Level, Scenario } from "../types";

interface InteractionViewProps {
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
  onOptionSelect: (id: number | undefined) => void;
  onOptionsToggle?: (id: number) => void; // For multiple-select type
  onTextAnswerChange: (value: string) => void;
  onContinue: () => void;
  onSettingsClick: () => void;
  onHintToggle: () => void;
  onExpressApply: () => void;
  onExit: () => void;
}

interface Particle {
  id: number;
  left: number;
}

export function InteractionView({
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
  onOptionSelect,
  onOptionsToggle,
  onTextAnswerChange,
  onContinue,
  onSettingsClick: _onSettingsClick,
  onHintToggle,
  onExpressApply,
  onExit,
}: InteractionViewProps) {
  const isMultipleSelect = currentScenario.type === "multiple-select";
  const isTextField = currentScenario.type === "text-field";
  const isSingleSelectOrText = currentScenario.type === "single-select-or-text";
  const isSingleSelectNoCorrect =
    currentScenario.type === "single-select-no-correct";
  const isSingleSelectCorrect =
    currentScenario.type === "single-select-correct";
  const isTextInputType = isTextField || isSingleSelectOrText;
  const isReflection =
    isSingleSelectNoCorrect || isTextField || isSingleSelectOrText;

  const isLastScenarioInLevel = currentScenarioIndex === totalScenarios - 1;
  const isFinalStage = currentLevelId === totalLevels && isLastScenarioInLevel;

  const hasAnswer = isMultipleSelect
    ? selectedOptions.length > 0
    : isTextInputType
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
    <div className="relative flex h-screen flex-col bg-white">
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

          <div className="mb-6 rounded-b-3xl border-purple-200 bg-purple-50 px-4 py-4">
            <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
              {currentScenario.scenario}
            </p>
          </div>

          <div className="px-4">
            {showHint && (
              <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  💡 Tipp: Denk daran, dass Sicherheit und Qualität bei
                  TechSteel immer Priorität haben!
                </p>
              </div>
            )}

            <h3 className="font-semibold text-slate-800">
              {isTextField
                ? "Gib deine Antwort ein"
                : isMultipleSelect
                  ? "Wähle alle zutreffenden Antworten"
                  : isSingleSelectOrText
                    ? "Wähle eine Antwort oder gib deine eigene ein"
                    : isSingleSelectNoCorrect
                      ? "Wähle deine Antwort"
                      : "Wähle deine Antwort"}
            </h3>

            {/* Show options for types that have options */}
            {!isTextField && currentScenario.options.length > 0 && (
              <div className="space-y-3">
                {currentScenario.options.map((option) => {
                  const isSelected = isMultipleSelect
                    ? selectedOptions.includes(option.id)
                    : selectedOption === option.id;
                  const showFeedback = isMultipleSelect
                    ? selectedOptions.includes(option.id) && status !== "none"
                    : isSelected &&
                      ((isSingleSelectNoCorrect && hasAnswer) ||
                        (isSingleSelectOrText && hasAnswer) ||
                        (isSingleSelectCorrect && status !== "none"));

                  return (
                    <div key={option.id}>
                      <button
                        onClick={() => {
                          if (isMultipleSelect && onOptionsToggle) {
                            onOptionsToggle(option.id);
                          } else {
                            onOptionSelect(option.id);
                            if (isSingleSelectOrText) {
                              onTextAnswerChange("");
                            }
                          }
                        }}
                        disabled={isSingleSelectCorrect && status === "correct"}
                        className={cn(
                          "w-full rounded-2xl border-2 px-5 py-3 text-left text-base font-medium transition",
                          isMultipleSelect &&
                            isSelected &&
                            "border-purple-300 bg-purple-50 text-purple-800",
                          !isMultipleSelect &&
                            isSelected &&
                            isSingleSelectNoCorrect &&
                            "border-purple-300 bg-purple-50 text-purple-800",
                          !isMultipleSelect &&
                            isSelected &&
                            isSingleSelectOrText &&
                            "border-purple-300 bg-purple-50 text-purple-800",
                          !isMultipleSelect &&
                            isSelected &&
                            isSingleSelectCorrect &&
                            status === "none" &&
                            "border-sky-300 bg-sky-50",
                          !isMultipleSelect &&
                            isSelected &&
                            isSingleSelectCorrect &&
                            status === "correct" &&
                            "border-green-300 bg-green-50 text-green-700",
                          !isMultipleSelect &&
                            isSelected &&
                            isSingleSelectCorrect &&
                            status === "wrong" &&
                            "border-rose-300 bg-rose-50 text-rose-700",
                          !isSelected &&
                            "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {isMultipleSelect && (
                          <span className="mr-2">{isSelected ? "✓" : "○"}</span>
                        )}
                        {option.text}
                      </button>

                      {showFeedback && (
                        <div
                          className={cn(
                            "mt-2 rounded-xl border-2 p-3 text-sm",
                            (isSingleSelectNoCorrect ||
                              isSingleSelectOrText ||
                              isMultipleSelect) &&
                              "border-purple-200 bg-purple-50 text-purple-800",
                            isSingleSelectCorrect &&
                              status === "correct" &&
                              "border-green-300 bg-green-50 text-green-700",
                            isSingleSelectCorrect &&
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
            )}

            {/* Show text input for text-field and single-select-or-text types */}
            {(isTextField || isSingleSelectOrText) && (
              <div
                className={cn(
                  "mt-6",
                  isSingleSelectOrText && "border-t-2 border-slate-200 pt-6"
                )}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => {
                      onTextAnswerChange(e.target.value);
                      if (isSingleSelectOrText) {
                        // Clear selected option when typing
                        onOptionSelect(undefined);
                      }
                    }}
                    placeholder={
                      isTextField
                        ? "Gib deine Antwort ein..."
                        : "Oder gib deine eigene Antwort ein..."
                    }
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pr-14 text-base focus:border-purple-300 focus:outline-none"
                  />
                  {isTextField && (
                    <button
                      onClick={onContinue}
                      disabled={!textAnswer.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple-500 p-2 text-white transition hover:bg-purple-600 disabled:bg-slate-300"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {isSingleSelectOrText && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => onTextAnswerChange("")}
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                    >
                      <span className="text-lg">🗑️</span>
                      Leeren
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      {(isSingleSelectNoCorrect || isTextField || isSingleSelectOrText) &&
        isFinalStage && (
          <footer className="border-t-2 bg-white px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={!hasAnswer}
                onClick={onExpressApply}
                size="lg"
                variant="primary"
                className="w-full"
              >
                {config.copy.submit}
              </Button>
            </div>
          </footer>
        )}

      {(isSingleSelectCorrect || isMultipleSelect) && (
        <footer className="border-t-2 bg-white px-4 py-4">
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
      {(isSingleSelectNoCorrect || isTextField || isSingleSelectOrText) &&
        !isFinalStage && (
          <footer className="border-t-2 bg-white px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={!hasAnswer}
                onClick={onContinue}
                size="lg"
                variant="primary"
                className="w-full"
              >
                Weiter
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
