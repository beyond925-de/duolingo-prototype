import { useEffect, useState } from "react";

import { X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CompanyConfig } from "../types";

interface ExpressApplyViewProps {
  config: CompanyConfig;
  formData: {
    firstName: string;
    phoneType: string;
    schoolType: string;
    emailOrPhone: string;
    interestType?: string;
  };
  onFormDataChange: (data: Partial<ExpressApplyViewProps["formData"]>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onExploreJobs?: () => void;
}

type InterestOption = "explore" | "internship" | "apprenticeship" | "nothing";

export function ExpressApplyView({
  config,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  onExploreJobs,
}: ExpressApplyViewProps) {
  const [showFunFacts, setShowFunFacts] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Reset to initial state when component mounts or when interestType is cleared
  useEffect(() => {
    if (formData.interestType) {
      // If interestType is already set, show the form
      setShowForm(true);
    } else {
      // Reset to selection screen
      setShowForm(false);
    }
  }, [formData.interestType]);

  const handleInterestSelect = (option: InterestOption) => {
    onFormDataChange({ interestType: option });

    if (option === "nothing") {
      // If they select "nothing", go back to explore jobs
      if (onExploreJobs) {
        onExploreJobs();
      } else {
        onClose();
      }
      return;
    }

    // Show the form after selection
    setShowForm(true);
  };

  const interestOptions: Array<{
    value: InterestOption;
    label: string;
    icon: string;
  }> = [
    { value: "explore", label: "Gemeinsam Optionen erkunden", icon: "🔍" },
    { value: "internship", label: "Praktikum", icon: "💼" },
    { value: "apprenticeship", label: "Ausbildung", icon: "🎓" },
    {
      value: "nothing",
      label: "Nichts davon, weiter Jobs erkunden",
      icon: "➡️",
    },
  ];

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
        <X
          onClick={onClose}
          className="cursor-pointer text-slate-500 transition hover:opacity-75"
        />
        <h1 className="text-lg font-bold text-neutral-700">
          {config.copy.expressApply}
        </h1>
        <div className="w-6" />
      </header>

      <div className="flex-1">
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 px-6">
          {!showForm ? (
            // Step 1: Encouraging message + selection menu
            <div className="w-full space-y-6">
              {/* Encouraging message */}
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
                <div className="mb-3 text-5xl">🎉</div>
                <h2 className="mb-2 text-xl font-bold text-neutral-800">
                  Wir denken, du könntest zu uns passen!
                </h2>
                <p className="text-neutral-600">
                  Super, dass du so weit gekommen bist! Was möchtest du als
                  nächstes tun?
                </p>
              </div>

              {/* Selection menu */}
              <div className="space-y-3">
                {interestOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInterestSelect(option.value)}
                    className={cn(
                      "w-full rounded-xl border-2 bg-white p-4 text-left transition-all hover:shadow-md",
                      option.value === "nothing"
                        ? "border-slate-200 hover:border-slate-300"
                        : "border-green-200 hover:border-green-400 hover:bg-green-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium text-neutral-700">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Step 2: Form
            <div className="w-full rounded-xl border-slate-200 bg-white pt-6">
              <p className="mb-6 text-center text-neutral-600">
                {config.copy.expressApplyIntro}
              </p>

              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    {config.copy.firstName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      onFormDataChange({ firstName: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-neutral-800 transition-colors focus:border-green-500 focus:outline-none"
                    placeholder="Max"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    E-Mail / Handynummer
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.emailOrPhone}
                    onChange={(e) =>
                      onFormDataChange({ emailOrPhone: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-neutral-800 transition-colors focus:border-green-500 focus:outline-none"
                    placeholder="max@mustermann.de"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    {config.copy.schoolType}
                  </label>
                  <select
                    required
                    value={formData.schoolType}
                    onChange={(e) =>
                      onFormDataChange({ schoolType: e.target.value })
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

              {onExploreJobs && (
                <div className="mt-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="ghost"
                    className="w-full text-sm font-semibold text-slate-600"
                    onClick={onExploreJobs}
                  >
                    {config.copy.exploreOtherJobs}
                  </Button>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-neutral-500">
            Deine Daten werden sicher gespeichert und nur für die Bewerbung
            verwendet.{" "}
            <a
              href="https://docs.beyond925.de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Datenschutzerklärung
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
