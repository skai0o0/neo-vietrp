"use client";

import { useEffect, useRef } from "react";
import {
  X,
  MessageSquareText,
  Clapperboard,
  MessageCircle,
  Cpu,
  Ruler,
  ChevronRight,
} from "lucide-react";

const REPLY_STYLES = ["Tường thuật", "Đối thoại", "Ngắn gọn", "Chi tiết", "Hài hước"];

const AI_MODELS = [
  { name: "GPT-4o", tag: "Nhanh" },
  { name: "Claude 3.5", tag: "Sáng tạo" },
  { name: "Gemini Pro", tag: "Đa ngôn ngữ" },
];

const MAX_LENGTHS = [256, 512, 1024, 2048, 4096];

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[60] bg-black/50 vp-drawer-backdrop
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed z-[70] top-0 right-0 h-full
          w-80 max-w-[85vw]
          bg-bg-secondary border-l border-border-default
          flex flex-col vp-drawer-panel
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-semibold">Tùy chỉnh Chat</span>
          <button
            onClick={onClose}
            className="
              p-1.5 rounded-lg text-text-muted vp-icon-hit
              hover:text-text-primary hover:bg-bg-surface
            "
            aria-label="Đóng"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Reply style */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareText size={14} strokeWidth={1.5} className="text-text-secondary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Phong cách trả lời
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REPLY_STYLES.map((style, i) => (
                <button
                  key={style}
                  type="button"
                  data-active={i === 0 ? "true" : "false"}
                  className={`
                    vp-chip px-3 py-1.5 rounded-lg text-xs font-medium border
                    ${
                      i === 0
                        ? "border-border-accent bg-badge-bg text-badge-text"
                        : "border-border-default text-text-muted hover:border-border-accent/50 hover:text-text-secondary"
                    }
                  `}
                >
                  {style}
                </button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border-default" />

          {/* Scenario */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clapperboard size={14} strokeWidth={1.5} className="text-text-secondary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tình huống
              </span>
            </div>
            <textarea
              placeholder="Mô tả tình huống bạn muốn roleplay..."
              rows={3}
              className="
                w-full px-3 py-2.5 rounded-xl text-sm resize-none vp-input-motion
                bg-input-bg border border-input-border text-text-primary
                placeholder:text-text-muted
                focus:outline-none focus:border-input-focus
                focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
              "
            />
          </section>

          <div className="h-px bg-border-default" />

          {/* First message */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={14} strokeWidth={1.5} className="text-text-secondary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tin nhắn đầu
              </span>
            </div>
            <textarea
              placeholder="Tùy chỉnh tin nhắn đầu tiên của nhân vật..."
              rows={3}
              className="
                w-full px-3 py-2.5 rounded-xl text-sm resize-none vp-input-motion
                bg-input-bg border border-input-border text-text-primary
                placeholder:text-text-muted
                focus:outline-none focus:border-input-focus
                focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
              "
            />
          </section>

          <div className="h-px bg-border-default" />

          {/* AI Model */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={14} strokeWidth={1.5} className="text-text-secondary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Mô hình AI
              </span>
            </div>
            <div className="space-y-1.5">
              {AI_MODELS.map((model, i) => (
                <button
                  key={model.name}
                  type="button"
                  className={`
                    vp-menu-row w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left border
                    ${
                      i === 0
                        ? "border-border-accent bg-badge-bg"
                        : "border-border-default bg-bg-surface hover:border-border-accent/50 hover:bg-bg-elevated"
                    }
                  `}
                >
                  <span className="text-sm font-medium">{model.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted border border-border-default">
                    {model.tag}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border-default" />

          {/* Max length */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ruler size={14} strokeWidth={1.5} className="text-text-secondary" />
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Độ dài phản hồi
                </span>
              </div>
              <span className="text-xs text-accent-cyan font-mono">512</span>
            </div>
            <div className="flex gap-1.5">
              {MAX_LENGTHS.map((len, i) => (
                <button
                  key={len}
                  type="button"
                  data-active={i === 1 ? "true" : "false"}
                  className={`
                    vp-chip flex-1 py-1.5 rounded-lg text-xs font-mono text-center border
                    ${
                      i === 1
                        ? "border-border-accent bg-badge-bg text-badge-text"
                        : "border-border-default text-text-muted hover:border-border-accent/50"
                    }
                  `}
                >
                  {len >= 1024 ? `${len / 1024}k` : len}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border-default">
          <button
            type="button"
            className="
              vp-menu-row w-full flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl text-sm font-medium
              border border-border-default text-text-secondary
              hover:border-border-accent hover:text-text-primary
            "
          >
            Đặt lại mặc định
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </>
  );
}
