"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Moon,
  BookOpen,
  Shield,
  CreditCard,
  Wifi,
  WifiOff,
  EyeOff,
  ChevronRight,
  LayoutDashboard,
  FileCode,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type OnlineStatus = "online" | "offline" | "invisible";

const STATUS_CYCLE: OnlineStatus[] = ["online", "offline", "invisible"];
const STATUS_CONFIG: Record<OnlineStatus, { label: string; icon: typeof Wifi; color: string }> = {
  online:    { label: "Online",    icon: Wifi,    color: "text-green-400" },
  offline:   { label: "Offline",   icon: WifiOff, color: "text-text-muted" },
  invisible: { label: "Invisible", icon: EyeOff,  color: "text-yellow-400" },
};

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      className={`
        relative w-9 h-5 rounded-full
        transition-colors duration-300 ease-out
        ${enabled ? "bg-accent-cyan/30" : "bg-bg-elevated"}
        border ${enabled ? "border-accent-cyan/50" : "border-border-default"}
      `}
    >
      <span
        className={`
          absolute top-0.5 w-4 h-4 rounded-full
          transition-all duration-300 ease-out
          ${
            enabled
              ? "left-[18px] bg-accent-cyan shadow-[0_0_6px_rgba(0,255,240,0.4)]"
              : "left-0.5 bg-text-muted"
          }
        `}
      />
    </button>
  );
}

