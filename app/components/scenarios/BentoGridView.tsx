import { cn } from "@/lib/utils";
import { BaseScenarioViewProps } from "./ScenarioViewProps";

interface BentoGridViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
}

export function BentoGridView({ scenario, onContinue }: BentoGridViewProps) {
  const facts = scenario.facts || [];

  const layoutClassStyle = (
    layout: { colSpan?: number; rowSpan?: number } | undefined
  ): React.CSSProperties => {
    if (!layout) {
      return {
        gridColumn: `span 2 / span 2`,
        gridRow: `span 1 / span 1`,
      };
    }

    const colSpan = Math.min(Math.max(layout.colSpan ?? 1, 1), 2);
    const rowSpan = Math.min(Math.max(layout.rowSpan ?? 1, 1), 2);

    return {
      gridColumn: `span ${colSpan} / span ${colSpan}`,
      gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            "flex flex-col gap-4",
            "grid grid-cols-2",
            "auto-rows-[minmax(120px,auto)]"
          )}
        >
          {facts.length > 0 ? (
            facts.map((fact, index) => (
              <article
                key={`${fact.title}-${index}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  "border-2 border-slate-200",
                  "bg-gradient-to-br from-white via-slate-50/50 to-white",
                  "shadow-md backdrop-blur-sm",
                  "p-5 transition-transform duration-300 ease-out",
                  "hover:scale-[1.02] hover:shadow-lg"
                )}
                style={layoutClassStyle(fact.layout)}
              >
                <div className="flex h-full flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{fact.icon}</span>
                    <h2 className="text-base font-semibold leading-tight text-slate-800">
                      {fact.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-snug text-slate-600">
                    {fact.value}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-sm text-slate-500">
              <span>Keine Informationen verfügbar.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
