"use client";

import { useState } from "react";
import { PRONOUN_PAIRS, AI_BEHAVIOURS } from "@/lib/mockCharaData";
import { ChevronDown } from "lucide-react";

interface Props {
  selectedPronoun: string;
  onPronounChange: (p: string) => void;
  selectedBehaviours: string[];
  onBehavioursChange: (b: string[]) => void;
  creatorNote: string;
  onCreatorNoteChange: (n: string) => void;
}

export default function StepFinalPolish({
  selectedPronoun,
  onPronounChange,
  selectedBehaviours,
  onBehavioursChange,
  creatorNote,
  onCreatorNoteChange,
}: Props) {
  const [pronounOpen, setPronounOpen] = useState(false);

  const toggleBehaviour = (id: string) => {
    onBehavioursChange(
      selectedBehaviours.includes(id)
        ? selectedBehaviours.filter((b) => b !== id)
        : [...selectedBehaviours, id]
    );
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-input-bg border border-input-border text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:border-input-focus
    focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
    transition-all duration-300
  `;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Hoàn thiện</h2>
        <p className="text-xs text-text-muted mt-0.5">Xưng hô, phong cách và ghi chú</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {/* Pronoun Selector */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Cách xưng hô
          </label>
          <div className="relative">
            <button
              onClick={() => setPronounOpen((p) => !p)}
              className="
                w-full flex items-center justify-between
                px-4 py-2.5 rounded-xl text-sm
                bg-input-bg border border-input-border text-text-primary
                hover:border-border-accent transition-all duration-200
              "
            >
              <span className={selectedPronoun ? "" : "text-text-muted"}>
                {selectedPronoun || "Chọn cách xưng hô..."}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`text-text-muted transition-transform duration-200 ${pronounOpen ? "rotate-180" : ""}`}
              />
            </button>

            {pronounOpen && (
              <div className="absolute left-0 top-full mt-1 z-30 w-full max-h-[200px] overflow-y-auto rounded-xl border border-border-default bg-bg-elevated shadow-[0_8px_24px_rgba(0,0,0,0.6)] page-enter">
                {PRONOUN_PAIRS.map((pair) => (
                  <button
                    key={pair.label}
                    onClick={() => {
                      onPronounChange(pair.label);
                      setPronounOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                      ${selectedPronoun === pair.label
                        ? "text-accent-cyan bg-badge-bg"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                      }
                    `}
                  >
                    <span>{pair.label}</span>
                    <span className="text-[10px] text-text-muted">{pair.charPronoun} → {pair.userPronoun}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Behaviour Chips */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-2 block">
            Định hướng AI
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AI_BEHAVIOURS.map((b) => {
              const active = selectedBehaviours.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBehaviour(b.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                    border transition-all duration-200 active:scale-[0.97]
                    ${active
                      ? "border-border-accent bg-badge-bg text-accent-cyan"
                      : "border-border-default text-text-secondary hover:border-border-accent/40 hover:text-text-primary"
                    }
                  `}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Creator Note */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Creator&apos;s Note (tùy chọn)
          </label>
          <textarea
            value={creatorNote}
            onChange={(e) => onCreatorNoteChange(e.target.value)}
            placeholder="Ghi chú cho người sử dụng card..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}