export default function SettingsPopup({
  open,
  onClose,
  anchorRef,
  anchorRefMobile,
  onCopyMarkdown,
}: {
  open: boolean;
  onClose: () => void;
  /** Nút Cài đặt trên sidebar (desktop) */
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
  /** Nút Cài đặt trên thanh dưới (mobile) — bắt buộc để popup khớp vị trí nút */
  anchorRefMobile?: React.RefObject<HTMLButtonElement | null>;
  /** Xuất trang sang Markdown (clipboard) — dùng trên giao diện dọc */
  onCopyMarkdown?: () => void | Promise<void>;
}) {
  const { theme, toggleTheme } = useTheme();
  const [nsfw, setNsfw] = useState(false);
  const [status, setStatus] = useState<OnlineStatus>("online");
  const [desktopTop, setDesktopTop] = useState<string | undefined>(undefined);
  const [mobileLeftPx, setMobileLeftPx] = useState<number | undefined>(undefined);
  const popupRef = useRef<HTMLDivElement>(null);

  const cycleStatus = useCallback(() => {
    setStatus((prev) => {
      const idx = STATUS_CYCLE.indexOf(prev);
      return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      const inPopup = popupRef.current?.contains(t);
      const inAnchorDesktop = anchorRef?.current?.contains(t);
      const inAnchorMobile = anchorRefMobile?.current?.contains(t);
      if (!inPopup && !inAnchorDesktop && !inAnchorMobile) onClose();
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open, onClose, anchorRef, anchorRefMobile]);

  useLayoutEffect(() => {
    if (!open) {
      setDesktopTop(undefined);
      setMobileLeftPx(undefined);
      return;
    }
    const update = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w >= 1024) {
        setMobileLeftPx(undefined);
        const el = anchorRef?.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setDesktopTop(`${Math.max(8, rect.bottom - 200)}px`);
        } else setDesktopTop(undefined);
        return;
      }
      setDesktopTop(undefined);
      const el = anchorRefMobile?.current ?? anchorRef?.current;
      if (!el) {
        setMobileLeftPx(undefined);
        return;
      }
      const rect = el.getBoundingClientRect();
      let centerX = rect.left + rect.width / 2;
      const panelW =
        popupRef.current?.offsetWidth ??
        Math.min(17.5 * 16, w - 24);
      const half = panelW / 2;
      const pad = 8;
      centerX = Math.min(w - pad - half, Math.max(pad + half, centerX));
      setMobileLeftPx(centerX);
    };
    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef, anchorRefMobile]);

  if (!open) return null;

  const StatusIcon = STATUS_CONFIG[status].icon;

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="
          fixed inset-0 z-[60] vp-overlay-fade-in
          max-lg:bg-black/20 max-lg:backdrop-blur-[2px]
          lg:bg-transparent
        "
        onClick={onClose}
      />

      <div
        ref={popupRef}
        className="
          fixed z-[70] vp-settings-shell

          max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:right-auto
          max-lg:bottom-[calc(3.5rem+0.5rem)]
          max-lg:w-[min(17.5rem,calc(100vw-1.5rem))]
          max-lg:max-h-[min(52vh,20rem)] max-lg:overflow-y-auto
          max-lg:rounded-xl max-lg:shadow-[0_8px_32px_rgba(0,0,0,0.35)]

          lg:bottom-auto lg:left-[72px] lg:w-64 lg:max-h-none lg:overflow-hidden
          lg:translate-x-0 lg:rounded-xl
          lg:shadow-[0_0_24px_rgba(0,0,0,0.5)]

          border border-border-default bg-bg-secondary
        "
        style={{
          ...(desktopTop != null ? { top: desktopTop } : {}),
          ...(mobileLeftPx != null ? { left: mobileLeftPx } : {}),
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 max-lg:px-2.5 max-lg:py-2 border-b border-border-default">
          <span className="text-sm font-semibold max-lg:text-xs">Cài đặt</span>
          <button
            onClick={onClose}
            className="
              p-1 rounded-lg text-text-muted vp-icon-hit
              hover:text-text-primary hover:bg-bg-surface
            "
            aria-label="Đóng"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-2 space-y-0.5 max-lg:p-1.5 max-lg:space-y-0">
          {/* Chỉ mobile: Admin + Markdown (sidebar đã có trên lg) */}
          <div className="lg:hidden space-y-0.5 pb-1 max-lg:pb-0.5">
            <Link
              href="/admin"
              onClick={onClose}
              className="
                w-full flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg
                vp-menu-row vp-chevron-row text-left
              "
            >
              <div className="flex items-center gap-2 max-lg:gap-1.5">
                <LayoutDashboard size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
                <span className="text-sm max-lg:text-xs">Admin Hub</span>
              </div>
              <ChevronRight
                size={14}
                strokeWidth={1.5}
                className="text-text-muted vp-chevron"
              />
            </Link>
            <button
              type="button"
              onClick={() => void onCopyMarkdown?.()}
              className="
                w-full flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg
                vp-menu-row text-left
              "
            >
              <div className="flex items-center gap-2 max-lg:gap-1.5">
                <FileCode size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
                <span className="text-sm max-lg:text-xs">Markdown cho AI</span>
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider max-lg:text-[9px]">
                Sao chép
              </span>
            </button>
            <div className="h-px bg-border-default mx-2 my-1 max-lg:my-0.5" />
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg vp-menu-row">
            <div className="flex items-center gap-2 max-lg:gap-1.5">
              {theme === "oled" ? (
                <Moon size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
              ) : (
                <BookOpen size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
              )}
              <span className="text-sm max-lg:text-xs">
                {theme === "oled" ? "OLED Black" : "E-ink"}
              </span>
            </div>
            <Toggle enabled={theme === "eink"} onToggle={toggleTheme} />
          </div>

          {/* NSFW toggle */}
          <div className="flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg vp-menu-row">
            <div className="flex items-center gap-2 max-lg:gap-1.5">
              <Shield size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
              <span className="text-sm max-lg:text-xs">{nsfw ? "NSFW" : "SFW"}</span>
            </div>
            <Toggle enabled={nsfw} onToggle={() => setNsfw((p) => !p)} />
          </div>

          {/* Divider */}
          <div className="h-px bg-border-default mx-2 my-1 max-lg:my-0.5" />

          {/* Online status — cycle on click */}
          <button
            onClick={cycleStatus}
            className="
              w-full flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg
              vp-menu-row text-left
            "
          >
            <div className="flex items-center gap-2 max-lg:gap-1.5">
              <StatusIcon
                size={16}
                strokeWidth={1.5}
                className={`${STATUS_CONFIG[status].color} max-lg:size-[14px]`}
              />
              <span className="text-sm max-lg:text-xs">{STATUS_CONFIG[status].label}</span>
            </div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider max-lg:text-[9px]">
              Nhấn để đổi
            </span>
          </button>

          {/* Divider */}
          <div className="h-px bg-border-default mx-2 my-1 max-lg:my-0.5" />

          {/* Subscriptions — link */}
          <a
            href="/subscriptions"
            className="
              w-full flex items-center justify-between px-2.5 py-2 max-lg:px-2 max-lg:py-1.5 rounded-lg
              vp-menu-row vp-chevron-row
            "
          >
            <div className="flex items-center gap-2 max-lg:gap-1.5">
              <CreditCard size={16} strokeWidth={1.5} className="text-text-secondary max-lg:size-[14px]" />
              <span className="text-sm max-lg:text-xs">Gói đăng ký</span>
            </div>
            <ChevronRight
              size={14}
              strokeWidth={1.5}
              className="text-text-muted vp-chevron"
            />
          </a>
        </div>
      </div>
    </>
  );
}
