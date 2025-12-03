"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  content: string;
  quickReplies?: string[];
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  const response = await fetch("/api/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Hook for making LLM API calls using React Query mutation
 * 
 * @example
 * ```tsx
 * const { mutate, data, isLoading, error } = useLLM();
 * 
 * mutate({
 *   messages: [
 *     { role: "user", content: "Hello!" }
 *   ]
 * });
 * ```
 */
export function useLLM() {
  return useMutation({
    mutationFn: callLLM,
  });
}

/**
 * Hook for making LLM API calls with automatic query (useful for prefetching or one-time calls)
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useLLMQuery({
 *   messages: [
 *     { role: "user", content: "Hello!" }
 *   ],
 *   enabled: false // Set to true to auto-fetch
 * });
 * ```
 */
export function useLLMQuery(
  request: LLMRequest,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["llm", request],
    queryFn: () => callLLM(request),
    enabled: options?.enabled ?? false,
    staleTime: Infinity, // LLM responses don't change
  });
}

