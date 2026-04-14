"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import {
  type Franchise,
  type CharacterBase,
  type CategoryTheme,
  FRANCHISES,
  CHARACTERS,
  CATEGORY_LABELS,
} from "@/lib/mockCharaData";
import { ArrowRight, Plus } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassEffect";
import CS2Carousel from "./CS2Carousel";

interface Props {
  onSelect: (char: CharacterBase | null, franchise: Franchise | null) => void;
  onNext: () => void;
  selectedCharId: string | null;
  selectedFranchiseId: string | null;
}

/* ─── Category toggle (cycles through themes with animation) ─── */
function CategoryToggle({
  current,
  onChange,
}: {
  current: CategoryTheme;
  onChange: (t: CategoryTheme) => void;
}) {
  const themes = Object.keys(CATEGORY_LABELS) as CategoryTheme[];
  const [animClass, setAnimClass] = useState("");

  const nextTheme = () => {
    /* play exit on label */
    setAnimClass("carousel-exit");
    setTimeout(() => {
      const idx = themes.indexOf(current);
      onChange(themes[(idx + 1) % themes.length]);
      setAnimClass("carousel-slide-left");
    }, 200);
  };

  return (
    <button
      onClick={nextTheme}
      className="
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border border-border-default text-text-secondary
        hover:border-border-accent hover:text-accent-cyan
        transition-all duration-200 active:scale-95
        overflow-hidden
      "
    >
      <span
        key={current}
        className={animClass}
        onAnimationEnd={() => setAnimClass("")}
      >
        {CATEGORY_LABELS[current]}
      </span>
      <span className="text-text-muted text-[10px]">▸</span>
    </button>
  );
}

/* ─── Card content for franchise ─── */
function FranchiseCard({ franchise }: { franchise: Franchise }) {
  return (
    <div className="relative w-full h-full bg-bg-elevated">
      <Image
        src="/placeholder-franchise.png"
        alt={franchise.parodyName}
        fill
        className="object-cover"
        sizes="220px"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-3 text-center">
        <p className="text-[11px] font-semibold text-white/95 leading-tight drop-shadow-lg">
          {franchise.parodyName}
        </p>
      </div>
    </div>
  );
}

/* ─── Card content for character ─── */
function CharacterCard({ character }: { character: CharacterBase }) {
  return (
    <div className="relative w-full h-full bg-bg-elevated">
      <Image
        src="/placeholder-character.png"
        alt={character.parodyName}
        fill
        className="object-cover"
        sizes="220px"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-3 text-center">
        <p className="text-[11px] font-semibold text-white/95 leading-tight drop-shadow-lg">
          {character.parodyName}
        </p>
      </div>
    </div>
  );
}

/* ─── OC Card ─── */
function OCCard() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 bg-bg-surface/80 backdrop-blur-sm border border-dashed border-accent-purple/30">
      <div className="w-12 h-12 rounded-full flex items-center justify-center border border-accent-purple/30 bg-accent-purple/5">
        <Plus size={22} strokeWidth={1.5} className="text-accent-purple" />
      </div>
      <p className="text-[11px] font-medium text-accent-purple">Tạo OC mới</p>
    </div>
  );
}

