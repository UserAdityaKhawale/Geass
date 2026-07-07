export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context, provider, apiKey, encryptedApiKey } = body;

    // Resolve API key (decrypted from MongoDB or directly from localStorage)
    let key = apiKey;
    if (!key && encryptedApiKey) {
      key = decrypt(encryptedApiKey);
    }

    if (!key) {
      return NextResponse.json({ error: "Missing API Key. Please add your key in Settings." }, { status: 400 });
    }

    const systemPrompt = `You are Geass AI Copilot, a productivity assistant integrated directly into a personal dashboard.
You have access to the user's current project details and Kanban board tasks.
Your response MUST be a JSON object containing:
1. "response" (string) - a concise conversational message explaining your thoughts or feedback.
2. "commands" (array of objects) - optional actions to execute directly on the dashboard.

Available commands:
- { "action": "create_task", "title": "Task title", "priority": "high" | "medium" | "low", "tag": "Design" | "Dev" | "Research" | "Ideas" | "Personal" }
- { "action": "update_task_status", "taskId": "ID of task to update", "status": "todo" | "in_progress" | "done" | "backlog" }

Context:
${JSON.stringify(context, null, 2)}

Ensure all commands match the schemas provided. Reply only with valid JSON.`;

    let resultText = "";

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "OpenAI error");
      resultText = data.choices[0].message.content;
    } else if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Anthropic error");
      resultText = data.content[0].text;
    } else {
      // Default to Gemini API via direct REST Endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser request: ${prompt}` }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini error");
      resultText = data.candidates[0].content.parts[0].text;
    }

    // Try parsing the returned string to ensure it's valid JSON
    const jsonResponse = JSON.parse(resultText.trim());
    return NextResponse.json(jsonResponse);
  } catch (err: any) {
    console.error("[ai route] error:", err);
    return NextResponse.json({ error: err.message || "Failed to communicate with LLM provider" }, { status: 500 });
  }
}
