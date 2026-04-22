import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }
  return block.text;
}

export function stripCodeFences(text: string): string {
  const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  return match ? match[1].trim() : text.trim();
}
