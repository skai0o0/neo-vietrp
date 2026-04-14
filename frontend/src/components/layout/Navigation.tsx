"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Sparkles,
  Settings,
  User,
  LayoutDashboard,
  FileCode,
} from "lucide-react";
import SettingsPopup from "@/components/ui/SettingsPopup";
import { mainContentToMarkdown } from "@/lib/pageToMarkdown";

const MAIN_ITEMS = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/create", label: "Tạo mới", icon: Sparkles },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  accent,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  active: boolean;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`
        group relative flex items-center justify-center
        rounded-xl p-2.5
        transition-all duration-300 ease-out
        active:scale-90
        ${
          active
            ? "text-nav-active bg-nav-active/10"
            : accent
              ? "text-text-secondary hover:text-nav-active hover:bg-nav-active/5"
              : "text-nav-inactive hover:text-nav-active hover:bg-nav-active/5"
        }
      `}
    >
      <Icon
        size={22}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      {active && (
        <span
          className="
            absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-nav-active
            max-lg:hidden
          "
          style={{ boxShadow: "var(--neon-glow-blue)" }}
        />
      )}
      {active && (
        <span
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-t-full bg-nav-active
            lg:hidden
          "
          style={{ boxShadow: "var(--neon-glow-blue)" }}
        />
      )}
    </Link>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
  buttonRef,
  title,
  accent,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  active: boolean;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  title?: string;
  accent?: boolean;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      className={`
        group relative flex items-center justify-center
        rounded-xl p-2.5
        transition-all duration-300 ease-out
        active:scale-90
        ${
          active
            ? "text-nav-active bg-nav-active/10"
            : accent
              ? "text-text-secondary hover:text-nav-active hover:bg-nav-active/5"
              : "text-nav-inactive hover:text-nav-active hover:bg-nav-active/5"
        }
      `}
    >
      <Icon
        size={22}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      {active && (
        <span
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-t-full bg-nav-active
            lg:hidden
          "
          style={{ boxShadow: "var(--neon-glow-blue)" }}
        />
      )}
    </button>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const settingsBtnMobileRef = useRef<HTMLButtonElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }, []);

  const copyPageAsMarkdown = useCallback(async () => {
    const md = mainContentToMarkdown();
    if (!md) {
      showToast("Không tìm thấy nội dung để xuất.");
      return;
    }
    try {
      await navigator.clipboard.writeText(md);
      showToast("Đã sao chép Markdown vào clipboard — dán vào AI.");
    } catch {
      showToast("Không thể sao chép (quyền trình duyệt).");
    }
  }, [showToast]);

  return (
    <>
      {/* Sidebar — landscape / desktop */}
      <nav
        className="
          hidden lg:flex flex-col items-center
          w-16 h-screen fixed left-0 top-0 z-50
          bg-nav-bg border-r border-nav-border
          py-6
        "
      >
        <Link href="/" className="mb-6 flex items-center justify-center">
          <span className="text-lg font-bold neon-text-blue tracking-tighter">
            V
          </span>
        </Link>

        <div className="flex flex-col gap-1">
          {MAIN_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-1">
          <NavLink
            href="/admin"
            label="Admin Hub"
            icon={LayoutDashboard}
            active={isActive("/admin")}
            accent
          />
          <NavButton
            label="Markdown cho AI"
            title="Xuất nội dung trang hiện tại sang Markdown và sao chép (cho AI)"
            icon={FileCode}
            active={false}
            onClick={copyPageAsMarkdown}
            accent
          />
        </div>

        <div className="w-7 h-px bg-border-default my-2" />

        <div className="flex flex-col gap-1">
          <NavButton
            label="Cài đặt"
            icon={Settings}
            active={settingsOpen}
            onClick={() => setSettingsOpen((p) => !p)}
            buttonRef={settingsBtnRef}
          />
          <NavLink href="/profile" label="Hồ sơ" icon={User} active={isActive("/profile")} />
        </div>
      </nav>

      <nav
        className="
          flex lg:hidden items-center justify-around
          h-14 w-full fixed bottom-0 left-0 z-50
          bg-nav-bg/95 backdrop-blur-md
          border-t border-nav-border
          px-2
        "
      >
        {MAIN_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
        <NavButton
          label="Cài đặt"
          icon={Settings}
          active={settingsOpen}
          onClick={() => setSettingsOpen((p) => !p)}
          buttonRef={settingsBtnMobileRef}
        />
        <NavLink href="/profile" label="Hồ sơ" icon={User} active={isActive("/profile")} />
      </nav>

      <SettingsPopup
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        anchorRef={settingsBtnRef}
        anchorRefMobile={settingsBtnMobileRef}
        onCopyMarkdown={copyPageAsMarkdown}
      />

      {toast && (
        <div
          className="
            fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[80]
            max-w-[min(90vw,20rem)] px-4 py-2.5 rounded-xl text-xs text-center
            border border-border-accent/40 bg-bg-secondary shadow-[0_0_16px_rgba(0,255,240,0.12)]
            vp-toast-in
          "
          role="status"
        >
          {toast}
        </div>
      )}
    </>
  );
}
