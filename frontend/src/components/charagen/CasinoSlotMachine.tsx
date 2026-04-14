"use client";

import { useState, useCallback } from "react";
import type { SlotReel } from "@/lib/mockCharaData";
import { DEFAULT_SLOT_REELS } from "@/lib/mockCharaData";
import { ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassEffect";

interface Props {
  customReels?: SlotReel[];
  results: string[];
  onResults: (r: string[]) => void;
  customScenario: string;
  onCustomScenario: (s: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepScenario({
  customReels,
  results,
  onResults,
  customScenario,
  onCustomScenario,
  onNext,
  onBack,
}: Props) {
  const reels = customReels || DEFAULT_SLOT_REELS;
  const [indices, setIndices] = useState<number[]>(reels.map(() => 0));
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setHasSpun(true);

    const finalIndices = reels.map((reel) =>
      Math.floor(Math.random() * reel.options.length)
    );

    let step = 0;
    const maxSteps = 14;
    const interval = setInterval(() => {
      step++;
      if (step < maxSteps) {
        setIndices(reels.map((reel) =>
          Math.floor(Math.random() * reel.options.length)
        ));
      } else {
        clearInterval(interval);
        setIndices(finalIndices);
        onResults(finalIndices.map((idx, i) => reels[i].options[idx]));
        setTimeout(() => setSpinning(false), 200);
      }
    }, 100);
  }, [spinning, reels, onResults]);

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-input-bg border border-input-border text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:border-input-focus
    focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
    transition-all duration-300
  `;

  const canProceed = hasSpun || customScenario.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tạo bối cảnh</h2>
        <p className="text-xs text-text-muted mt-0.5">Gạt cần xèng để tạo ngẫu nhiên</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Slot machine — centered */}
        <div className="w-full max-w-md rounded-xl border border-border-default bg-bg-surface p-5">
          {/* Reel labels */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {reels.map((reel) => (
              <p key={reel.id} className="text-[10px] text-text-muted text-center font-medium">
                {reel.label}
              </p>
            ))}
          </div>

          {/* Reel windows */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {reels.map((reel, i) => (
              <div
                key={reel.id}
                className="
                  h-12 rounded-lg overflow-hidden
                  border border-border-default bg-bg-primary
                  flex items-center justify-center px-2
                  relative
                "
              >
                {/* Top/bottom accent lines */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-cyan/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent-purple/20 to-transparent" />

                <span
                  className={`
                    text-[11px] text-center leading-tight transition-all duration-150
                    ${spinning
                      ? "text-text-muted opacity-60"
                      : hasSpun
                        ? "text-accent-cyan font-medium"
                        : "text-text-muted"
                    }
                  `}
                >
                  {reel.options[indices[i]]}
                </span>
              </div>
            ))}
          </div>

          {/* Spin button */}
          <button
            onClick={spin}
            disabled={spinning}
            className={`
              w-full py-3 rounded-xl text-sm font-medium
              border transition-all duration-300
              active:scale-[0.98] disabled:opacity-40
              ${spinning
                ? "border-accent-purple/40 text-accent-purple bg-accent-purple/5 animate-pulse"
                : "border-border-accent text-accent-cyan bg-accent-cyan/5 hover:bg-accent-cyan/10 hover:shadow-[0_0_12px_rgba(0,255,240,0.1)]"
              }
            `}
          >
            {spinning ? "Đang quay..." : hasSpun ? "Quay lại" : "Gạt cần"}
          </button>

          {/* Results */}
          {hasSpun && !spinning && (
            <div className="mt-4 pt-3 border-t border-border-default page-enter">
              <div className="flex flex-wrap gap-1.5">
                {results.map((r, i) => (
                  <span
                    key={i}
                    className="
                      inline-flex px-2 py-1 rounded-md text-[10px]
                      border border-border-accent/30 text-accent-cyan bg-badge-bg
                    "
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Or custom */}
        <button
          onClick={() => setShowCustom((p) => !p)}
          className="text-[11px] text-text-muted hover:text-text-secondary transition-colors mt-4"
        >
          {showCustom ? "Ẩn ô nhập tay" : "Hoặc nhập tình huống tự chọn"}
        </button>

        {showCustom && (
          <div className="w-full max-w-md mt-3 page-enter">
            <textarea
              value={customScenario}
              onChange={(e) => onCustomScenario(e.target.value)}
              placeholder="Mô tả tình huống bạn muốn..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        )}
      </div>

      {/* Next */}
      <div className="pt-5 shrink-0 flex gap-3">
        <GlassButton variant="ghost" onClick={onBack} className="px-4">
          Quay lại
        </GlassButton>
        <GlassButton
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 flex items-center justify-center gap-2 py-3"
        >
          Tiếp theo
          <ArrowRight size={16} strokeWidth={1.5} />
        </GlassButton>
      </div>
    </div>
  );
}
