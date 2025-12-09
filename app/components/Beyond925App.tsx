"use client";

import { useEffect, useRef, useState } from "react";

import { useWindowSize } from "react-use";

import { CampusView } from "./CampusView";
import { ExpressApplyView } from "./ExpressApplyView";
import { InteractionView } from "./InteractionView";
import { LandingOverlay } from "./LandingOverlay";
import { MapView } from "./MapView";
import { QuestionnaireView } from "./QuestionnaireView";
import { SettingsModal } from "./SettingsModal";
import { VictoryView } from "./VictoryView";
import { CompanyConfig, Job, Level, Screen } from "../types";

const STORAGE_KEY_PREFIX = "duolingo-mockup-state";

function LoadingScreen({ config }: { config: CompanyConfig }) {
  const emoji = config.company.signatureEmoji || "⚙️";
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-6xl">{emoji}</div>
        <p className="animate-pulse text-lg font-medium text-slate-600">
          Lade...
        </p>
      </div>
    </div>
  );
}

interface Beyond925AppProps {
  config: CompanyConfig;
  companyId: string;
}

export function Beyond925App({ config, companyId }: Beyond925AppProps) {
  const { width, height } = useWindowSize();
  const STORAGE_KEY = `${STORAGE_KEY_PREFIX}-${companyId}`;
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("campus");
  const [showLanding, setShowLanding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobProgress, setJobProgress] = useState<Record<string, Level[]>>({});
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); // For multiple-select
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
    debugMode: false,
  });
  const [showHint, setShowHint] = useState(false);

  // Use ref to track latest state for saving on unmount
  const stateRef = useRef({
    currentScreen,
    showLanding,
    selectedJob,
    levels,
    currentLevelId,
    currentScenarioIndex,
    selectedOption,
    selectedOptions,
    textAnswer,
    status,
    score: _score,
    formData,
    settings,
  });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      currentScreen,
      showLanding,
      selectedJob,
      levels,
      currentLevelId,
      currentScenarioIndex,
      selectedOption,
      selectedOptions,
      textAnswer,
      status,
      score: _score,
      formData,
      settings,
    };
  }, [
    currentScreen,
    showLanding,
    selectedJob,
    levels,
    currentLevelId,
    currentScenarioIndex,
    selectedOption,
    selectedOptions,
    textAnswer,
    status,
    _score,
    formData,
    settings,
  ]);

  // Helper function to recalculate unlock states based on completed prerequisites
  const recalculateUnlockStates = (levelsToUpdate: Level[]): Level[] => {
    return levelsToUpdate.map((level) => {
      // Don't change status of completed or already unlocked levels
      if (level.status === "completed" || level.status === "unlocked") {
        return level;
      }

      // Check if any level that connects to this one is completed
      const hasCompletedPrerequisite = levelsToUpdate.some((otherLevel) => {
        if (otherLevel.status !== "completed") return false;
        // Check if this level is in otherLevel's nextLevelIds
        return otherLevel.nextLevelIds?.includes(level.id) ?? false;
      });

      // If using sequential structure, check if previous level is completed
      const hasSequentialPrerequisite =
        !levelsToUpdate.some((l) => l.nextLevelIds !== undefined) &&
        level.id > 1 &&
        levelsToUpdate.find((l) => l.id === level.id - 1)?.status ===
          "completed";

      if (hasCompletedPrerequisite || hasSequentialPrerequisite) {
        return { ...level, status: "unlocked" as const };
      }

      return level;
    });
  };

  // Load state from local storage on mount
  useEffect(() => {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        if (parsedState.currentScreen)
          setCurrentScreen(parsedState.currentScreen);
        if (parsedState.showLanding !== undefined)
          setShowLanding(parsedState.showLanding);

        // Restore selectedJob and levels together
        if (parsedState.selectedJob) {
          const savedJob = parsedState.selectedJob;
          const currentJob = config.jobs.find((j) => j.id === savedJob.id);

          if (currentJob) {
            // Found the job in config, restore it
            setSelectedJob(currentJob);

            // Restore levels by merging saved state with current config
            if (
              parsedState.levels &&
              Array.isArray(parsedState.levels) &&
              parsedState.levels.length > 0
            ) {
              const mergedLevels = currentJob.levels.map((jobLevel) => {
                const savedLevel = parsedState.levels.find(
                  (sl: Level) => sl.id === jobLevel.id
                );
                if (savedLevel && savedLevel.status) {
                  // Preserve status and other state from saved level
                  return { ...jobLevel, status: savedLevel.status };
                }
                // If no saved state for this level, use default from config
                return jobLevel;
              });
              // Recalculate unlock states when loading from storage
              const recalculatedLevels = recalculateUnlockStates(mergedLevels);
              setLevels(recalculatedLevels);
            } else {
              // No saved levels or invalid levels, initialize from job config
              const initializedLevels = currentJob.levels.map(
                (level, index) => ({
                  ...level,
                  status: index === 0 ? ("unlocked" as const) : level.status,
                })
              );
              setLevels(initializedLevels);
            }
          } else {
            // Job not found in config, but we have saved state - restore what we can
            setSelectedJob(parsedState.selectedJob);
            if (
              parsedState.levels &&
              Array.isArray(parsedState.levels) &&
              parsedState.levels.length > 0
            ) {
              const recalculatedLevels = recalculateUnlockStates(
                parsedState.levels
              );
              setLevels(recalculatedLevels);
            } else {
              // No valid levels, clear selectedJob since we can't restore it properly
              setSelectedJob(null);
              setLevels([]);
            }
          }
        } else if (
          parsedState.levels &&
          Array.isArray(parsedState.levels) &&
          parsedState.levels.length > 0
        ) {
          // No selected job but we have levels - restore them
          const recalculatedLevels = recalculateUnlockStates(
            parsedState.levels
          );
          setLevels(recalculatedLevels);
        }

        // Restore other state
        if (parsedState.currentLevelId !== undefined)
          setCurrentLevelId(parsedState.currentLevelId);
        if (parsedState.currentScenarioIndex !== undefined)
          setCurrentScenarioIndex(parsedState.currentScenarioIndex);
        if (parsedState.selectedOption !== undefined)
          setSelectedOption(parsedState.selectedOption);
        if (parsedState.selectedOptions)
          setSelectedOptions(parsedState.selectedOptions);
        if (parsedState.textAnswer !== undefined)
          setTextAnswer(parsedState.textAnswer);
        if (parsedState.status) setStatus(parsedState.status);
        if (parsedState.score !== undefined) setScore(parsedState.score);
        if (parsedState.formData) setFormData(parsedState.formData);
        if (parsedState.settings) setSettings(parsedState.settings);
      } catch (e) {
        console.error("Failed to load state from local storage:", e);
      }
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]); // Only depend on STORAGE_KEY, not config.jobs to avoid re-running

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    const stateToSave = {
      currentScreen,
      showLanding,
      selectedJob,
      levels,
      currentLevelId,
      currentScenarioIndex,
      selectedOption,
      selectedOptions,
      textAnswer,
      status,
      score: _score,
      formData,
      settings,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [
    isLoaded,
    STORAGE_KEY,
    currentScreen,
    showLanding,
    selectedJob,
    levels,
    currentLevelId,
    currentScenarioIndex,
    selectedOption,
    selectedOptions,
    textAnswer,
    status,
    _score,
    formData,
    settings,
  ]);

  // Save state on unmount to ensure it's persisted before navigation
  useEffect(() => {
    return () => {
      // Save state one final time before component unmounts using ref
      if (isLoaded) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
        } catch (e) {
          console.error("Failed to save state on unmount:", e);
        }
      }
    };
  }, [isLoaded, STORAGE_KEY]);

  // Keyboard shortcut for debug mode (Ctrl/Cmd + Shift + D)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle debug mode: Ctrl/Cmd + Shift + D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, debugMode: !prev.debugMode }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isLoaded) {
    return <LoadingScreen config={config} />;
  }

  const currentLevel = currentLevelId
    ? levels.find((l) => l.id === currentLevelId)
    : null;

  const currentScenario = currentLevel
    ? currentLevel.scenarios[currentScenarioIndex]
    : null;

  const completedCount = levels.filter((l) => l.status === "completed").length;

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);

    // Check if there's saved state for this job
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        // If we have saved levels for this job, restore them
        if (parsedState.selectedJob?.id === job.id && parsedState.levels) {
          const savedLevels = parsedState.levels;
          // Merge saved levels with job config to ensure we have all level data
          const restoredLevels = job.levels.map((jobLevel) => {
            const savedLevel = savedLevels.find(
              (sl: Level) => sl.id === jobLevel.id
            );
            if (savedLevel) {
              // Preserve status and other state from saved level
              return { ...jobLevel, status: savedLevel.status };
            }
            // If no saved state, initialize first level as unlocked
            return {
              ...jobLevel,
              status:
                jobLevel.id === job.levels[0].id
                  ? ("unlocked" as const)
                  : jobLevel.status,
            };
          });
          // Recalculate unlock states based on completed prerequisites
          const recalculatedLevels = recalculateUnlockStates(restoredLevels);
          setLevels(recalculatedLevels);
        } else {
          // No saved state for this job, initialize from scratch
          const initializedLevels = job.levels.map((level, index) => ({
            ...level,
            status: index === 0 ? ("unlocked" as const) : level.status,
          }));
          setLevels(initializedLevels);
        }
      } catch (e) {
        console.error("Failed to restore job state:", e);
        // Fallback to initialization if restore fails
        const initializedLevels = job.levels.map((level, index) => ({
          ...level,
          status: index === 0 ? ("unlocked" as const) : level.status,
        }));
        setLevels(initializedLevels);
      }
    } else {
      // No saved state at all, initialize from scratch
      const initializedLevels = job.levels.map((level, index) => ({
        ...level,
        status: index === 0 ? ("unlocked" as const) : level.status,
      }));
      setLevels(initializedLevels);
    }

    setCurrentScreen("map");
  };

  const handleBackToCampus = () => {
    setCurrentScreen("campus");
    // Clear current level/scenario state but preserve job and levels
    // so they can be restored when selecting the same job again
    setCurrentLevelId(null);
    setCurrentScenarioIndex(0);
    setSelectedOption(undefined);
    setSelectedOptions([]);
    setTextAnswer("");
    setStatus("none");
    setShowHint(false);
    // Don't clear selectedJob and levels - they will be preserved in localStorage
    // and can be restored when selecting the job again
  };

  const handleLevelComplete = () => {
    if (!currentLevelId) return;

    // Check the level before updating state to avoid stale closure
    const finalLevel = levels.find((l) => l.id === currentLevelId);
    const isTeamfitChecken = finalLevel?.title === "Teamfit checken";

    setLevels((prev) => {
      // Find the completed level to get its nextLevelIds
      const completedLevel = prev.find((l) => l.id === currentLevelId);
      const nextLevelIds = completedLevel?.nextLevelIds;

      return prev.map((level) => {
        // Mark current level as completed
        if (level.id === currentLevelId) {
          return { ...level, status: "completed" };
        }

        // If using graph structure with nextLevelIds, unlock all connected levels
        if (nextLevelIds && nextLevelIds.includes(level.id)) {
          // Only unlock if currently locked (don't override if already unlocked/completed)
          if (level.status === "locked") {
            return { ...level, status: "unlocked" };
          }
        }
        // Fallback to sequential behavior for backward compatibility
        else if (!nextLevelIds && level.id === currentLevelId + 1) {
          return { ...level, status: "unlocked" };
        }

        return level;
      });
    });

    setScore((prev) => prev + 100);

    // If it's the final "Teamfit checken" level, go directly to apply
    if (isTeamfitChecken) {
      setCurrentScreen("expressApply");
    } else {
      setShowConfetti(true);
      setCurrentScreen("victory");
      setTimeout(() => setShowConfetti(false), 3000);
    }
    // Reset scenario index for next level
    setCurrentScenarioIndex(0);
  };

  // Debug mode: instantly complete current level
  const handleDebugCompleteLevel = () => {
    if (!settings.debugMode || !currentLevelId) return;
    handleLevelComplete();
  };

  const handleOptionSelect = (id: number | undefined) => {
    if (status !== "none" && currentScenario?.type === "single-select-correct")
      return;
    setSelectedOption(id);
  };

  const handleOptionsToggle = (id: number) => {
    if (status !== "none") return;
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((optId) => optId !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (!currentLevel || !currentScenario) return;

    const scenarioType = currentScenario.type;

    // Handle llm-interactive type
    if (scenarioType === "llm-interactive") {
      // For LLM interactive, we don't auto-advance on continue
      // The user needs to explicitly complete the scenario
      // This will be handled by the InteractionView component
      // Just check if this is the last scenario
      if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
        handleLevelComplete();
      } else {
        // Move to next scenario
        setCurrentScenarioIndex((prev) => prev + 1);
        setTextAnswer("");
        setStatus("none");
        setShowHint(false);
      }
      return;
    }

    // Handle text-field type
    if (scenarioType === "text-field") {
      if (!textAnswer.trim()) return;
      // Check if this is the last scenario in the level
      if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
        handleLevelComplete();
      } else {
        // Move to next scenario
        setCurrentScenarioIndex((prev) => prev + 1);
        setTextAnswer("");
        setStatus("none");
        setShowHint(false);
      }
      return;
    }

    // Handle bento-grid type (informational)
    if (scenarioType === "bento-grid") {
      if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
        handleLevelComplete();
      } else {
        setCurrentScenarioIndex((prev) => prev + 1);
        setSelectedOption(undefined);
        setSelectedOptions([]);
        setTextAnswer("");
        setStatus("none");
        setShowHint(false);
      }
      return;
    }

    // Handle single-select-no-correct type
    if (scenarioType === "single-select-no-correct") {
      if (!selectedOption) return;
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

    // Handle single-select-or-text type
    if (scenarioType === "single-select-or-text") {
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

    // Handle multiple-select type
    if (scenarioType === "multiple-select") {
      if (selectedOptions.length === 0) return;

      if (status === "wrong") {
        setStatus("none");
        setSelectedOptions([]);
        return;
      }

      if (status === "correct") {
        // Check if this is the last scenario in the level
        if (currentScenarioIndex === currentLevel.scenarios.length - 1) {
          handleLevelComplete();
        } else {
          // Move to next scenario
          setCurrentScenarioIndex((prev) => prev + 1);
          setSelectedOptions([]);
          setStatus("none");
          setShowHint(false);
        }
        return;
      }

      // Validate multiple select: all selected options must be correct
      const allSelectedCorrect = selectedOptions.every((id) => {
        const option = currentScenario.options.find((o) => o.id === id);
        return option?.correct === true;
      });

      // Also check that all correct options are selected
      const allCorrectSelected = currentScenario.options
        .filter((o) => o.correct === true)
        .every((o) => selectedOptions.includes(o.id));

      if (allSelectedCorrect && allCorrectSelected) {
        setStatus("correct");
      } else {
        setStatus("wrong");
      }
      return;
    }

    // Handle single-select-correct type (original validation logic)
    if (scenarioType === "single-select-correct") {
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
      return;
    }
  };

  const handleLevelClick = (level: Level) => {
    if (level.status === "unlocked" || level.status === "completed") {
      setCurrentLevelId(level.id);
      setCurrentScenarioIndex(0);
      setSelectedOption(undefined);
      setSelectedOptions([]);
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
    handleBackToCampus();
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
        config={config}
        onStart={() => {
          setShowLanding(false);
          setCurrentScreen("questionnaire");
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

      {currentScreen === "questionnaire" && (
        <QuestionnaireView
          config={config}
          onComplete={(suggestedJob) => {
            if (suggestedJob) {
              handleJobSelect(suggestedJob);
            } else {
              setCurrentScreen("campus");
            }
          }}
          onViewAllJobs={() => {
            setCurrentScreen("campus");
          }}
        />
      )}

      {currentScreen === "campus" && (
        <CampusView
          config={config}
          jobs={config.jobs}
          onJobSelect={handleJobSelect}
          onSettingsClick={() => setShowSettings(true)}
        />
      )}

      {currentScreen === "map" && selectedJob && (
        <MapView
          config={config}
          job={selectedJob}
          jobs={config.jobs}
          levels={levels}
          onLevelClick={handleLevelClick}
          onSettingsClick={() => setShowSettings(true)}
          onExpressApply={handleExpressApply}
          onBackToCampus={handleBackToCampus}
        />
      )}

      {currentScreen === "interaction" && currentLevel && currentScenario && (
        <InteractionView
          config={config}
          currentLevel={currentLevel}
          currentScenario={currentScenario}
          currentLevelId={currentLevelId!}
          currentScenarioIndex={currentScenarioIndex}
          totalScenarios={currentLevel.scenarios.length}
          totalLevels={levels.length}
          completedLevels={completedCount}
          selectedOption={selectedOption}
          selectedOptions={selectedOptions}
          textAnswer={textAnswer}
          status={status}
          showHint={showHint}
          debugMode={settings.debugMode}
          onOptionSelect={handleOptionSelect}
          onOptionsToggle={handleOptionsToggle}
          onTextAnswerChange={setTextAnswer}
          onContinue={handleContinue}
          onSettingsClick={() => setShowSettings(true)}
          onHintToggle={() => setShowHint(!showHint)}
          onExpressApply={handleExpressApply}
          onExit={() => {
            setCurrentScreen("map");
            setCurrentScenarioIndex(0);
            setSelectedOption(undefined);
            setSelectedOptions([]);
            setTextAnswer("");
            setStatus("none");
            setShowHint(false);
          }}
          onDebugCompleteLevel={handleDebugCompleteLevel}
        />
      )}

      {currentScreen === "victory" && currentLevelId && (
        <VictoryView
          config={config}
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
              setSelectedOptions([]);
              setTextAnswer("");
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
            setSelectedOptions([]);
            setTextAnswer("");
            setStatus("none");
          }}
        />
      )}

      {currentScreen === "expressApply" && (
        <ExpressApplyView
          config={config}
          formData={formData}
          onFormDataChange={(data) =>
            setFormData((prev) => ({ ...prev, ...data }))
          }
          onSubmit={handleFormSubmit}
          onClose={handleBackToCampus}
          onExploreJobs={handleBackToCampus}
        />
      )}
    </>
  );
}