export default function StepFranchise({
  onSelect,
  onNext,
  selectedCharId,
  selectedFranchiseId,
}: Props) {
  const [theme, setTheme] = useState<CategoryTheme>("anime");
  const [phase, setPhase] = useState<"franchise" | "character">("franchise");
  const [transitionKey, setTransitionKey] = useState(0);
  const [phaseAnim, setPhaseAnim] = useState("carousel-enter");

  const selectedFranchise = FRANCHISES.find((f) => f.id === selectedFranchiseId) ?? null;
  const isOC = selectedFranchise !== null && selectedCharId === "__OC__";

  /* ─── Franchise carousel items ─── */
  const franchiseItems = useMemo(() => {
    return FRANCHISES.filter((f) => f.theme === theme).map((f) => ({
      id: f.id,
      content: <FranchiseCard franchise={f} />,
    }));
  }, [theme]);

  /* ─── Character carousel items ─── */
  const characterItems = useMemo(() => {
    if (!selectedFranchise) return [];
    const chars = CHARACTERS.filter((c) => c.franchiseId === selectedFranchise.id);
    const charCards = chars.map((c) => ({
      id: c.id,
      content: <CharacterCard character={c} />,
    }));
    charCards.push({ id: "__OC__", content: <OCCard /> });
    return charCards;
  }, [selectedFranchise]);

  /* ─── Theme toggle with exit → enter animation ─── */
  const handleThemeChange = useCallback(
    (t: CategoryTheme) => {
      setPhaseAnim("carousel-exit");
      setTimeout(() => {
        setTheme(t);
        setPhase("franchise");
        onSelect(null, null);
        setTransitionKey((k) => k + 1);
        setPhaseAnim("carousel-enter");
      }, 250);
    },
    [onSelect]
  );

  /* ─── Select franchise → switch to character carousel ─── */
  const handleFranchiseSelect = useCallback(
    (id: string) => {
      const franchise = FRANCHISES.find((f) => f.id === id) ?? null;
      if (franchise) {
        setPhaseAnim("carousel-exit");
        setTimeout(() => {
          onSelect(null, franchise);
          setPhase("character");
          setTransitionKey((k) => k + 1);
          setPhaseAnim("carousel-slide-left");
        }, 250);
      }
    },
    [onSelect]
  );

  /* ─── Back to franchise carousel ─── */
  const handleBackToFranchise = useCallback(() => {
    setPhaseAnim("carousel-exit");
    setTimeout(() => {
      setPhase("franchise");
      onSelect(null, null);
      setTransitionKey((k) => k + 1);
      setPhaseAnim("carousel-slide-right");
    }, 250);
  }, [onSelect]);

  const handleCharacterSelect = useCallback(
    (id: string) => {
      if (id === "__OC__") {
        onSelect(null, selectedFranchise);
      } else {
        const char = CHARACTERS.find((c) => c.id === id) ?? null;
        onSelect(char, selectedFranchise);
      }
    },
    [onSelect, selectedFranchise]
  );

  const hasSelection = selectedCharId !== null || isOC;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">
            {phase === "franchise" ? "Chọn thế giới" : "Chọn nhân vật"}
          </h2>
          <p className="text-xs text-text-muted mt-0.5 truncate">
            {phase === "franchise"
              ? "Vuốt để duyệt, chạm để chọn"
              : selectedFranchise?.parodyName}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {phase === "character" && (
            <button
              onClick={handleBackToFranchise}
              className="
                px-2.5 py-1.5 rounded-lg text-[11px]
                text-text-muted hover:text-text-secondary hover:bg-bg-surface
                transition-all duration-200
              "
            >
              ← Đổi thế giới
            </button>
          )}
          <CategoryToggle current={theme} onChange={handleThemeChange} />
        </div>
      </div>

      {/* Carousel area with transitions */}
      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        <div
          key={transitionKey}
          className={`w-full ${phaseAnim}`}
          onAnimationEnd={() => {
            /* clear exit class after it completes to not interfere */
            if (phaseAnim === "carousel-exit") return;
            setPhaseAnim("");
          }}
        >
          {phase === "franchise" && franchiseItems.length > 0 && (
            <CS2Carousel
              items={franchiseItems}
              activeHeight={300}
              onSelect={handleFranchiseSelect}
              selectedId={selectedFranchiseId}
              className="w-full"
            />
          )}

          {phase === "character" && characterItems.length > 0 && (
            <CS2Carousel
              items={characterItems}
              activeHeight={300}
              onSelect={handleCharacterSelect}
              selectedId={selectedCharId}
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Next button */}
      {phase === "character" && hasSelection && (
        <div className="pt-3 shrink-0 carousel-enter">
          <GlassButton onClick={onNext} className="w-full flex items-center justify-center gap-2 py-3">
            Tiếp theo
            <ArrowRight size={16} strokeWidth={1.5} />
          </GlassButton>
        </div>
      )}
    </div>
  );
}
