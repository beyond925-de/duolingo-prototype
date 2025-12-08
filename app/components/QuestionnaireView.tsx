"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { config } from "../config";
import { images } from "../images";
import { Job } from "../types";

interface QuestionnaireViewProps {
  onComplete: (suggestedJob: Job | null) => void;
  onViewAllJobs: () => void;
}

interface Question {
  id: string;
  question: string;
  imageUrl?: string; // Optional image for the question
  options: Array<{
    id: string;
    label: string;
    icon: string;
    imageUrl?: string; // Optional image for the option
    score: Record<string, number>; // jobId -> score
  }>;
}

const questions: Question[] = [
  {
    id: "environment",
    question: "Wo fühlst du dich wohler?",
    // Optional: Add an imageUrl here to show an image above the question
    // imageUrl: images[0].uploadUrl,
    options: [
      {
        id: "workshop",
        label: "In der Werkstatt",
        icon: "🛠️",
        // Optional: Add an imageUrl here to replace the icon with an image
        // imageUrl: images[1].uploadUrl,
        imageUrl:
          "https://cdn.pixabay.com/photo/2021/05/11/12/12/welding-6245746_1280.jpg",
        score: {
          industriemechaniker: 2,
          "technischer-zeichner": 0,
        },
      },
      {
        id: "office",
        label: "Am Computer",
        icon: "🖥️",
        // Optional: Add an imageUrl here to replace the icon with an image
        // imageUrl: images[12].uploadUrl,
        imageUrl:
          "https://cdn.pixabay.com/photo/2018/09/18/19/55/woman-3687080_1280.jpg",
        score: {
          industriemechaniker: 0,
          "technischer-zeichner": 2,
        },
      },
    ],
  },
  {
    id: "workstyle",
    question: "Wie arbeitest du lieber?",
    options: [
      {
        id: "hands-on",
        label: "Hands-on, praktisch",
        icon: "✋",
        imageUrl:
          "https://cdn.pixabay.com/photo/2020/11/12/16/58/worker-5736096_1280.jpg",
        score: {
          industriemechaniker: 2,
          "technischer-zeichner": 1,
        },
      },
      {
        id: "planning",
        label: "Digital, planen, sauber und ordentlich",
        icon: "📐",
        imageUrl:
          "https://cdn.pixabay.com/photo/2016/11/24/20/30/floor-plan-1857175_1280.jpg",
        score: {
          industriemechaniker: 1,
          "technischer-zeichner": 2,
        },
      },
    ],
  },
  {
    id: "teamwork",
    question: "Team oder alleine?",
    options: [
      {
        id: "team",
        label: "Mit vielen Menschen, im (lauten) Team",
        icon: "👥",
        imageUrl:
          "https://images.pexels.com/photos/3184428/pexels-photo-3184428.jpeg",
        score: {
          industriemechaniker: 1,
          "technischer-zeichner": 1,
        },
      },
      {
        id: "solo",
        label: "In Ruhe, fokussiert",
        icon: "🎯",
        imageUrl:
          "https://cdn.pixabay.com/photo/2021/01/28/03/13/person-5956897_1280.jpg",
        score: {
          industriemechaniker: 1,
          "technischer-zeichner": 1,
        },
      },
    ],
  },
];

export function QuestionnaireView({
  onComplete,
  onViewAllJobs,
}: QuestionnaireViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestedJob, setSuggestedJob] = useState<Job | null>(null);

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
            <div className="mb-6 text-6xl">{suggestedJob.icon}</div>
            <h1 className="mb-4 text-3xl font-bold text-neutral-700">
              Wir empfehlen dir:
            </h1>
            <h2
              className="g mb-6 text-4xl font-bold [word-wrap:anywhere]"
              style={{ color: suggestedJob.color }}
            >
              {suggestedJob.title}
            </h2>
            <p className="text-l mb-8 text-wrap">{suggestedJob.description}</p>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                onClick={handleStartSuggestedJob}
              >
                Ersten Beruf erleben
              </Button>
              <Button
                size="lg"
                variant="primaryOutline"
                className="w-full"
                onClick={handleViewAllJobs}
              >
                Alle Berufe ansehen
              </Button>
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
              Überspringen um alle Berufe zu sehen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
