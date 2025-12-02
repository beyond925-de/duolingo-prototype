"use client";

import { useState } from "react";

import { useWindowSize } from "react-use";

import { LandingOverlay } from "./components/LandingOverlay";
import { SettingsModal } from "./components/SettingsModal";
import { MapView } from "./components/MapView";
import { InteractionView } from "./components/InteractionView";
import { VictoryView } from "./components/VictoryView";
import { ExpressApplyView } from "./components/ExpressApplyView";
import { config } from "./config";
import { Screen, Level } from "./types";

export default function Beyond925() {
  const { width, height } = useWindowSize();
  const [currentScreen, setCurrentScreen] = useState<Screen>("map");
  const [showLanding, setShowLanding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [levels, setLevels] = useState<Level[]>(config.levels);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
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

  const completedCount = levels.filter((l) => l.status === "completed").length;
  const progress = (completedCount / levels.length) * 100;

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
    if (currentLevelId === 5) {
      setCurrentScreen("expressApply");
    } else {
      setShowConfetti(true);
      setCurrentScreen("victory");
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleOptionSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const handleContinue = () => {
    if (!currentLevel) return;

    if (currentLevel.type === "reflection") {
      if (!selectedOption && !textAnswer.trim()) return;
      handleLevelComplete();
      return;
    }

    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      handleLevelComplete();
      return;
    }

    const selectedOptionData = currentLevel.content.options.find(
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
    setCurrentScreen("map");
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

  return (
    <>
      {showLanding && <LandingOverlay onStart={() => setShowLanding(false)} />}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onShowLanding={() => setShowLanding(true)}
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      {currentScreen === "map" && (
        <MapView
          levels={levels}
          progress={progress}
          onLevelClick={handleLevelClick}
          onSettingsClick={() => setShowSettings(true)}
          onExpressApply={handleExpressApply}
        />
      )}

      {currentScreen === "interaction" && currentLevel && (
        <InteractionView
          currentLevel={currentLevel}
          currentLevelId={currentLevelId!}
          totalLevels={levels.length}
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
              setSelectedOption(undefined);
              setStatus("none");
              setCurrentScreen("interaction");
            } else {
              setCurrentScreen("map");
            }
          }}
          onMenu={() => {
            setCurrentScreen("map");
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
          onClose={() => setCurrentScreen("map")}
        />
      )}
    </>
  );
}
