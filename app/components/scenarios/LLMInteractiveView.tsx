import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BaseScenarioViewProps } from "./ScenarioViewProps";
import { useLLM } from "../../hooks/useLLM";
import { systemPrompt, taskPrompt } from "@/lib/promtps/journey-prompts";

interface LLMInteractiveViewProps extends BaseScenarioViewProps {
  hasAnswer: boolean;
  onScenarioTextChange?: (text: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  registerSubmit?: (fn: () => void) => void;
}

export function LLMInteractiveView({
  scenario,
  textAnswer,
  hasAnswer,
  onTextAnswerChange,
  onContinue,
  onScenarioTextChange,
  onLoadingChange,
  registerSubmit,
}: LLMInteractiveViewProps) {
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >(scenario.conversationHistory || []);
  const [currentScenarioText, setCurrentScenarioText] = useState(
    scenario.scenario
  );
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const { mutate: sendLLMMessage } = useLLM();

  useEffect(() => {
    if (conversationHistory.length === 0) {
      setCurrentScenarioText(scenario.scenario);
      setQuickReplies([]);
      setShowSuggestions(false);
    }
  }, [scenario.scenario, conversationHistory.length]);

  const handleLLMSubmit = useCallback(() => {
    if (!textAnswer.trim() || isLLMLoading) return;

    if (conversationHistory.length === 0) {
      setConversationHistory([
        { role: "assistant" as const, content: scenario.scenario },
      ]);
      return;
    }

    const userMessage = textAnswer.trim();
    onTextAnswerChange("");
    setIsLLMLoading(true);
    onLoadingChange?.(true);

    const updatedHistory = [
      ...conversationHistory,
      { role: "user" as const, content: userMessage },
    ];
    setConversationHistory(updatedHistory);

    const messages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: taskPrompt,
      },
      ...updatedHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    sendLLMMessage(
      {
        messages,
        temperature: 0.8,
        max_tokens: 500,
      },
      {
        onSuccess: (response) => {
          const assistantResponse = response.content;
          const newHistory = [
            ...updatedHistory,
            { role: "assistant" as const, content: assistantResponse },
          ];
          setConversationHistory(newHistory);
          setCurrentScenarioText(assistantResponse);
          onScenarioTextChange?.(assistantResponse);
          if (response.quickReplies && response.quickReplies.length > 0) {
            setQuickReplies(response.quickReplies);
            setShowSuggestions(false);
          }
          setIsLLMLoading(false);
          onLoadingChange?.(false);
        },
        onError: (error) => {
          console.error("LLM error:", error);
          setIsLLMLoading(false);
          const errorHistory = [
            ...updatedHistory,
            {
              role: "assistant" as const,
              content:
                "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
            },
          ];
          setConversationHistory(errorHistory);
          onLoadingChange?.(false);
        },
      }
    );
  }, [
    textAnswer,
    isLLMLoading,
    conversationHistory,
    sendLLMMessage,
    scenario.scenario,
    onTextAnswerChange,
    onScenarioTextChange,
    onLoadingChange,
  ]);

  useEffect(() => {
    if (registerSubmit) {
      registerSubmit(handleLLMSubmit);
    }
  }, [handleLLMSubmit, registerSubmit]);

  return (
    <>
      <h3 className="font-semibold text-slate-800">Ich werde zuerst...</h3>

      <div className="border-slate-200 pt-2">
        <div className="relative">
          <textarea
            value={textAnswer}
            onChange={(e) => onTextAnswerChange(e.target.value)}
            placeholder="Bedienungsanleitung suchen? Kollegen fragen?"
            rows={3}
            disabled={isLLMLoading}
            className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 pr-14 text-base focus:border-purple-300 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onTextAnswerChange("")}
              disabled={isLLMLoading}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
            >
              <span className="text-lg">🗑️</span>
              Leeren
            </button>
            {quickReplies.length > 0 && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                disabled={isLLMLoading}
              >
                Vorschläge anzeigen
                <span
                  className={cn(
                    "text-lg transition-transform",
                    showSuggestions && "rotate-180"
                  )}
                >
                  ⌄
                </span>
              </button>
            )}
          </div>
          {showSuggestions && quickReplies.length > 0 && (
            <div className="mt-4 space-y-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onTextAnswerChange(reply);
                    setShowSuggestions(false);
                  }}
                  disabled={isLLMLoading}
                  className="w-full rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 text-left text-sm font-medium text-purple-800 transition hover:border-purple-300 hover:bg-purple-100 disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
