import type { StoryPanel } from "@/lib/types";

const PANEL_STYLES: {
  cardColor: string;
  tagBg: string;
  tagText: string;
}[] = [
  { cardColor: "bg-card-blue", tagBg: "bg-tag-blue-bg", tagText: "text-tag-blue-text" },
  { cardColor: "bg-card-peach", tagBg: "bg-tag-peach-bg", tagText: "text-tag-peach-text" },
  { cardColor: "bg-card-green", tagBg: "bg-tag-green-bg", tagText: "text-tag-green-text" },
  { cardColor: "bg-card-purple", tagBg: "bg-tag-purple-bg", tagText: "text-tag-purple-text" },
];

export function StoryboardTab({ storyboard }: { storyboard: StoryPanel[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {storyboard.map((panel, i) => {
        const s = PANEL_STYLES[i];
        return (
          <div key={panel.panel} className={`${s.cardColor} rounded-[20px] px-5 py-5`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-hand text-xl font-bold">Panel {panel.panel}</span>
              <span
                className={`${s.tagBg} ${s.tagText} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg`}
              >
                {panel.purpose}
              </span>
            </div>
            {(["scene", "action", "dialogue"] as const).map((field) => (
              <div key={field} className="mb-2.5 last:mb-0">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                  {field}
                </div>
                <div
                  className={`text-[13px] text-gray-600 leading-snug ${
                    field === "dialogue" ? "italic" : ""
                  }`}
                >
                  {field === "dialogue" ? `"${panel[field]}"` : panel[field]}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
