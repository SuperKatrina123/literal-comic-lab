"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { GenerateRequest } from "@/lib/types";

const EXAMPLES = ["Highest Priority", "Fast Response", "Human in the Loop", "Open Office"];

const STYLES: { label: string; value: GenerateRequest["style"] }[] = [
  { label: "Minimal Webcomic", value: "minimal_webcomic" },
  { label: "Office Satire", value: "office_satire" },
  { label: "AI Comic", value: "ai_comic" },
  { label: "Indie Comic", value: "indie_comic" },
];

const TONES: { label: string; value: GenerateRequest["tone"] }[] = [
  { label: "Deadpan", value: "deadpan" },
  { label: "Playful", value: "playful" },
  { label: "More Absurd", value: "absurd" },
];

type InputPanelProps = {
  input: string;
  style: GenerateRequest["style"];
  tone: GenerateRequest["tone"];
  absurdity: number;
  loading: boolean;
  hasResult: boolean;
  onInputChange: (value: string) => void;
  onStyleChange: (value: GenerateRequest["style"]) => void;
  onToneChange: (value: GenerateRequest["tone"]) => void;
  onAbsurdityChange: (value: number) => void;
  onGenerate: () => void;
  onRegenerateAll: () => void;
  onRewritePanel4: () => void;
};

export function InputPanel({
  input,
  style,
  tone,
  absurdity,
  loading,
  hasResult,
  onInputChange,
  onStyleChange,
  onToneChange,
  onAbsurdityChange,
  onGenerate,
  onRegenerateAll,
  onRewritePanel4,
}: InputPanelProps) {
  return (
    <div className="w-[360px] shrink-0 flex flex-col gap-5">
      {/* Input card */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter a phrase, slogan, or comic idea..."
          className="w-full h-[88px] border-2 border-gray-100 rounded-[14px] px-4 py-3.5 text-sm font-sans resize-none outline-none bg-[#fafafa] focus:border-[#c8b6ff] transition-colors placeholder:text-gray-300"
        />
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-4 mb-2">
          Try an example
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex}
              onClick={() => onInputChange(ex)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                [
                  "bg-card-blue text-tag-blue-text",
                  "bg-card-peach text-tag-peach-text",
                  "bg-card-green text-tag-green-text",
                  "bg-card-purple text-tag-purple-text",
                ][i]
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Controls card */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        {/* Style */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Style</div>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => onStyleChange(s.value)}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium border-2 transition-colors ${
                  style === s.value
                    ? "border-[#c8b6ff] bg-[#f5f0ff] text-[#6a4fb8]"
                    : "border-gray-100 bg-white text-gray-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Tone</div>
          <div className="flex gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => onToneChange(t.value)}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium border-2 transition-colors ${
                  tone === t.value
                    ? "border-[#c8b6ff] bg-[#f5f0ff] text-[#6a4fb8]"
                    : "border-gray-100 bg-white text-gray-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Absurdity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Absurdity</span>
            <span className="text-sm font-semibold text-[#6a4fb8]">{absurdity} / 5</span>
          </div>
          <Slider
            value={[absurdity]}
            onValueChange={(v) => onAbsurdityChange(Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={onGenerate}
          disabled={!input.trim() || loading}
          className="w-full py-6 bg-[#1a1a1a] hover:bg-[#333] rounded-[14px] text-[15px] font-semibold"
        >
          {loading ? "Generating..." : "Generate →"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRegenerateAll}
            disabled={!hasResult || loading}
            className="flex-1 rounded-[12px] border-2 border-gray-100 text-gray-500 text-xs"
          >
            Regenerate All
          </Button>
          <Button
            variant="outline"
            onClick={onRewritePanel4}
            disabled={!hasResult || loading}
            className="flex-1 rounded-[12px] border-2 border-gray-100 text-gray-500 text-xs"
          >
            Rewrite Panel 4
          </Button>
        </div>
      </div>
    </div>
  );
}
