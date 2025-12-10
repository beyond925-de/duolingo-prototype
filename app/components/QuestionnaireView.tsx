"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CompanyConfig, Job } from "../types";

interface QuestionnaireViewProps {
  config: CompanyConfig;
  onComplete: (suggestedJob: Job | null) => void;
  onViewAllJobs: () => void;
}

export function QuestionnaireView({
  config,
  onComplete,
  onViewAllJobs,
}: QuestionnaireViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestedJob, setSuggestedJob] = useState<Job | null>(null);

  // Use config-based questions
  const questions = config.questionnaire?.questions || [];

  // If no questions configured, show a message and allow skipping
  if (questions.length === 0) {
    return (
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-slate-50">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
          <div className="mx-auto max-w-md text-center">
            <p className="mb-8 text-lg text-neutral-700">
              Keine Fragen konfiguriert. Bitte alle Jobs ansehen.
            </p>
            <Button size="lg" onClick={onViewAllJobs} className="w-full">
              Alle Jobs ansehen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (optionId: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate suggested job based on all answers
      const jobScores: Record<string, number> = {};
      const allJobs = config.jobs.filter((job) => job.id !== "karriere-map");

      allJobs.forEach((job) => {
        jobScores[job.id] = 0;
      });

      questions.forEach((question) => {
        const answerId = newAnswers[question.id] || optionId;
        const selectedOption = question.options.find(
          (opt) => opt.id === answerId
        );
        if (selectedOption) {
          allJobs.forEach((job) => {
            jobScores[job.id] =
              (jobScores[job.id] || 0) + (selectedOption.score[job.id] || 0);
          });
        }
      });

      // Find job with highest score
      const sortedJobs = allJobs.sort(
        (a, b) => (jobScores[b.id] || 0) - (jobScores[a.id] || 0)
      );
      const suggested = sortedJobs[0] || allJobs[0];
      setSuggestedJob(suggested);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleViewAllJobs = () => {
    onViewAllJobs();
  };

  const handleStartSuggestedJob = () => {
    if (suggestedJob) {
      onComplete(suggestedJob);
    } else {
      onViewAllJobs();
    }
  };

  if (suggestedJob) {
    return (
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-slate-50">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage:
                "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(100% 100% at 50% -10%, ${config.company.primaryColor}20 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 text-6xl">{suggestedJob.icon}</div>

            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
              Unser Tip für den Start:
            </p>

            <h1
              className="mb-4 text-4xl font-bold leading-tight [word-wrap:anywhere]"
              style={{ color: suggestedJob.color }}
            >
              {suggestedJob.title}
            </h1>

            <p className="mb-2 text-base leading-relaxed text-slate-600">
              {suggestedJob.description}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                onClick={handleStartSuggestedJob}
              >
                {config.questionnaire?.suggestionText?.startButtonText ||
                  "Ersten Beruf erleben"}
              </Button>
              <Button
                size="lg"
                variant="primaryOutline"
                className="w-full"
                onClick={handleViewAllJobs}
              >
                {config.questionnaire?.suggestionText?.viewAllButtonText ||
                  "Alle Berufe ansehen"}
              </Button>
              <p className="mt-2 text-sm text-slate-400">
                Hinweis: Du kannst jederzeit wechseln. Wir speichern deinen
                Spielstand.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(100% 100% at 50% -10%, ${config.company.primaryColor}20 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="mx-auto mt-4 w-full max-w-md">
          {/* Progress indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className="h-2 rounded-full transition-all"
                style={{
                  width: index === currentQuestionIndex ? "32px" : "8px",
                  backgroundColor:
                    index <= currentQuestionIndex
                      ? config.company.primaryColor
                      : "#e2e8f0",
                }}
              />
            ))}
          </div>

          {/* Question */}
          <div className="mb-8">
            {currentQuestion.imageUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestion.imageUrl}
                  alt=""
                  className="max-h-48 w-auto rounded-lg object-contain"
                />
              </div>
            )}
            <h2 className="text-center text-2xl font-bold text-neutral-700">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="mb-8 flex flex-col gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`flex rounded-xl border-2 border-slate-200 bg-white text-left transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.98] ${
                  option.imageUrl
                    ? "flex-col overflow-hidden p-0"
                    : "items-center gap-4 p-4"
                }`}
              >
                {option.imageUrl ? (
                  <>
                    <img
                      src={option.imageUrl}
                      alt={option.label}
                      className="h-48 w-full object-cover"
                    />
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="flex-1 text-lg font-medium text-neutral-700">
                        {option.label}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">{option.icon}</span>
                    <span className="flex-1 text-lg font-medium text-neutral-700">
                      {option.label}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleViewAllJobs}
            >
              {config.questionnaire?.suggestionText?.skipButtonText ||
                "Überspringen um alle Berufe zu sehen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
