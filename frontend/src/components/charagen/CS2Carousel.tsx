"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/* ────────────────────────────────────────────
   CS2 Case-Opening Carousel v4
   - Smooth touch/mouse drag with momentum
   - Scroll wheel navigation
   - Direct spring-to-target (no velocity projection for discrete nav)
   - Separate momentum spring for drag release
   - Infinite loop
   ──────────────────────────────────────────── */

interface CarouselItem {
  id: string;
  content: ReactNode;
}

interface Props {
  items: CarouselItem[];
  activeHeight?: number;
  onCenterChange?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  className?: string;
}

export default function CS2Carousel({
  items,
  activeHeight = 280,
  onCenterChange,
  onSelect,
  selectedId,
  className = "",
}: Props) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  const len = items.length;
  if (len === 0) return null;

  const cardWidth = activeHeight * 0.75;
  const VISIBLE_RANGE = 4;
  const GAP = cardWidth * 0.62 + 8;

  const wrap = (p: number) => ((p % len) + len) % len;
  posRef.current = position;

  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startPos: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    pointerId: -1,
  });

  /* ─── Stop any running animation ─── */
  const stopAnim = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  /* ─── Animate directly to a target index (for discrete nav: click side, scroll, keyboard) ─── */
  const animateToTarget = useCallback(
    (target: number) => {
      stopAnim();
      const start = posRef.current;

      /* If already very close, just snap */
      if (Math.abs(start - target) < 0.01) {
        setPosition(target);
        posRef.current = target;
        const idx = ((target % len) + len) % len;
        onCenterChange?.(items[idx].id);
        return;
      }

      const tick = (pos: number, vel: number) => {
        const stiffness = 0.15;
        const damping = 0.72;
        const force = -(pos - target) * stiffness;
        const nv = (vel + force) * damping;
        const np = pos + nv;

        if (Math.abs(np - target) < 0.003 && Math.abs(nv) < 0.003) {
          setPosition(target);
          posRef.current = target;
          setIsDragging(false);
          const idx = ((target % len) + len) % len;
          onCenterChange?.(items[idx].id);
          return;
        }

        setPosition(np);
        posRef.current = np;
        animRef.current = requestAnimationFrame(() => tick(np, nv));
      };

      animRef.current = requestAnimationFrame(() => tick(start, 0));
    },
    [len, items, onCenterChange, stopAnim]
  );

  /* ─── Momentum spring (for drag release: uses velocity to project + settle) ─── */
  const momentumSpring = useCallback(
    (fromPos: number, vel: number) => {
      stopAnim();
      /* Project target based on velocity */
      const projected = fromPos + vel * 0.25;
      const target = Math.round(projected);

      const tick = (pos: number, v: number) => {
        const stiffness = 0.14;
        const damping = 0.74;
        const force = -(pos - target) * stiffness;
        const nv = (v + force) * damping;
        const np = pos + nv;

        if (Math.abs(np - target) < 0.003 && Math.abs(nv) < 0.003) {
          setPosition(target);
          posRef.current = target;
          setIsDragging(false);
          const idx = ((target % len) + len) % len;
          onCenterChange?.(items[idx].id);
          return;
        }

        setPosition(np);
        posRef.current = np;
        animRef.current = requestAnimationFrame(() => tick(np, nv));
      };

      animRef.current = requestAnimationFrame(() => tick(fromPos, vel));
    },
    [len, items, onCenterChange, stopAnim]
  );

  /* ─── Touch / Mouse drag ─── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      stopAnim();
      const d = drag.current;
      d.active = true;
      d.moved = false;
      d.startX = e.clientX;
      d.startPos = posRef.current;
      d.lastX = e.clientX;
      d.lastTime = Date.now();
      d.velocity = 0;
      d.pointerId = e.pointerId;
    };

    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || d.pointerId !== e.pointerId) return;

      const totalDx = e.clientX - d.startX;

      if (!d.moved && Math.abs(totalDx) > 5) {
        d.moved = true;
        setIsDragging(true);
      }
      if (!d.moved) return;

      e.preventDefault();

      const now = Date.now();
      const dt = Math.max(now - d.lastTime, 1);
      const dx = e.clientX - d.lastX;

      d.velocity = -(dx / GAP) / (dt / 1000) * 0.012;
      d.lastX = e.clientX;
      d.lastTime = now;

      const newPos = d.startPos - totalDx / GAP;
      setPosition(newPos);
      posRef.current = newPos;
    };

    const onUp = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || d.pointerId !== e.pointerId) return;
      d.active = false;

      if (d.moved) {
        momentumSpring(posRef.current, d.velocity);
      } else {
        setIsDragging(false);
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [stopAnim, momentumSpring, GAP]);

  /* ─── Scroll wheel → direct target animation ─── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accum = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      accum += e.deltaY + e.deltaX;
      if (Math.abs(accum) >= 50) {
        const dir = accum > 0 ? 1 : -1;
        accum = 0;
        const current = Math.round(posRef.current);
        animateToTarget(current + dir);
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { accum = 0; }, 200);
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [animateToTarget]);

  /* ─── Keyboard → direct target animation ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const current = Math.round(posRef.current);
        animateToTarget(current + dir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [animateToTarget]);

  useEffect(() => () => stopAnim(), [stopAnim]);

  /* ─── Click handler ─── */
  const handleCardClick = useCallback(
    (offset: number, id: string) => {
      if (drag.current.moved) return;
      if (Math.abs(offset) < 0.4) {
        onSelect?.(id);
      } else {
        /* Click on side card → animate directly to that card */
        const steps = Math.round(offset);
        const current = Math.round(posRef.current);
        animateToTarget(current + steps);
      }
    },
    [onSelect, animateToTarget]
  );

  /* ─── Rendering ─── */
  const getVisibleCards = () => {
    const result: { item: CarouselItem; offset: number }[] = [];
    const wrapped = wrap(position);
    const base = Math.round(wrapped);

    for (let off = -VISIBLE_RANGE; off <= VISIBLE_RANGE; off++) {
      const realIdx = ((base + off) % len + len) % len;
      const fractionalOffset = off - (wrapped - base);
      result.push({ item: items[realIdx], offset: fractionalOffset });
    }
    return result;
  };

  const getCardStyle = (offset: number): React.CSSProperties => {
    const absOff = Math.abs(offset);
    const scale = Math.max(0.45, 1 - absOff * 0.14);
    const blur = absOff < 0.15 ? 0 : Math.min(absOff * 2.8, 8);
    const opacity = Math.max(0.25, 1 - absOff * 0.22);
    const translateX = offset * GAP;
    const zIndex = 100 - Math.round(absOff * 10);

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      opacity,
      zIndex,
      transition: isDragging ? "filter 0.08s ease" : "all 0.04s linear",
      willChange: "transform, filter, opacity",
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ height: activeHeight + 40, touchAction: "pan-y" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {getVisibleCards().map(({ item, offset }) => {
          const isCenter = Math.abs(offset) < 0.3 && !isDragging;
          const isSelected = selectedId === item.id;

          return (
            <div
              key={`${item.id}-${Math.round(offset * 100)}`}
              className="absolute"
              style={{
                width: cardWidth,
                height: activeHeight,
                cursor: isDragging ? "grabbing" : "pointer",
                ...getCardStyle(offset),
              }}
              onClick={() => handleCardClick(offset, item.id)}
            >
              <div
                className={`
                  w-full h-full rounded-xl overflow-hidden
                  border-2 transition-[border-color,box-shadow] duration-300
                  ${isSelected
                    ? "border-accent-cyan shadow-[0_0_24px_rgba(0,255,240,0.3)] neon-pulse"
                    : isCenter
                      ? "border-white/10"
                      : "border-transparent"
                  }
                `}
              >
                {item.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edge fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent z-[200]" />
      <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none bg-gradient-to-l from-bg-primary via-bg-primary/60 to-transparent z-[200]" />
    </div>
  );
}
