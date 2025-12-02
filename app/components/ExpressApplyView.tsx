import { useState } from "react";

import { X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { config } from "../config";

interface ExpressApplyViewProps {
  formData: {
    firstName: string;
    phoneType: string;
    schoolType: string;
    emailOrPhone: string;
  };
  onFormDataChange: (data: Partial<ExpressApplyViewProps["formData"]>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ExpressApplyView({
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
}: ExpressApplyViewProps) {
  const [showFunFacts, setShowFunFacts] = useState(false);

  return (
    <div className="flex h-full flex-col">
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
          <div className="w-full rounded-xl border-slate-200 bg-white pt-6">
            <p className="mb-6 text-center text-neutral-600">
              Ein paar kurze Infos genügen. Wir melden uns bei dir!
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

              <div>
                <button
                  type="button"
                  onClick={() => setShowFunFacts(!showFunFacts)}
                  className="flex w-full items-center justify-between rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-neutral-700 transition-all hover:border-green-300"
                >
                  <span>Fun Facts</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      showFunFacts && "rotate-180"
                    )}
                  />
                </button>
                {showFunFacts && (
                  <div className="mt-3 transition-all duration-200 ease-in-out">
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      {config.copy.phoneType}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onFormDataChange({ phoneType: "android" })
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
                          onFormDataChange({ phoneType: "iphone" })
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
                )}
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
