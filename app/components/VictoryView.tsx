import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { config } from "../config";

interface VictoryViewProps {
  currentLevelId: number;
  totalLevels: number;
  showConfetti: boolean;
  width: number;
  height: number;
  animationEnabled: boolean;
  onExpressApply: () => void;
  onNextLevel: () => void;
  onMenu: () => void;
}

export function VictoryView({
  currentLevelId,
  totalLevels,
  showConfetti,
  width,
  height,
  animationEnabled,
  onExpressApply,
  onNextLevel,
  onMenu,
}: VictoryViewProps) {
  const isLastLevel = currentLevelId === totalLevels;
  const showNudge = currentLevelId === 3;

  return (
    <>
      {showConfetti && animationEnabled && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
      )}
      <div className="flex h-full flex-col">
        <header className="mx-auto flex w-full max-w-[1140px] items-center justify-end gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
          <button
            onClick={onExpressApply}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <span>🏁</span>
            {config.copy.jobMerken}
          </button>
        </header>
        <div className="flex-1">
          <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
            <div className="mb-4 text-6xl">🎉</div>

            <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
              {config.copy.victoryHeadline}
              <br />
              <span className="text-green-500">{config.copy.victorySubtext}</span>
            </h1>

            {showNudge && (
              <div className="mt-8 w-full max-w-md rounded-xl border-2 border-blue-300 bg-blue-50 p-6">
                <p className="mb-4 text-lg font-medium text-slate-800">
                  {config.copy.nudgeText}
                </p>
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={onExpressApply}
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
              <Button size="lg" variant="secondary" onClick={onNextLevel}>
                {config.copy.nextLevel}
              </Button>
            )}
            <Button size="lg" variant="default" className="ml-auto" onClick={onMenu}>
              {config.copy.menu}
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}

