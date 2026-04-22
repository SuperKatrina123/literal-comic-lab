import type { IdeaBreakdown } from "@/lib/types";

const FIELDS: {
  key: keyof Omit<IdeaBreakdown, "rawInput">;
  label: string;
  cardColor: string;
  tagBg: string;
  tagText: string;
}[] = [
  { key: "title", label: "Title", cardColor: "bg-card-blue", tagBg: "bg-tag-blue-bg", tagText: "text-tag-blue-text" },
  { key: "coreJoke", label: "Core Joke", cardColor: "bg-card-peach", tagBg: "bg-tag-peach-bg", tagText: "text-tag-peach-text" },
  { key: "normalWorld", label: "Normal World", cardColor: "bg-card-green", tagBg: "bg-tag-green-bg", tagText: "text-tag-green-text" },
  { key: "twist", label: "Twist", cardColor: "bg-card-purple", tagBg: "bg-tag-purple-bg", tagText: "text-tag-purple-text" },
  { key: "finalPayoff", label: "Final Payoff", cardColor: "bg-card-pink", tagBg: "bg-tag-pink-bg", tagText: "text-tag-pink-text" },
];

export function IdeaTab({ idea }: { idea: IdeaBreakdown }) {
  return (
    <div className="flex flex-col gap-3.5">
      {FIELDS.map((f) => (
        <div key={f.key} className={`${f.cardColor} rounded-[20px] px-6 py-5`}>
          <span
            className={`inline-block ${f.tagBg} ${f.tagText} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg mb-2`}
          >
            {f.label}
          </span>
          {f.key === "title" ? (
            <div className="text-[15px] font-semibold">{idea[f.key]}</div>
          ) : (
            <div className="text-[13px] text-gray-600 leading-relaxed">{idea[f.key]}</div>
          )}
        </div>
      ))}
    </div>
  );
}
