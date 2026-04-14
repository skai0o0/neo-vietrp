"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";

function ChatListSkeleton({ index }: { index: number }) {
  const widths = ["w-24", "w-32", "w-28", "w-20", "w-36", "w-30", "w-26", "w-22"];
  const msgWidths = ["w-3/4", "w-2/3", "w-4/5", "w-1/2", "w-3/5"];

  return (
    <Link
      href={`/chat/chat-${index + 1}`}
      className="
        flex items-center gap-3 p-3 rounded-xl
        border border-border-default bg-bg-surface
        hover:border-border-accent hover:bg-bg-elevated
        hover:-translate-y-0.5
        hover:shadow-[0_0_12px_rgba(0,255,240,0.06)]
        active:translate-y-0 active:scale-[0.99]
        transition-all duration-300 ease-out
      "
    >
      <div className="w-10 h-10 rounded-full skeleton shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className={`h-4 ${widths[index % widths.length]} skeleton`} />
          <span className="text-xs text-text-muted">{index + 1}h trước</span>
        </div>
        <div className={`h-3 ${msgWidths[index % msgWidths.length]} skeleton mt-1.5`} />
      </div>
    </Link>
  );
}

export default function ChatListPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 h-full flex flex-col page-enter">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Đoạn chat</h1>
        <button
          className="
            p-2 rounded-lg border border-border-default
            text-text-secondary hover:text-accent-cyan hover:border-border-accent
            hover:shadow-[0_0_10px_rgba(0,255,240,0.08)]
            transition-all duration-300 active:scale-90
          "
          aria-label="Tạo đoạn chat mới"
        >
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </header>

      <div className="relative mb-4">
        <Search
          size={16}
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-200"
        />
        <input
          type="text"
          placeholder="Tìm đoạn chat..."
          className="
            w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
            bg-input-bg border border-input-border text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:border-input-focus
            focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
            transition-all duration-300
          "
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 stagger-in">
        {Array.from({ length: 12 }).map((_, i) => (
          <ChatListSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
