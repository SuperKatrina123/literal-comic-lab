"use client";

import { useState } from "react";
import { InputPanel } from "@/components/input-panel";
import { ResultPanel } from "@/components/result-panel";
import { MOCK_RESPONSE } from "@/lib/mock-data";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<GenerateRequest["style"]>("minimal_webcomic");
  const [tone, setTone] = useState<GenerateRequest["tone"]>("playful");
  const [absurdity, setAbsurdity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResult({ ...MOCK_RESPONSE, idea: { ...MOCK_RESPONSE.idea, rawInput: input } });
    setLoading(false);
  };

  const handleRegenerateAll = () => {
    handleGenerate();
  };

  const handleRewritePanel4 = async () => {
    if (!result) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
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
