"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Pen, Sparkles, Wand2, BookOpen, Globe, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassEffect";
import FranchiseSelector from "@/components/charagen/FranchiseSelector";
import PersonalitySliders from "@/components/charagen/PersonalitySliders";
import CasinoSlotMachine from "@/components/charagen/CasinoSlotMachine";
import FinalPolish from "@/components/charagen/FinalPolish";
import type { CharacterBase, Franchise, SlotReel } from "@/lib/mockCharaData";
import { DEFAULT_SLOT_REELS } from "@/lib/mockCharaData";

type CreateMode = "zero-text" | "manual" | "ai" | "lorebook" | "world";

const MODE_OPTIONS = [
  { id: "zero-text", label: "Tạo Card (Zero-Text)", icon: Wand2, neon: "text-accent-cyan" },
  { id: "manual", label: "Tạo Card (Thủ công)", icon: Pen, neon: "text-text-primary" },
  { id: "ai", label: "Tạo Card (AI)", icon: Sparkles, neon: "text-accent-purple" },
  { id: "lorebook", label: "Tạo Lorebook", icon: BookOpen, neon: "text-text-primary" },
  { id: "world", label: "Tạo Thế Giới", icon: Globe, neon: "text-text-primary" },
];

/* ─── Step dots matching neon design ─── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-surface border border-border-default h-[42px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background:
              i <= current
                ? "var(--accent-cyan)"
                : "var(--border-default)",
            opacity: i < current ? 0.5 : 1,
            boxShadow: i === current ? "0 0 8px rgba(0,255,240,0.3)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function UniversalCreatePage() {
  const router = useRouter();
  const [mode, setMode] = useState<CreateMode>("zero-text");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [step, setStep] = useState(0);

  /* ─── State for Zero-Text ─── */
  const [selectedChar, setSelectedChar] = useState<CharacterBase | null>(null);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [ocSelected, setOcSelected] = useState(false);
  // isOC = user explicitly picked the "Tạo OC" card inside FranchiseSelector
  const isOC = ocSelected && selectedChar === null;

  const [traits, setTraits] = useState({ kindness: 50, aggression: 50, intelligence: 50, humor: 50, mystery: 50, romance: 50 });
  const [appearance, setAppearance] = useState({ height: 50, build: 50, charm: 50, age: 50 });
  const [nickname, setNickname] = useState("");
  const [loreOverride, setLoreOverride] = useState("");

  const [slotResults, setSlotResults] = useState<string[]>([]);
  const [customScenario, setCustomScenario] = useState("");

  const [pronoun, setPronoun] = useState("");
  const [behaviours, setBehaviours] = useState<string[]>([]);
  const [creatorNote, setCreatorNote] = useState("");

  const [generating, setGenerating] = useState(false);

  const handleCharSelect = useCallback((char: CharacterBase | null, franchise: Franchise | null) => {
    setSelectedChar(char);
    if (franchise !== undefined) setSelectedFranchise(franchise);
    // Track whether user picked the OC card (char===null but franchise set)
    setOcSelected(franchise !== null && char === null);
    if (char) {
      setTraits(char.baseTraits);
      setAppearance(char.baseAppearance);
      setNickname("");
    }
  }, []);

  const buildReels = (): SlotReel[] | undefined => {
    if (!selectedChar?.customSlots) return undefined;
    const cs = selectedChar.customSlots;
    return DEFAULT_SLOT_REELS.map((reel) => {
      if (reel.id === "location" && cs.locations) return { ...reel, options: [...cs.locations, ...reel.options.slice(0, 5)] };
      if (reel.id === "status" && cs.statuses) return { ...reel, options: [...cs.statuses, ...reel.options.slice(0, 5)] };
      if (reel.id === "relation" && cs.relations) return { ...reel, options: [...cs.relations, ...reel.options.slice(0, 5)] };
      return reel;
    });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert("🎉 Card đã được tạo! (Demo – Backend chưa kết nối)");
    }, 2000);
  };

  const goBackStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const goNextStep = () => {
    if (step < 3) setStep(step + 1);
  };



  const activeModeOption = MODE_OPTIONS.find(m => m.id === mode) || MODE_OPTIONS[0];
  const ActiveIcon = activeModeOption.icon;

  const handleModeChange = (id: string) => {
    setDropdownOpen(false);
    if (id === "lorebook") {
      router.push("/create/lorebooks");
    } else if (id === "world") {
      router.push("/create/worlds");
    } else {
      setMode(id as CreateMode);
      setStep(0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-[100dvh] max-w-6xl mx-auto page-enter overflow-hidden">
      
      {/* ─── HEADER ─── */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-border-default/50 bg-bg-primary z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-all duration-200">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <div className="min-w-0">
             <h1 className="text-xl font-semibold hidden sm:block truncate">Tạo mới</h1>
             {mode === "zero-text" && (
                <p className="text-[11px] text-text-muted mt-0.5 truncate sm:hidden">
                   Tavern Spec V2
                </p>
             )}
          </div>
        </div>

        {/* Global Mode Selector Dropdown & Step Dots */}
        <div className="flex items-center gap-2">
          
          {mode === "zero-text" && (
            <StepDots current={step} total={4} />
          )}

          <div className="relative z-50">
            <button
              onClick={() => setDropdownOpen(p => !p)}
              className="flex items-center justify-between gap-3 min-w-[200px] px-3 py-2 h-[42px] rounded-xl border border-border-accent bg-bg-surface hover:shadow-[0_0_12px_rgba(0,255,240,0.1)] transition-all duration-200"
            >
               <span className={`flex items-center gap-2 text-sm font-medium ${activeModeOption.neon}`}>
                 <ActiveIcon size={16} strokeWidth={1.5} />
                 {activeModeOption.label}
               </span>
               <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border-default bg-bg-surface/95 backdrop-blur-md shadow-xl overflow-hidden page-enter py-1">
                {MODE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleModeChange(opt.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left
                        ${mode === opt.id ? "bg-bg-elevated font-medium " + opt.neon : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"}
                      `}
                    >
                      <Icon size={15} strokeWidth={1.5} className={mode === opt.id ? opt.neon : ""} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex min-h-0 bg-bg-primary">
        
        {/* Content panel */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 relative min-h-0 container-snap">
           {mode === "zero-text" && (
             <div className="max-w-3xl mx-auto h-full flex flex-col page-enter" key={step}>
                {step === 0 && (
                  <FranchiseSelector
                    onSelect={handleCharSelect}
                    onNext={goNextStep} 
                    selectedCharId={selectedChar?.id ?? (ocSelected ? "__OC__" : null)}
                    selectedFranchiseId={selectedFranchise?.id ?? null}
                  />
                )}
                {step === 1 && (
                  <PersonalitySliders
                    character={selectedChar} traits={traits} appearance={appearance} nickname={nickname} loreOverride={loreOverride}
                    onTraitsChange={setTraits} onAppearanceChange={setAppearance} onNicknameChange={setNickname} onLoreChange={setLoreOverride}
                    onNext={goNextStep} onBack={goBackStep} isOC={isOC}
                  />
                )}
                {step === 2 && (
                  <CasinoSlotMachine
                    customReels={buildReels()} results={slotResults} onResults={setSlotResults}
                    customScenario={customScenario} onCustomScenario={setCustomScenario} onNext={goNextStep} onBack={goBackStep}
                  />
                )}
                {step === 3 && (
                  <div className="flex flex-col gap-6">
                    <FinalPolish
                      selectedPronoun={pronoun} onPronounChange={setPronoun}
                      selectedBehaviours={behaviours} onBehavioursChange={setBehaviours}
                      creatorNote={creatorNote} onCreatorNoteChange={setCreatorNote}
                    />

                    {/* Summary row */}
                    {(selectedChar || ocSelected) && (
                      <div className="rounded-xl border border-border-default bg-bg-surface p-4 page-enter">
                        <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Thẻ đang tạo</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                          <span className="text-text-muted">Nhân vật</span>
                          <span className="text-text-primary font-medium truncate">
                            {nickname || selectedChar?.parodyName || "OC mới"}
                          </span>
                          <span className="text-text-muted">Vũ trụ</span>
                          <span className="text-text-primary font-medium truncate">
                            {selectedFranchise?.parodyName || "—"}
                          </span>
                          <span className="text-text-muted">Bối cảnh</span>
                          <span className="text-accent-cyan font-medium truncate">
                            {customScenario || slotResults.join(" · ") || "—"}
                          </span>
                          <span className="text-text-muted">Xưng hô</span>
                          <span className="text-text-primary font-medium">{pronoun || "Chưa chọn"}</span>
                        </div>
                      </div>
                    )}

                    {/* Generate + Back buttons */}
                    <div className="flex gap-3 pt-2 shrink-0">
                      <GlassButton
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                        onClick={handleGenerate}
                        disabled={generating}
                      >
                        {generating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                            Đang phân tích...
                          </>
                        ) : (
                          <>
                            <Wand2 size={16} strokeWidth={1.5} />
                            Tạo Card
                          </>
                        )}
                      </GlassButton>
                      <GlassButton variant="ghost" onClick={goBackStep}>Quay lại</GlassButton>
                    </div>
                  </div>
                )}
             </div>
           )}

           {mode === "manual" && (
              <div className="flex w-full h-[60vh] items-center justify-center page-enter">
                  <div className="text-center">
                    <Pen size={32} strokeWidth={1.5} className="mx-auto mb-4 text-text-muted" />
                    <h2 className="text-xl font-medium mb-2">Chế độ Tùy chỉnh Thủ công</h2>
                    <p className="text-sm text-text-secondary opacity-80 max-w-sm mx-auto">
                      Tự do sáng tạo từng trường thông số của Tavern Spec V2 mà không giới hạn.
                    </p>
                  </div>
              </div>
           )}

           {mode === "ai" && (
              <div className="flex w-full h-[60vh] items-center justify-center page-enter">
                 <div className="text-center">
                    <Sparkles size={32} strokeWidth={1.5} className="mx-auto mb-4 text-accent-purple" />
                    <h2 className="text-xl font-medium mb-2">AI Charagen</h2>
                    <p className="text-sm text-text-secondary opacity-80 max-w-sm mx-auto">
                      Sử dụng trí tuệ nhân tạo để viết toàn bộ thông tin chỉ từ một câu mô tả ngắn gọn.
                    </p>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* ─── FIXED FOOTER (COPYRIGHT & POLICIES) ─── */}
      <footer className="shrink-0 border-t border-border-default/40 bg-bg-primary/80 backdrop-blur-md px-4 py-2.5 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="text-[10px] text-text-muted">
            © 2026 VietRP. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-text-muted">
            <Link href="/policies/terms" className="hover:text-text-secondary transition-colors">Điều khoản</Link>
            <Link href="/policies/privacy" className="hover:text-text-secondary transition-colors">Chính sách</Link>
            <Link href="/policies/dmca" className="hover:text-text-secondary transition-colors">DMCA</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
