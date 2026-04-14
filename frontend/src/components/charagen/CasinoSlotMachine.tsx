"use client";

import { useState, useCallback, useRef } from "react";
import type { SlotReel } from "@/lib/mockCharaData";
import { DEFAULT_SLOT_REELS } from "@/lib/mockCharaData";
import { ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassEffect";
import SlotReelCarousel, { SlotReelRef } from "./SlotReelCarousel";

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

  // Use refs to control the carousels for spinning
  const reelRefs = [
    useRef<SlotReelRef>(null),
    useRef<SlotReelRef>(null),
    useRef<SlotReelRef>(null)
  ];

  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Initialize selected indices
  const [selectedIndices, setSelectedIndices] = useState<number[]>(reels.map(() => 0));

  const handleCenterChange = useCallback((reelIndex: number, _: string, optionIndex: number) => {
    setSelectedIndices(prev => {
      const newIndices = [...prev];
      newIndices[reelIndex] = optionIndex;

      // Update results immediately when user scrolls manually (if they have spun at least once, or if we want it active always)
      const newResults = reels.map((r, i) => r.options[newIndices[i]]);
      onResults(newResults);

      return newIndices;
    });
  }, [reels, onResults]);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setHasSpun(true);

    const finalIndices = reels.map((reel) =>
      Math.floor(Math.random() * reel.options.length)
    );

    // Trigger spin animation on all carousels
    reelRefs.forEach((ref, i) => {
      if (ref.current) {
        // We pass the target index. The carousel component handles adding multiple rotations to make it look like a spin
        ref.current.spinTo(finalIndices[i]);
      }
    });

    // Wait for the animation to finish before enabling the button again
    setTimeout(() => {
      setSpinning(false);
      onResults(finalIndices.map((idx, i) => reels[i].options[idx]));
    }, 2500); // Adjust this timeout based on how long the spin animation takes in SlotReelCarousel
  }, [spinning, reels, onResults, reelRefs]);

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-input-bg border border-input-border text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:border-input-focus
    focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
    transition-all duration-300
  `;

  const canProceed = hasSpun || customScenario.trim().length > 0 || selectedIndices.some(i => i > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tạo bối cảnh</h2>
        <p className="text-xs text-text-muted mt-0.5">Cuộn để chọn tự do hoặc gạt cần xèng để tạo ngẫu nhiên</p>
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

          {/* Reel windows - Updated for Scrollable UI */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {reels.map((reel, i) => (
              <div
                key={reel.id}
                className="
                  h-[150px] rounded-lg overflow-hidden
                  border border-border-default bg-bg-primary
                  relative
                "
              >
                {/* Center highlight box */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[40px] bg-white/5 border-y border-white/10 pointer-events-none z-10 box-border" />

                {/* Top/bottom accent lines */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent z-20" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent z-20" />

                <SlotReelCarousel
                  ref={reelRefs[i]}
                  items={reel.options.map((opt, idx) => ({ id: `${reel.id}-${idx}`, content: <span className="text-[11px] text-center leading-tight px-1">{opt}</span> }))}
                  activeHeight={150}
                  itemHeight={40}
                  onCenterChange={(id, idx) => handleCenterChange(i, id, idx)}
                  spinning={spinning}
                  className="w-full h-full"
                />
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
            {spinning ? "Đang quay..." : (hasSpun || selectedIndices.some(i => i > 0)) ? "Quay lại" : "Gạt cần"}
          </button>

          {/* Results */}
          {(hasSpun || selectedIndices.some(i => i > 0)) && !spinning && (
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
