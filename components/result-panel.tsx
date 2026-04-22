"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeaTab } from "./idea-tab";
import { StoryboardTab } from "./storyboard-tab";
import { PromptTab } from "./prompt-tab";
import type { GenerateResponse } from "@/lib/types";

export function ResultPanel({
  result,
  loading,
}: {
  result: GenerateResponse | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="font-hand text-2xl text-gray-400 animate-pulse">
            Generating your comic...
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Breaking down the joke → Writing storyboard → Crafting prompts
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-300 text-lg font-hand">
          Enter an idea and hit Generate to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Tabs defaultValue="idea">
        <TabsList variant="line" className="bg-transparent gap-1 mb-5">
          <TabsTrigger
            value="idea"
            className="data-active:bg-[#1a1a1a] data-active:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Idea
          </TabsTrigger>
          <TabsTrigger
            value="storyboard"
            className="data-active:bg-[#1a1a1a] data-active:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Storyboard
          </TabsTrigger>
          <TabsTrigger
            value="prompt"
            className="data-active:bg-[#1a1a1a] data-active:text-white rounded-[12px] px-5 py-2 text-sm font-medium text-gray-400"
          >
            Prompt
          </TabsTrigger>
        </TabsList>
        <TabsContent value="idea">
          <IdeaTab idea={result.idea} />
        </TabsContent>
        <TabsContent value="storyboard">
          <StoryboardTab storyboard={result.storyboard} />
        </TabsContent>
        <TabsContent value="prompt">
          <PromptTab prompt={result.prompt} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
