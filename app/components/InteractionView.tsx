import { useCallback, useEffect, useState } from "react";

import { ArrowRight, Loader2, X } from "lucide-react";
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
import { useLLM } from "../hooks/useLLM";
import { systemPrompt, taskPrompt } from "@/lib/promtps/journey-prompts";

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
  const isLLMInteractive = currentScenario.type === "llm-interactive";
  const isTextInputType =
    isTextField || isSingleSelectOrText || isLLMInteractive;
  const isReflection =
    isSingleSelectNoCorrect ||
    isTextField ||
    isSingleSelectOrText ||
    isLLMInteractive;

  // LLM Interactive state
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >(currentScenario.conversationHistory || []);
  const [currentScenarioText, setCurrentScenarioText] = useState(
    currentScenario.scenario
  );
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const { mutate: sendLLMMessage } = useLLM();

  // Initialize conversation history if this is the first time
  useEffect(() => {
    if (isLLMInteractive && conversationHistory.length === 0) {
      setCurrentScenarioText(currentScenario.scenario);
      setQuickReplies([]);
      setShowSuggestions(false);
    }
  }, [isLLMInteractive, currentScenario.scenario, conversationHistory.length]);

  const handleLLMSubmit = useCallback(() => {
    if (!textAnswer.trim() || isLLMLoading) return;

    if (conversationHistory.length === 0) {
      // Add initial prompt to conversation history
      setConversationHistory([
        { role: "assistant" as const, content: currentScenario.scenario },
      ]);
      return;
    }

    const userMessage = textAnswer.trim();
    onTextAnswerChange("");
    setIsLLMLoading(true);

    // Add user message to conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user" as const, content: userMessage },
    ];
    setConversationHistory(updatedHistory);

    // Build messages for LLM
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: taskPrompt,
      },
      ...updatedHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    console.log(messages);
    sendLLMMessage(
      {
        messages,
        temperature: 0.8,
        max_tokens: 500,
      },
      {
        onSuccess: (response) => {
          const assistantResponse = response.content;
          const newHistory = [
            ...updatedHistory,
            { role: "assistant" as const, content: assistantResponse },
          ];
          setConversationHistory(newHistory);
          setCurrentScenarioText(assistantResponse);
          // Store quickReplies if provided
          if (response.quickReplies && response.quickReplies.length > 0) {
            setQuickReplies(response.quickReplies);
            setShowSuggestions(false); // Reset suggestions visibility
          }
          setIsLLMLoading(false);
        },
        onError: (error) => {
          console.error("LLM error:", error);
          setIsLLMLoading(false);
          // Show error message to user
          const errorHistory = [
            ...updatedHistory,
            {
              role: "assistant" as const,
              content:
                "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
            },
          ];
          setConversationHistory(errorHistory);
        },
      }
    );
  }, [
    textAnswer,
    isLLMLoading,
    conversationHistory,
    currentScenario.initialPrompt,
    sendLLMMessage,
  ]);

  const isLastScenarioInLevel = currentScenarioIndex === totalScenarios - 1;
  const isFinalStage = currentLevelId === totalLevels && isLastScenarioInLevel;

  const hasAnswer = isMultipleSelect
    ? selectedOptions.length > 0
    : isTextInputType
      ? isLLMInteractive
        ? conversationHistory.length > 0 && !isLLMLoading
        : selectedOption !== undefined || textAnswer.trim() !== ""
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
            {isLLMInteractive ? (
              <div>
                {/* Loading indicator */}
                {isLLMLoading ? (
                  <div className="flex items-center gap-2 rounded-xl ">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <p className="text-base text-purple-600 lg:text-lg">
                      Lade nächste Situation...
                    </p>
                  </div>
                ) : (
                  /* Current scenario text */
                  <div className="rounded-xl ">
                    <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
                      {currentScenarioText}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
                {currentScenario.scenario}
              </p>
            )}
          </div>

          <div className="px-4">
            {showHint && (
              <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  💡 Tipp: Denk daran, dass Sicherheit und Qualität bei
                  {config.company.name} immer Priorität haben!
                </p>
              </div>
            )}

            <h3 className="font-semibold text-slate-800">
              {isLLMInteractive
                ? "Ich werde zuerst..."
                : isTextField
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
            {(isTextField || isSingleSelectOrText || isLLMInteractive) && (
              <div
                className={cn(
                  "mt-6",
                  (isSingleSelectOrText || isLLMInteractive) &&
                    "border-t-2 border-slate-200 pt-6"
                )}
              >
                <div className="relative">
                  {isLLMInteractive ? (
                    <textarea
                      value={textAnswer}
                      onChange={(e) => {
                        onTextAnswerChange(e.target.value);
                      }}
                      placeholder="Bedienungsanleitung suchen? Kollegen fragen?"
                      rows={3}
                      disabled={isLLMLoading}
                      className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pr-14 text-base focus:border-purple-300 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  ) : (
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
                  )}
                  {(isTextField || isLLMInteractive) && (
                    <button
                      onClick={isLLMInteractive ? handleLLMSubmit : onContinue}
                      disabled={!textAnswer.trim() || isLLMLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple-500 p-2 text-white transition hover:bg-purple-600 disabled:bg-slate-300"
                    >
                      {isLLMLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>

                {(isSingleSelectOrText || isLLMInteractive) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onTextAnswerChange("")}
                        disabled={isLLMLoading}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                      >
                        <span className="text-lg">🗑️</span>
                        Leeren
                      </button>
                      {isLLMInteractive && quickReplies.length > 0 && (
                        <button
                          onClick={() => setShowSuggestions(!showSuggestions)}
                          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                          disabled={isLLMLoading}
                        >
                          Vorschläge anzeigen
                          <span
                            className={cn(
                              "text-lg transition-transform",
                              showSuggestions && "rotate-180"
                            )}
                          >
                            ⌄
                          </span>
                        </button>
                      )}
                    </div>
                    {/* Quick Replies Suggestions */}
                    {isLLMInteractive &&
                      showSuggestions &&
                      quickReplies.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {quickReplies.map((reply, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                onTextAnswerChange(reply);
                                setShowSuggestions(false);
                              }}
                              disabled={isLLMLoading}
                              className="w-full rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 text-left text-sm font-medium text-purple-800 transition hover:border-purple-300 hover:bg-purple-100 disabled:opacity-50"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      {(isSingleSelectNoCorrect ||
        isTextField ||
        isSingleSelectOrText ||
        isLLMInteractive) &&
        isFinalStage && (
          <footer
            className="border-t-2 bg-white px-4 py-4"
            style={{
              paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
            }}
          >
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={!hasAnswer || isLLMLoading}
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
        isLLMInteractive) &&
        !isFinalStage && (
          <footer
            className="border-t-2 bg-white px-4 py-4"
            style={{
              paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
            }}
          >
            <div className="mx-auto max-w-2xl">
              <Button
                disabled={!hasAnswer || isLLMLoading}
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
