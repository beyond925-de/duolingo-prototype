"use client";

import { useState } from "react";

import { useWindowSize } from "react-use";

import { CampusView } from "./components/CampusView";
import { ExpressApplyView } from "./components/ExpressApplyView";
import { InteractionView } from "./components/InteractionView";
import { LandingOverlay } from "./components/LandingOverlay";
import { MapView } from "./components/MapView";
import { SettingsModal } from "./components/SettingsModal";
import { VictoryView } from "./components/VictoryView";
import { config } from "./config";
import { Job, Level, Screen } from "./types";

export default function Beyond925() {
  const { width, height } = useWindowSize();
  const [currentScreen, setCurrentScreen] = useState<Screen>("campus");
  const [showLanding, setShowLanding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [textAnswer, setTextAnswer] = useState("");
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [showConfetti, setShowConfetti] = useState(false);
  const [_score, setScore] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    phoneType: "",
    schoolType: "",
    emailOrPhone: "",
  });
  const [settings, setSettings] = useState({
    showStartScreen: true,
    vibration: true,
    sound: true,
    animation: true,
  });
  const [showHint, setShowHint] = useState(false);

  const currentLevel = currentLevelId
    ? levels.find((l) => l.id === currentLevelId)
    : null;

  const currentScenario = currentLevel
    ? currentLevel.scenarios[currentScenarioIndex]
    : null;

  const completedCount = levels.filter((l) => l.status === "completed").length;
  const progress = (completedCount / levels.length) * 100;

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    // Initialize levels with first level unlocked
    const initializedLevels = job.levels.map((level, index) => ({
      ...level,
      status: index === 0 ? ("unlocked" as const) : level.status,
    }));
    setLevels(initializedLevels);
    setCurrentScreen("map");
  };

  const handleBackToCampus = () => {
    setCurrentScreen("campus");
    setCurrentLevelId(null);
    setCurrentScenarioIndex(0);
    setSelectedOption(undefined);
    setTextAnswer("");
    setStatus("none");
    setShowHint(false);
  };

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

    // If it's the final "Teamfit checken" level, go directly to apply
    const finalLevel = levels.find((l) => l.id === currentLevelId);
    if (finalLevel && finalLevel.title === "Teamfit checken") {
      setCurrentScreen("expressApply");
    } else {
      setShowConfetti(true);
      setCurrentScreen("victory");
      setTimeout(() => setShowConfetti(false), 3000);
    }
    // Reset scenario index for next level
    setCurrentScenarioIndex(0);
  };

  const handleOptionSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const handleContinue = () => {
    if (!currentLevel || !currentScenario) return;

    if (currentScenario.type === "reflection") {
      if (!selectedOption && !textAnswer.trim()) return;
      // Check if this is the last scenario in the level
      if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
        handleLevelComplete();
      } else {
        // Move to next scenario
        setCurrentScenarioIndex((prev) => prev + 1);
        setSelectedOption(undefined);
        setTextAnswer("");
        setStatus("none");
        setShowHint(false);
      }
      return;
    }

    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      // Check if this is the last scenario in the level
      if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
        handleLevelComplete();
      } else {
        // Move to next scenario
        setCurrentScenarioIndex((prev) => prev + 1);
        setSelectedOption(undefined);
        setStatus("none");
        setShowHint(false);
      }
      return;
    }

    const selectedOptionData = currentScenario.options.find(
      (o) => o.id === selectedOption
    );

    if (!selectedOptionData) return;

    if (selectedOptionData.correct) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const handleLevelClick = (level: Level) => {
    if (level.status === "unlocked" || level.status === "completed") {
      setCurrentLevelId(level.id);
      setCurrentScenarioIndex(0);
      setSelectedOption(undefined);
      setTextAnswer("");
      setStatus("none");
      setShowHint(false);
      setCurrentScreen("interaction");
    }
  };

  const handleExpressApply = () => {
    setCurrentScreen("expressApply");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Danke ${formData.firstName}! Wir melden uns bei dir. 📞`);
    setCurrentScreen("campus");
    setFormData({
      firstName: "",
      phoneType: "",
      schoolType: "",
      emailOrPhone: "",
    });
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (showLanding) {
    return (
      <LandingOverlay
        onStart={() => {
          setShowLanding(false);
          setCurrentScreen("campus");
        }}
      />
    );
  }

  return (
    <>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onShowLanding={() => setShowLanding(true)}
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      {currentScreen === "campus" && (
        <CampusView
          jobs={config.jobs}
          onJobSelect={handleJobSelect}
          onSettingsClick={() => setShowSettings(true)}
        />
      )}

      {currentScreen === "map" && selectedJob && (
        <MapView
          jobTitle={selectedJob.title}
          levels={levels}
          progress={progress}
          onLevelClick={handleLevelClick}
          onSettingsClick={() => setShowSettings(true)}
          onExpressApply={handleExpressApply}
          onBackToCampus={handleBackToCampus}
        />
      )}

      {currentScreen === "interaction" && currentLevel && currentScenario && (
        <InteractionView
          currentLevel={currentLevel}
          currentScenario={currentScenario}
          currentLevelId={currentLevelId!}
          currentScenarioIndex={currentScenarioIndex}
          totalScenarios={currentLevel.scenarios.length}
          totalLevels={levels.length}
          completedLevels={completedCount}
          selectedOption={selectedOption}
          textAnswer={textAnswer}
          status={status}
          showHint={showHint}
          onOptionSelect={handleOptionSelect}
          onTextAnswerChange={setTextAnswer}
          onContinue={handleContinue}
          onSettingsClick={() => setShowSettings(true)}
          onHintToggle={() => setShowHint(!showHint)}
          onExpressApply={handleExpressApply}
          onExit={() => {
            setCurrentScreen("map");
            setCurrentScenarioIndex(0);
            setSelectedOption(undefined);
            setTextAnswer("");
            setStatus("none");
            setShowHint(false);
          }}
        />
      )}

      {currentScreen === "victory" && currentLevelId && (
        <VictoryView
          currentLevelId={currentLevelId}
          totalLevels={levels.length}
          showConfetti={showConfetti}
          width={width}
          height={height}
          animationEnabled={settings.animation}
          onExpressApply={handleExpressApply}
          onNextLevel={() => {
            const nextLevel = levels.find((l) => l.id === currentLevelId + 1);
            if (nextLevel && nextLevel.status === "unlocked") {
              setCurrentLevelId(nextLevel.id);
              setCurrentScenarioIndex(0);
              setSelectedOption(undefined);
              setStatus("none");
              setCurrentScreen("interaction");
            } else {
              setCurrentScreen("map");
            }
          }}
          onMenu={() => {
            if (selectedJob) {
              setCurrentScreen("map");
            } else {
              setCurrentScreen("campus");
            }
            setSelectedOption(undefined);
            setStatus("none");
          }}
        />
      )}

      {currentScreen === "expressApply" && (
        <ExpressApplyView
          formData={formData}
          onFormDataChange={(data) =>
            setFormData((prev) => ({ ...prev, ...data }))
          }
          onSubmit={handleFormSubmit}
          onClose={() => setCurrentScreen("campus")}
        />
      )}
    </>
  );
}
