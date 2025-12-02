import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { config } from "../config";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLanding: () => void;
  settings: {
    showStartScreen: boolean;
    vibration: boolean;
    sound: boolean;
    animation: boolean;
  };
  onSettingChange: (key: string, value: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onShowLanding,
  settings,
  onSettingChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-2xl border-2 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-700">
            {config.copy.settings.title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              onShowLanding();
              onClose();
            }}
          >
            {config.copy.settings.showStartScreen}
          </Button>

          {[
            { key: "vibration", label: config.copy.settings.vibration },
            { key: "sound", label: config.copy.settings.sound },
            { key: "animation", label: config.copy.settings.animation },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border-2 border-slate-200 p-4"
            >
              <span className="font-medium text-neutral-700">{label}</span>
              <button
                onClick={() =>
                  onSettingChange(key, !settings[key as keyof typeof settings])
                }
                className={cn(
                  "relative h-7 w-12 rounded-full transition-colors",
                  settings[key as keyof typeof settings]
                    ? "bg-green-500"
                    : "bg-slate-300"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                    settings[key as keyof typeof settings]
                      ? "translate-x-[22px]"
                      : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

