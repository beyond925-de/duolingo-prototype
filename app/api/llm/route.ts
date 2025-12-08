import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

interface LLMRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// Define the schema for structured output
const scenarioSchema = z.object({
  scenario: z
    .string()
    .describe("Die entwickelte Situation oder Herausforderung"),
  quickReplies: z
    .array(z.string())
    .describe("Array von schnellen Antwortvorschlägen für den Nutzer"),
});

export async function POST(req: NextRequest) {
  try {
    const body: LLMRequest = await req.json();

    // Validate request
    if (
      !body.messages ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0
    ) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    const modelName = body.model || "gemini-2.5-flash";

    // Separate system messages from conversation messages
    const systemMessages = body.messages.filter((m) => m.role === "system");
    const conversationMessages = body.messages.filter(
      (m) => m.role !== "system"
    );

    // Build system instruction from system messages
    const systemInstruction = systemMessages.map((m) => m.content).join("\n");

    // Convert messages to AI SDK format
    const messages = conversationMessages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Use Vercel AI SDK to generate structured object
    const result = await generateObject({
      model: google(modelName),
      schema: scenarioSchema,
      messages,
      system: systemInstruction || undefined,
      temperature: body.temperature ?? 0.7,
    });

    const response = {
      content: result.object.scenario,
      quickReplies: result.object.quickReplies,
      model: modelName,
      usage: {
        prompt_tokens: result.usage?.inputTokens,
        completion_tokens: result.usage?.outputTokens,
        total_tokens: result.usage?.totalTokens,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("LLM API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
