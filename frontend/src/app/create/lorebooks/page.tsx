"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { GlassButton } from "@/components/ui/GlassEffect";

interface LoreEntry {
  id: number;
  expanded: boolean;
}

const inputClass = `
  w-full px-4 py-2.5 rounded-xl text-sm vp-input-motion
  bg-input-bg border border-input-border text-text-primary
  placeholder:text-text-muted
  focus:outline-none focus:border-input-focus
  focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
`;

function LoreEntryCard({
  index,
  expanded,
  onToggle,
  onRemove,
}: {
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono w-6">#{index + 1}</span>
          <span className="text-sm font-medium">Entry chưa đặt tên</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="
              p-1.5 rounded-md text-text-muted
              hover:text-red-400 hover:bg-red-400/10
              transition-all duration-200 active:scale-90
            "
            aria-label="Xóa entry"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
          {expanded ? (
            <ChevronUp size={14} strokeWidth={1.5} className="text-text-muted" />
          ) : (
            <ChevronDown size={14} strokeWidth={1.5} className="text-text-muted" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-border-default page-enter">
          <div>
            <label className="text-xs font-medium mb-1.5 block text-text-secondary">Keywords</label>
            <input
              type="text"
              placeholder="keyword1, keyword2, ..."
              className={inputClass}
            />
            <p className="text-[10px] text-text-muted mt-1">Phân cách bằng dấu phẩy. Khi từ khóa xuất hiện trong chat, entry sẽ được kích hoạt.</p>
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block text-text-secondary">Nội dung</label>
            <textarea
              placeholder="Nội dung kiến thức / thế giới quan..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-text-secondary">Insertion Order</label>
              <input type="number" defaultValue={100} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-text-secondary">Priority</label>
              <input type="number" defaultValue={10} className={inputClass} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function CreateLorebookPage() {
  const [entries, setEntries] = useState<LoreEntry[]>([
    { id: 1, expanded: true },
    { id: 2, expanded: false },
  ]);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: Date.now(), expanded: true },
    ]);
  };

  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEntry = (id: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, expanded: !e.expanded } : e))
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header className="flex items-center gap-3">
        <Link
          href="/create"
          className="
            p-1.5 rounded-lg text-text-secondary
            hover:text-text-primary hover:bg-bg-surface
            transition-all duration-200 active:scale-90
          "
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Tạo Lorebook</h1>
          <p className="text-xs text-text-muted">Xây dựng thế giới quan & kiến thức</p>
        </div>
      </header>

      {/* Lorebook meta */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Tên Lorebook</label>
          <input type="text" placeholder="Ví dụ: Thế giới Tây Du Ký..." className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Mô tả</label>
          <textarea
            placeholder="Mô tả ngắn về lorebook..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Entries */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={14} strokeWidth={1.5} className="text-text-secondary" />
            <span className="text-sm font-medium">Entries ({entries.length})</span>
          </div>
          <button
            onClick={addEntry}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-border-default text-text-secondary
              hover:border-border-accent hover:text-accent-cyan
              transition-all duration-200 active:scale-95
            "
          >
            <Plus size={13} strokeWidth={1.5} />
            Thêm entry
          </button>
        </div>

        <div className="space-y-2">
          {entries.map((entry, i) => (
            <LoreEntryCard
              key={entry.id}
              index={i}
              expanded={entry.expanded}
              onToggle={() => toggleEntry(entry.id)}
              onRemove={() => removeEntry(entry.id)}
            />
          ))}
        </div>
      </section>

      <div className="flex gap-3 pt-2">
        <GlassButton className="flex-1">Lưu Lorebook</GlassButton>
        <GlassButton variant="ghost">Hủy</GlassButton>
      </div>
    </div>
  );
}
