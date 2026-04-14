"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  Copy,
  Pencil,
  Trash2,
  GitBranch,
  RotateCcw,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { GlassButton } from "@/components/ui/GlassEffect";
import ChatDrawer from "@/components/ui/ChatDrawer";

function ChatTopBar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default bg-bg-secondary">
      <Link
        href="/chat"
        className="
          p-1.5 rounded-lg text-text-secondary
          hover:text-text-primary hover:bg-bg-surface
          transition-all duration-200 active:scale-90
        "
        aria-label="Quay lại danh sách chat"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
      </Link>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full skeleton shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">Nhân vật</span>
            <Badge variant="accent">PRO</Badge>
          </div>
          <p className="text-xs text-text-muted truncate">Mô tả ngắn về nhân vật...</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          className="
            p-2 rounded-lg text-text-muted
            hover:text-text-primary hover:bg-bg-surface
            transition-all duration-200 active:scale-90
          "
          aria-label="Tạo chat mới"
        >
          <Plus size={16} strokeWidth={1.5} />
        </button>
        <button
          className="
            p-2 rounded-lg text-text-muted
            hover:text-text-primary hover:bg-bg-surface
            transition-all duration-200 active:scale-90
          "
          aria-label="Tìm tin nhắn"
        >
          <Search size={16} strokeWidth={1.5} />
        </button>
        <button
          onClick={onOpenDrawer}
          className="
            p-2 rounded-lg text-text-muted
            hover:text-text-primary hover:bg-bg-surface
            transition-all duration-200 active:scale-90
          "
          aria-label="Tùy chỉnh chat"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function MessageSkeleton({
  role,
  lineWidths,
}: {
  role: "user" | "assistant";
  lineWidths: string[];
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`
          max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          transition-all duration-200
          ${
            isUser
              ? "bg-accent-cyan/10 border border-accent-cyan/20"
              : "bg-bg-surface border border-border-default"
          }
        `}
      >
        {lineWidths.map((w, i) => (
          <div key={i} className={`h-3 ${w} skeleton ${i > 0 ? "mt-2" : ""}`} />
        ))}

        <div
          className="
            flex items-center gap-1 mt-3
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          "
        >
          {[
            { icon: Copy, label: "Sao chép" },
            ...(isUser
              ? [{ icon: Pencil, label: "Chỉnh sửa" }]
              : [{ icon: RotateCcw, label: "Tạo lại" }]),
            { icon: Trash2, label: "Xóa" },
            { icon: GitBranch, label: "Nhánh" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className="
                p-1.5 rounded-md text-text-muted
                hover:text-text-primary hover:bg-bg-elevated
                transition-all duration-200 active:scale-90
              "
            >
              <Icon size={13} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const MESSAGE_PATTERNS: { role: "user" | "assistant"; lines: string[] }[] = [
  { role: "assistant", lines: ["w-full", "w-5/6", "w-4/5", "w-2/3"] },
  { role: "user", lines: ["w-3/4", "w-1/2"] },
  { role: "assistant", lines: ["w-full", "w-full", "w-5/6", "w-3/4", "w-1/3"] },
  { role: "user", lines: ["w-2/3"] },
  { role: "assistant", lines: ["w-full", "w-4/5", "w-2/3"] },
  { role: "user", lines: ["w-full", "w-3/5"] },
  { role: "assistant", lines: ["w-full", "w-5/6", "w-full", "w-1/2"] },
];

function ChatInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="px-4 py-3 border-t border-border-default bg-bg-secondary">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="
              w-full px-4 py-2.5 rounded-xl text-sm resize-none
              bg-input-bg border border-input-border text-text-primary
              placeholder:text-text-muted
              focus:outline-none focus:border-input-focus
              focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
              transition-all duration-300
              max-h-32
            "
            style={{ minHeight: "42px" }}
          />
        </div>
        <GlassButton
          className="!px-2.5 !py-2.5"
          disabled={!message.trim()}
          aria-label="Gửi tin nhắn"
        >
          <SendHorizontal size={18} strokeWidth={1.5} />
        </GlassButton>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen lg:h-screen">
      <ChatTopBar onOpenDrawer={() => setDrawerOpen(true)} />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4 stagger-in">
          {MESSAGE_PATTERNS.map((msg, i) => (
            <MessageSkeleton key={i} role={msg.role} lineWidths={msg.lines} />
          ))}
        </div>
      </div>

      <ChatInput />

      <ChatDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
