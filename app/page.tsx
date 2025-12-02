"use client";

import { useState } from "react";
import { X, Check, Lock, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/app/old-lingo/lesson/card";
import { cn } from "@/lib/utils";

// ============================================================================
// CONFIG OBJECT - All content driven by this data structure
// ============================================================================

const config = {
  company: {
    name: "TechSteel GmbH",
    logoUrl: "🔧",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    industryVibe:
      "Präzision trifft Innovation. Bei TechSteel formen wir die Zukunft der Metallindustrie.",
  },
  landing: {
    headline: "Deine Ausbildung startet hier.",
    subline: "Entdecke, ob Industriemechaniker:in zu dir passt.",
    startButtonText: "Mission starten",
  },
  levels: [
    {
      id: 1,
      title: "Sicherheits-Check",
      status: "unlocked" as const,
      icon: "🛡️",
      content: {
        scenario: "Die Maschine zeigt Fehlercode 404. Was machst du zuerst?",
        options: [
          {
            id: 1,
            text: "Sofort weiterarbeiten, der Code ist wahrscheinlich harmlos.",
            correct: false,
            feedback: "Nicht ganz. Sicherheit geht immer vor!",
          },
          {
            id: 2,
            text: "Maschine stoppen, Sicherheitsvorschriften prüfen und Vorgesetzten informieren.",
            correct: true,
            feedback: "Genau richtig! Sicherheit ist das Wichtigste.",
          },
          {
            id: 3,
            text: "Den Fehlercode googeln und selbst reparieren.",
            correct: false,
            feedback: "Gute Initiative, aber zuerst Sicherheit beachten!",
          },
        ],
      },
    },
    {
      id: 2,
      title: "Maschine einrichten",
      status: "locked" as const,
      icon: "⚙️",
      content: {
        scenario:
          "Du sollst eine CNC-Fräse für eine neue Produktionsserie einrichten. Wie gehst du vor?",
        options: [
          {
            id: 1,
            text: "Direkt loslegen und die Maschine programmieren.",
            correct: false,
            feedback: "Planung ist wichtig! Erst die Dokumentation prüfen.",
          },
          {
            id: 2,
            text: "Technische Zeichnung prüfen, Werkzeuge vorbereiten, dann programmieren.",
            correct: true,
            feedback: "Perfekt! Systematisches Vorgehen ist der Schlüssel.",
          },
          {
            id: 3,
            text: "Einen Kollegen fragen, wie er es macht.",
            correct: false,
            feedback: "Teamwork ist gut, aber Eigenständigkeit auch wichtig!",
          },
        ],
      },
    },
    {
      id: 3,
      title: "Qualitätskontrolle",
      status: "locked" as const,
      icon: "✅",
      content: {
        scenario:
          "Bei der Endkontrolle findest du ein Bauteil mit leichten Maßabweichungen. Was tust du?",
        options: [
          {
            id: 1,
            text: "Es passt schon, die Abweichung ist minimal.",
            correct: false,
            feedback:
              "Präzision ist wichtig! Auch kleine Abweichungen können Probleme verursachen.",
          },
          {
            id: 2,
            text: "Bauteil aussortieren, Ursache analysieren und Prozess anpassen.",
            correct: true,
            feedback:
              "Exzellent! Qualitätsbewusstsein zeigt echte Professionalität.",
          },
          {
            id: 3,
            text: "Nur dokumentieren und weiterarbeiten.",
            correct: false,
            feedback: "Dokumentation ist gut, aber Handeln ist besser!",
          },
        ],
      },
    },
  ],
  copy: {
    continueButton: "Weiter",
    nextLevel: "Nächstes Level",
    menu: "Menü",
    checkChances: "Chancen checken",
    expressApply: "Schnell-Bewerbung",
    submit: "Absenden & Rückruf erhalten",
    victoryHeadline: "Sauber gelöst. 🔧",
    victorySubtext:
      "Du hast technisches Verständnis bewiesen. Genau diese Präzision suchen wir.",
    nudgeText:
      "Mal ehrlich... Du stellst dich gut an. Wir sollten uns kennenlernen.",
    firstName: "Vorname",
    phoneType: "Welches Handy hast du?",
    schoolType: "Schulform",
    android: "Android",
    iphone: "iPhone",
    realschule: "Realschule",
    gymnasium: "Gymnasium",
    andere: "Andere",
  },
};

// ============================================================================
// TYPES
// ============================================================================

type Screen = "landing" | "map" | "interaction" | "victory" | "expressApply";
type LevelStatus = "locked" | "unlocked" | "completed";

interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  icon: string;
  content: {
    scenario: string;
    options: Array<{
      id: number;
      text: string;
      correct: boolean;
      feedback: string;
    }>;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Beyond925() {
  const { width, height } = useWindowSize();
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [levels, setLevels] = useState<Level[]>(config.levels);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    phoneType: "",
    schoolType: "",
  });

  // Get current level data
  const currentLevel = currentLevelId
    ? levels.find((l) => l.id === currentLevelId)
    : null;

  // Calculate progress
  const completedCount = levels.filter((l) => l.status === "completed").length;
  const progress = (completedCount / levels.length) * 100;

  // Handle level completion
  const handleLevelComplete = () => {
    if (!currentLevelId) return;

    setLevels((prev) =>
      prev.map((level) => {
        if (level.id === currentLevelId) {
          return { ...level, status: "completed" };
        }
        if (level.id === currentLevelId + 1) {
          return { ...level, status: "unlocked" };
        }
        return level;
      })
    );

    setScore((prev) => prev + 100);
    setShowConfetti(true);
    setCurrentScreen("victory");
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Handle option selection
  const handleOptionSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  // Handle continue after answer
  const handleContinue = () => {
    if (!selectedOption || !currentLevel) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      handleLevelComplete();
      return;
    }

    const correctOption = currentLevel.content.options.find((o) => o.correct);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  // Handle level click on map
  const handleLevelClick = (level: Level) => {
    if (level.status === "unlocked") {
      setCurrentLevelId(level.id);
      setSelectedOption(undefined);
      setStatus("none");
      setCurrentScreen("interaction");
    }
  };

  // Handle express apply
  const handleExpressApply = () => {
    setCurrentScreen("expressApply");
  };

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Danke ${formData.firstName}! Wir melden uns bei dir. 📞`);
    setCurrentScreen("map");
    setFormData({ firstName: "", phoneType: "", schoolType: "" });
  };

  // ============================================================================
  // VIEW A: LANDING SCREEN
  // ============================================================================

  if (currentScreen === "landing") {
    return (
      <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
        <div className="relative mb-8 flex h-[240px] w-[240px] items-center justify-center lg:mb-0 lg:h-[424px] lg:w-[424px]">
          <div className="text-9xl">{config.company.logoUrl}</div>
        </div>

        <div className="flex flex-col items-center gap-y-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-neutral-600 lg:text-2xl">
              {config.company.name}
            </h2>
            <p className="mb-4 text-sm text-neutral-500 lg:text-base">
              {config.company.industryVibe}
            </p>
          </div>

          <h1 className="max-w-[480px] text-center text-xl font-bold text-neutral-600 lg:text-3xl">
            {config.landing.headline}
            <br />
            <span className="text-green-500">{config.landing.subline}</span>
          </h1>

          <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => setCurrentScreen("map")}
            >
              {config.landing.startButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW B: THE MAP (HOME HUB)
  // ============================================================================

  if (currentScreen === "map") {
    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
          <X
            onClick={() => setCurrentScreen("landing")}
            className="cursor-pointer text-slate-500 transition hover:opacity-75"
          />
          <Progress value={progress} />
          <div className="flex items-center font-bold text-green-500">
            <span className="text-lg">
              {completedCount}/{levels.length}
            </span>
          </div>
        </header>

        {/* Map Content */}
        <div className="flex-1">
          <div className="mx-auto h-full max-w-[912px] px-3">
            <h1 className="mb-5 text-2xl font-bold text-neutral-700">
              {config.company.name}
            </h1>

            <div className="relative flex flex-col items-center">
              {levels.map((level, index) => {
                const isCompleted = level.status === "completed";
                const isLocked = level.status === "locked";
                const isCurrent = level.status === "unlocked" && !isCompleted;

                const cycleLength = 8;
                const cycleIndex = index % cycleLength;
                let indentationLevel;
                if (cycleIndex <= 2) indentationLevel = cycleIndex;
                else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
                else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
                else indentationLevel = cycleIndex - 8;
                const rightPosition = indentationLevel * 40;

                const isFirst = index === 0;

                return (
                  <div
                    key={level.id}
                    className="relative flex flex-col items-center"
                    style={{
                      right: `${rightPosition}px`,
                      marginTop: isFirst && !isCurrent ? 60 : 24,
                    }}
                  >
                    {isCurrent ? (
                      <>
                        <div className="absolute -top-6 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-green-500">
                          Start
                          <div
                            className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                            aria-hidden
                          />
                        </div>
                        <Button
                          size="rounded"
                          variant={isLocked ? "locked" : "secondary"}
                          className="h-[70px] w-[70px] border-b-8"
                          onClick={() => handleLevelClick(level)}
                        >
                          <span className="text-3xl">{level.icon}</span>
                        </Button>
                        <div
                          className={cn(
                            "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                            "border-green-300 text-green-600"
                          )}
                        >
                          {level.title}
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          size="rounded"
                          variant={isLocked ? "locked" : "secondary"}
                          className="h-[70px] w-[70px] border-b-8"
                          onClick={() => handleLevelClick(level)}
                          disabled={isLocked}
                          style={{ pointerEvents: isLocked ? "none" : "auto" }}
                        >
                          {isLocked ? (
                            <Lock className="h-10 w-10 fill-neutral-400 stroke-neutral-400 text-neutral-400" />
                          ) : (
                            <span className="text-3xl">{level.icon}</span>
                          )}
                        </Button>
                        {isCompleted && (
                          <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "mt-3 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-1.5 text-center text-sm font-bold shadow-lg",
                            isCompleted
                              ? "border-green-300 text-green-600"
                              : "border-slate-300 text-slate-600"
                          )}
                        >
                          {level.title}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Express Apply Button */}
            <div className="mt-12 flex justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleExpressApply}
                className="w-full max-w-[330px]"
              >
                {config.copy.expressApply}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW C: THE INTERACTION (GAMEPLAY)
  // ============================================================================

  if (currentScreen === "interaction" && currentLevel) {
    return (
      <div className="flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
          <X
            onClick={() => setCurrentScreen("map")}
            className="cursor-pointer text-slate-500 transition hover:opacity-75"
          />
          <Progress value={(currentLevelId! / levels.length) * 100} />
          <div className="w-6" />
        </header>

        <div className="flex-1">
          <div className="flex h-full items-center justify-center">
            <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
              <div className="mb-4 text-center text-6xl">
                {currentLevel.icon}
              </div>
              <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
                {currentLevel.content.scenario}
              </h1>

              <div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                  {currentLevel.content.options.map((option, i) => (
                    <Card
                      key={option.id}
                      id={option.id}
                      text={option.text}
                      imageSrc={null}
                      shortcut={`${i + 1}`}
                      selected={selectedOption === option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      status={status}
                      audioSrc={null}
                      disabled={status !== "none"}
                      type={"SELECT" as const}
                    />
                  ))}
                </div>
                {status !== "none" && selectedOption && (
                  <div
                    className={cn(
                      "mt-6 rounded-xl border-2 p-4 text-center text-sm font-medium lg:text-base",
                      status === "correct"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-rose-300 bg-rose-50 text-rose-700"
                    )}
                  >
                    {
                      currentLevel.content.options.find(
                        (o) => o.id === selectedOption
                      )?.feedback
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer
          className={cn(
            "h-[100px] border-t-2 lg:h-[140px]",
            status === "correct" && "border-transparent bg-green-100",
            status === "wrong" && "border-transparent bg-rose-100"
          )}
        >
          <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
            {status === "correct" && (
              <div className="flex items-center text-base font-bold text-green-500 lg:text-2xl">
                <Check className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
                Gut gemacht!
              </div>
            )}

            {status === "wrong" && (
              <div className="flex items-center text-base font-bold text-rose-500 lg:text-2xl">
                <X className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
                Nochmal versuchen.
              </div>
            )}

            <Button
              disabled={!selectedOption}
              aria-disabled={!selectedOption}
              className="ml-auto"
              onClick={handleContinue}
              size="lg"
              variant={status === "wrong" ? "danger" : "secondary"}
            >
              {status === "none" && "Prüfen"}
              {status === "correct" && "Weiter"}
              {status === "wrong" && "Erneut"}
            </Button>
          </div>
        </footer>
      </div>
    );
  }

  // ============================================================================
  // VIEW D: VICTORY SCREEN
  // ============================================================================

  if (currentScreen === "victory" && currentLevelId) {
    const isLastLevel = currentLevelId === levels.length;
    const showNudge = currentLevelId === 3;

    return (
      <>
        {showConfetti && (
          <Confetti
            recycle={false}
            numberOfPieces={500}
            tweenDuration={10_000}
            width={width}
            height={height}
          />
        )}
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
              <div className="mb-4 text-6xl">🎉</div>

              <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
                {config.copy.victoryHeadline}
                <br />
                <span className="text-green-500">
                  {config.copy.victorySubtext}
                </span>
              </h1>

              {/* Nudge Card (Level 3) */}
              {showNudge && (
                <div className="mt-8 w-full max-w-md rounded-xl border-2 border-blue-300 bg-blue-50 p-6">
                  <p className="mb-4 text-lg font-medium text-slate-800">
                    {config.copy.nudgeText}
                  </p>
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    onClick={handleExpressApply}
                  >
                    {config.copy.checkChances}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <footer className="h-[100px] border-t-2 lg:h-[140px]">
            <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
              {!isLastLevel && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setCurrentScreen("map");
                    setSelectedOption(undefined);
                    setStatus("none");
                  }}
                >
                  {config.copy.nextLevel}
                </Button>
              )}
              <Button
                size="lg"
                variant="default"
                className="ml-auto"
                onClick={() => {
                  setCurrentScreen("map");
                  setSelectedOption(undefined);
                  setStatus("none");
                }}
              >
                {config.copy.menu}
              </Button>
            </div>
          </footer>
        </div>
      </>
    );
  }

  // ============================================================================
  // VIEW E: EXPRESS APPLY
  // ============================================================================

  if (currentScreen === "expressApply") {
    return (
      <div className="flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
          <X
            onClick={() => setCurrentScreen("map")}
            className="cursor-pointer text-slate-500 transition hover:opacity-75"
          />
          <h1 className="text-lg font-bold text-neutral-700">
            {config.copy.expressApply}
          </h1>
          <div className="w-6" />
        </header>

        <div className="flex-1">
          <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 px-6">
            <div className="w-full rounded-xl border-2 border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-2 text-center text-2xl font-bold text-neutral-700">
                Lass uns starten! 🚀
              </h3>
              <p className="mb-6 text-center text-neutral-600">
                Ein paar kurze Infos genügen. Wir melden uns bei dir!
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    {config.copy.firstName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-neutral-800 transition-colors focus:border-green-500 focus:outline-none"
                    placeholder="Max"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    {config.copy.phoneType}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, phoneType: "android" })
                      }
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 transition-all",
                        formData.phoneType === "android"
                          ? "border-green-500 bg-green-50 font-medium text-green-700"
                          : "border-slate-300 bg-white text-neutral-700 hover:border-green-300"
                      )}
                    >
                      {config.copy.android}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, phoneType: "iphone" })
                      }
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 transition-all",
                        formData.phoneType === "iphone"
                          ? "border-green-500 bg-green-50 font-medium text-green-700"
                          : "border-slate-300 bg-white text-neutral-700 hover:border-green-300"
                      )}
                    >
                      {config.copy.iphone}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    {config.copy.schoolType}
                  </label>
                  <select
                    required
                    value={formData.schoolType}
                    onChange={(e) =>
                      setFormData({ ...formData, schoolType: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-neutral-800 transition-colors focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="realschule">{config.copy.realschule}</option>
                    <option value="gymnasium">{config.copy.gymnasium}</option>
                    <option value="andere">{config.copy.andere}</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="mt-8 w-full"
                >
                  {config.copy.submit}
                </Button>
              </form>
            </div>

            <p className="text-center text-xs text-neutral-500">
              Deine Daten werden sicher gespeichert und nur für die Bewerbung
              verwendet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
