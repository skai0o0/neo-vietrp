"use client";

import { Bell, TrendingUp, Heart, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { GlassBanner, GlassButton } from "@/components/ui/GlassEffect";

function HeroBanner() {
  return (
    <GlassBanner>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
        <span className="neon-text-blue">Viet</span>
        <span className="neon-text-pink">RP</span>
      </h1>
      <p className="text-text-secondary text-sm sm:text-base max-w-md">
        Khám phá thế giới roleplay AI bằng tiếng Việt.
        Trò chuyện, sáng tạo nhân vật, và hòa mình vào những câu chuyện bất tận.
      </p>
      <div className="mt-6 flex gap-3">
        <GlassButton>Bắt đầu Chat</GlassButton>
        <GlassButton variant="ghost">Khám phá</GlassButton>
      </div>
    </GlassBanner>
  );
}

function NotificationBar() {
  return (
    <div
      className="
        flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface
        px-4 py-2.5 text-sm
        transition-all duration-300
        hover:border-border-accent/40 hover:bg-bg-elevated
        cursor-pointer
      "
    >
      <Bell size={16} strokeWidth={1.5} className="text-accent-cyan shrink-0" />
      <p className="text-text-secondary truncate">
        Chào mừng đến VietRP! Khám phá các nhân vật mới được cộng đồng tạo.
      </p>
      <ChevronRight size={14} strokeWidth={1.5} className="text-text-muted ml-auto shrink-0" />
    </div>
  );
}

const LEADERBOARD_TABS = [
  { label: "Xu hướng", icon: TrendingUp },
  { label: "Yêu thích", icon: Heart },
  { label: "Mọi thời đại", icon: Clock },
] as const;

const DUMMY_NAMES = [
  "Akira", "Miyuki", "Sakura", "Hana", "Yuki", "Ren", "Sora", "Kai",
  "Mei", "Aoi", "Riku", "Luna", "Nova", "Zephyr", "Eclipse",
  "Crimson", "Azure", "Jade", "Phoenix", "Storm",
  "Blaze", "Shadow", "Crystal", "Frost", "Ember",
];

function LeaderboardCard({ index }: { index: number }) {
  const isTop3 = index < 3;
  const neon = index === 0 ? "blue" as const : index === 1 ? "pink" as const : "none" as const;

  return (
    <Card
      hoverable
      neon={neon}
      className="shrink-0 w-[220px] sm:w-[240px] p-3"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-lg skeleton" />
          {isTop3 && (
            <div
              className="
                absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                flex items-center justify-center text-[10px] font-bold
                bg-bg-primary border border-border-accent text-accent-cyan
              "
            >
              {index + 1}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">{DUMMY_NAMES[index]}</span>
            {isTop3 && <Badge variant="accent">#{index + 1}</Badge>}
          </div>
          <div className="h-3 w-full skeleton mt-1.5" />
          <div className="h-3 w-2/3 skeleton mt-1" />
          <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
            <span className="flex items-center gap-0.5">
              <Heart size={10} strokeWidth={1.5} />
              <span className="skeleton w-6 h-3 inline-block" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LeaderboardSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bảng xếp hạng</h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {LEADERBOARD_TABS.map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200
                  ${i === 0
                    ? "bg-badge-bg text-badge-text border border-badge-border"
                    : "text-text-muted hover:text-text-secondary hover:bg-bg-surface"
                  }
                `}
              >
                <Icon size={13} strokeWidth={1.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <div className="hidden sm:flex gap-1 ml-2">
            <button
              onClick={() => scroll("left")}
              className="
                p-1.5 rounded-lg border border-border-default text-text-muted
                hover:text-text-primary hover:border-border-accent
                transition-all duration-200 active:scale-90
              "
              aria-label="Cuộn trái"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="
                p-1.5 rounded-lg border border-border-default text-text-muted
                hover:text-text-primary hover:border-border-accent
                transition-all duration-200 active:scale-90
              "
              aria-label="Cuộn phải"
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="relative -mx-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-bg-primary to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-bg-primary to-transparent" />

        <div
          ref={scrollRef}
          className="scroll-x-hide flex gap-3 px-4 py-1"
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <LeaderboardCard key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardListSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tất cả nhân vật</h2>
        <button className="text-xs text-text-muted hover:text-accent-cyan transition-colors duration-200">
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 stagger-in">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} hoverable className="flex flex-col items-center text-center p-3">
            <div className="w-14 h-14 rounded-full skeleton mb-2.5" />
            <div className="h-4 w-16 skeleton mb-1" />
            <div className="h-3 w-full skeleton" />
            <div className="h-3 w-3/4 skeleton mt-1" />
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold lg:hidden">
            <span className="neon-text-blue">Viet</span>
            <span className="neon-text-pink">RP</span>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <HeroBanner />
      <NotificationBar />
      <LeaderboardSection />
      <CardListSection />
    </div>
  );
}
