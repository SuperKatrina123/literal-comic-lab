"use client";

import { useState } from "react";
import { InputPanel } from "@/components/input-panel";
import { ResultPanel } from "@/components/result-panel";
import type {
  GenerateRequest,
  GenerateResponse,
  RewritePayoffResponse,
} from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<GenerateRequest["style"]>("minimal_webcomic");
  const [tone, setTone] = useState<GenerateRequest["tone"]>("playful");
  const [absurdity, setAbsurdity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, style, tone, absurdity }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAll = () => {
    handleGenerate();
  };

  const handleRewritePanel4 = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rewrite-payoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: result.idea,
          storyboard: result.storyboard,
          style,
          tone,
          absurdity,
        }),
      });
      if (!res.ok) throw new Error("Rewrite failed");
      const data: RewritePayoffResponse = await res.json();
      setResult({ ...result, storyboard: data.storyboard, prompt: data.prompt });
    } catch {
      alert("Rewrite failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5">
        <h1 className="font-hand text-[28px] font-bold">Literal Comic Lab.</h1>
        <p className="text-[13px] text-gray-400">
          Turn a simple joke into a 4-panel comic storyboard and image prompt
        </p>
      </header>

      {/* Main */}
      <main className="flex gap-9 px-10 pb-10">
        <InputPanel
          input={input}
          style={style}
          tone={tone}
          absurdity={absurdity}
          loading={loading}
          hasResult={result !== null}
          onInputChange={setInput}
          onStyleChange={setStyle}
          onToneChange={setTone}
          onAbsurdityChange={setAbsurdity}
          onGenerate={handleGenerate}
          onRegenerateAll={handleRegenerateAll}
          onRewritePanel4={handleRewritePanel4}
        />
        <ResultPanel result={result} />
      </main>
    </div>
  );
}
