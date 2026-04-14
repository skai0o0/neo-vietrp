"use client";

import type { CharacterBase } from "@/lib/mockCharaData";
import { ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassEffect";

const TRAIT_META: Record<string, { low: string; high: string }> = {
  kindness: { low: "Tàn nhẫn", high: "Hiền lành" },
  aggression: { low: "Ôn hòa", high: "Bạo lực" },
  intelligence: { low: "Đơn giản", high: "Thiên tài" },
  humor: { low: "Nghiêm túc", high: "Hài hước" },
  mystery: { low: "Minh bạch", high: "Khó đoán" },
  romance: { low: "Vô tình", high: "Si tình" },
};

const APPEAR_META: Record<string, { low: string; high: string }> = {
  height: { low: "Nhỏ nhắn", high: "Cao lớn" },
  build: { low: "Mảnh mai", high: "Cơ bắp" },
  charm: { low: "Dễ thương", high: "Quyến rũ" },
  age: { low: "Trẻ trung", high: "Trưởng thành" },
};

interface TraitValues {
  kindness: number; aggression: number; intelligence: number;
  humor: number; mystery: number; romance: number;
}
interface AppearValues {
  height: number; build: number; charm: number; age: number;
}

interface Props {
  character: CharacterBase | null;
  traits: TraitValues;
  appearance: AppearValues;
  nickname: string;
  loreOverride: string;
  onTraitsChange: (t: TraitValues) => void;
  onAppearanceChange: (a: AppearValues) => void;
  onNicknameChange: (n: string) => void;
  onLoreChange: (l: string) => void;
  onNext: () => void;
  onBack: () => void;
  isOC: boolean;
}

function Slider({
  low,
  high,
  value,
  onChange,
}: {
  low: string;
  high: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const stepCount = 7;
  const segments = stepCount - 1; // 6 segments
  const currentStep = Math.round((value / 100) * segments);
  const snapValue = (currentStep / segments) * 100;

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] text-text-muted w-[68px] text-right shrink-0 leading-tight transition-colors group-hover:text-text-secondary">{low}</span>
      <div className="flex-1 relative h-7 flex items-center">
        <div className="w-full h-[3px] rounded-full bg-border-default relative">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${snapValue}%`,
              background: "var(--accent-gradient)",
              opacity: 0.6,
            }}
          />
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-[1px]">
            {Array.from({ length: stepCount }).map((_, i) => (
              <div 
                key={i} 
                className={`w-[3px] h-[3px] rounded-full transition-colors duration-200 ${
                  i <= currentStep ? "bg-bg-primary" : "bg-border-accent/40"
                }`}
              />
            ))}
          </div>
        </div>
        <input
          type="range"
          min={0} max={segments} step={1}
          value={currentStep}
          onChange={(e) => onChange(Math.round((Number(e.target.value) / segments) * 100))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border bg-bg-primary pointer-events-none transition-all duration-200"
          style={{
            left: `calc(${snapValue}% - 6px)`,
            borderColor: "var(--accent-cyan)",
            boxShadow: "0 0 6px rgba(0,255,240,0.25)",
          }}
        />
      </div>
      <span className="text-[10px] text-text-muted w-[68px] shrink-0 leading-tight transition-colors group-hover:text-text-secondary">{high}</span>
    </div>
  );
}

export default function StepPersonality({
  character,
  traits,
  appearance,
  nickname,
  loreOverride,
  onTraitsChange,
  onAppearanceChange,
  onNicknameChange,
  onLoreChange,
  onNext,
  onBack,
  isOC,
}: Props) {
  const updateTrait = (key: string, value: number) =>
    onTraitsChange({ ...traits, [key]: value });
  const updateAppear = (key: string, value: number) =>
    onAppearanceChange({ ...appearance, [key]: value });

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
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Tùy chỉnh nhân vật</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {isOC ? "Thiết lập thuộc tính cho nhân vật mới" : "Kéo thanh trượt hoặc giữ nguyên mặc định"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {/* Nickname */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            {isOC ? "Tên nhân vật" : "Biệt danh (tùy chọn)"}
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder={isOC ? "Nhập tên..." : character?.parodyName || "Giữ tên mặc định"}
            className={inputClass}
          />
        </div>

        {/* Two column layout on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Personality */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary mb-2">Tính cách</p>
            <div className="space-y-1.5 rounded-xl border border-border-default bg-bg-surface p-3">
              {Object.entries(TRAIT_META).map(([key, meta]) => (
                <Slider
                  key={key}
                  low={meta.low}
                  high={meta.high}
                  value={traits[key as keyof TraitValues]}
                  onChange={(v) => updateTrait(key, v)}
                />
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-text-secondary mb-2">Ngoại hình</p>
            <div className="space-y-1.5 rounded-xl border border-border-default bg-bg-surface p-3">
              {Object.entries(APPEAR_META).map(([key, meta]) => (
                <Slider
                  key={key}
                  low={meta.low}
                  high={meta.high}
                  value={appearance[key as keyof AppearValues]}
                  onChange={(v) => updateAppear(key, v)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lore override */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Backstory bổ sung (tùy chọn)
          </label>
          <textarea
            value={loreOverride}
            onChange={(e) => onLoreChange(e.target.value)}
            placeholder="Thêm backstory riêng nếu muốn..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Next */}
      <div className="pt-5 shrink-0 flex gap-3">
        <GlassButton variant="ghost" onClick={onBack} className="px-4">
          Quay lại
        </GlassButton>
        <GlassButton
          onClick={onNext}
          disabled={isOC && !nickname.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-3"
        >
          Tiếp theo
          <ArrowRight size={16} strokeWidth={1.5} />
        </GlassButton>
      </div>
    </div>
  );
}
