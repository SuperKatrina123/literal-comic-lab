"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptResult } from "@/lib/types";

export function PromptTab({ prompt }: { prompt: PromptResult }) {
  const [copied, setCopied] = useState<"full" | "style" | null>(null);

  const handleCopy = async (text: string, type: "full" | "style") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-3.5">
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Style Prompt</div>
        <div className="bg-white border-2 border-gray-100 rounded-[16px] p-4 text-[13px] text-gray-500 leading-relaxed font-mono">
          {prompt.stylePrompt}
        </div>
      </div>
      <div className="mb-3.5">
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Full Prompt</div>
        <div className="bg-white border-2 border-gray-100 rounded-[16px] p-4 text-[13px] text-gray-500 leading-relaxed font-mono max-h-[240px] overflow-y-auto">
          {prompt.fullPrompt}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleCopy(prompt.fullPrompt, "full")}
          className="bg-[#1a1a1a] hover:bg-[#333] rounded-[12px] text-sm font-semibold px-5"
        >
          {copied === "full" ? "Copied!" : "Copy Prompt →"}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleCopy(prompt.stylePrompt, "style")}
          className="rounded-[12px] border-2 border-gray-100 text-gray-500 text-sm"
        >
          {copied === "style" ? "Copied!" : "Copy Style Only"}
        </Button>
      </div>
    </div>
  );
}
