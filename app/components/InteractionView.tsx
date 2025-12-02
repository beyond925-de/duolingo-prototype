import { ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Level } from "../types";
import { config } from "../config";
import { useCallback, useState } from "react";

interface InteractionViewProps {
  currentLevel: Level;
  currentLevelId: number;
  totalLevels: number;
  selectedOption?: number;
  textAnswer: string;
  status: "none" | "wrong" | "correct";
  showHint: boolean;
  onOptionSelect: (id: number) => void;
  onTextAnswerChange: (value: string) => void;
  onContinue: () => void;
  onSettingsClick: () => void;
  onHintToggle: () => void;
  onExpressApply: () => void;
}

interface Particle {
  id: number;
  left: number;
}

export function InteractionView({
  currentLevel,
  currentLevelId,
  totalLevels,
  selectedOption,
  textAnswer,
  status,
  showHint,
  onOptionSelect,
  onTextAnswerChange,
  onContinue,
  onSettingsClick,
  onHintToggle,
  onExpressApply,
}: InteractionViewProps) {
  const isReflection = currentLevel.type === "reflection";
  const isFinalStage = currentLevelId === totalLevels;
  const hasAnswer = isReflection
    ? selectedOption !== undefined || textAnswer.trim() !== ""
    : selectedOption !== undefined;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [gearClickCount, setGearClickCount] = useState(0);
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
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-end gap-3 px-4 py-3">
        <div className="flex grow items-center justify-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-purple-500 bg-white text-sm font-bold text-purple-500">
            {currentLevelId}/{totalLevels}
          </div>
        </div>
        <button
          onClick={() => {
            spawnParticle();
          }}
          className=" flex h-12 w-12  items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200"
        >
          ⚙️
        </button>
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
          className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          <span>?</span>
          Tip holen
        </button>
      </header>

      <div className="flex-1 overflow-auto px-4 pb-6">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-t-3xl border-4 border-b-0 border-purple-200 bg-slate-100">
            <img
              src={currentLevel.imageUrl}
              alt={currentLevel.title}
              className="h-[200px] w-full object-cover lg:h-[320px]"
            />
          </div>

          <div className="mb-6 rounded-b-3xl border-4 border-t-0 border-purple-200 bg-purple-50 px-6 py-4">
            <p className="text-base leading-relaxed text-slate-800 lg:text-lg">
              {currentLevel.content.scenario}
            </p>
          </div>

          {showHint && (
            <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                💡 Tipp: Denk daran, dass Sicherheit und Qualität bei TechSteel
                immer Priorität haben!
              </p>
            </div>
          )}

          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {isReflection ? "Ich werde zuerst..." : "Wähle deine Antwort"}
          </h3>

          <div className="space-y-3">
            {currentLevel.content.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const showFeedback =
                isSelected &&
                ((isReflection && hasAnswer) ||
                  (!isReflection && status !== "none"));

              return (
                <div key={option.id}>
                  <button
                    onClick={() => {
                      onOptionSelect(option.id);
                      onTextAnswerChange("");
                    }}
                    disabled={!isReflection && status === "correct"}
                    className={cn(
                      "w-full rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition",
                      isSelected &&
                        isReflection &&
                        "border-purple-300 bg-purple-50 text-purple-800",
                      isSelected &&
                        !isReflection &&
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
                        isReflection &&
                          "border-purple-200 bg-purple-50 text-purple-800",
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

          {isReflection && currentLevel.content.allowTextInput && (
            <div className="mt-6">
              <div className="relative">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => {
                    onTextAnswerChange(e.target.value);
                    onOptionSelect(undefined as any);
                  }}
                  placeholder="Bedienungsanleitung suchen?  Kollegen fragen?"
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

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => onTextAnswerChange("")}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  <span className="text-lg">🗑️</span>
                  Leeren
                </button>
                <button
                  onClick={onHintToggle}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  <span>⌄</span>
                  Vorschläge anzeigen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isReflection && isFinalStage && (
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

      {!isReflection && (
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
