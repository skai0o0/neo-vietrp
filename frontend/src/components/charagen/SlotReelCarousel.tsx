"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ReactNode,
} from "react";

export interface SlotReelRef {
  spinTo: (targetPos: number) => void;
  getPosition: () => number;
}

interface CarouselItem {
  id: string;
  content: ReactNode;
}

interface Props {
  items: CarouselItem[];
  activeHeight?: number;
  itemHeight?: number;
  onCenterChange?: (id: string, index: number) => void;
  className?: string;
  spinning?: boolean;
}

const SlotReelCarousel = forwardRef<SlotReelRef, Props>(({
  items,
  activeHeight = 150,
  itemHeight = 40,
  onCenterChange,
  className = "",
  spinning = false,
}, ref) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  const len = items.length;
  if (len === 0) return null;

  const VISIBLE_RANGE = 4;
  const GAP = itemHeight;

  const wrap = (p: number) => ((p % len) + len) % len;
  posRef.current = position;

  const drag = useRef({
    active: false,
    moved: false,
    startY: 0,
    startPos: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    pointerId: -1,
  });

  const stopAnim = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const animateToTarget = useCallback(
    (target: number, isSpin = false) => {
      stopAnim();
      const start = posRef.current;

      if (Math.abs(start - target) < 0.01 && !isSpin) {
        setPosition(target);
        posRef.current = target;
        const idx = ((target % len) + len) % len;
        onCenterChange?.(items[idx].id, idx);
        return;
      }

      const tick = (pos: number, vel: number) => {
        const stiffness = isSpin ? 0.02 : 0.15;
        const damping = isSpin ? 0.95 : 0.72;
        const force = -(pos - target) * stiffness;
        const nv = (vel + force) * damping;
        const np = pos + nv;

        if (Math.abs(np - target) < 0.003 && Math.abs(nv) < 0.003) {
          setPosition(target);
          posRef.current = target;
          setIsDragging(false);
          const idx = ((Math.round(target) % len) + len) % len;
          onCenterChange?.(items[idx].id, idx);
          return;
        }

        setPosition(np);
        posRef.current = np;
        animRef.current = requestAnimationFrame(() => tick(np, nv));
      };

      const initialVel = isSpin ? 2.5 : 0; // Give it a push if it's a spin
      animRef.current = requestAnimationFrame(() => tick(start, initialVel));
    },
    [len, items, onCenterChange, stopAnim]
  );

  useImperativeHandle(ref, () => ({
    spinTo: (targetPos: number) => {
      // Ensure we spin forward by adding a large multiple of len
      const currentPos = posRef.current;
      const spins = 3; // number of full rotations
      const adjustedTarget = currentPos + (spins * len) + (targetPos - (currentPos % len));
      animateToTarget(adjustedTarget, true);
    },
    getPosition: () => ((Math.round(posRef.current) % len) + len) % len
  }));

  const momentumSpring = useCallback(
    (fromPos: number, vel: number) => {
      stopAnim();
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
          const idx = ((Math.round(target) % len) + len) % len;
          onCenterChange?.(items[idx].id, idx);
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el || spinning) return;

    const onDown = (e: PointerEvent) => {
      stopAnim();
      const d = drag.current;
      d.active = true;
      d.moved = false;
      d.startY = e.clientY;
      d.startPos = posRef.current;
      d.lastY = e.clientY;
      d.lastTime = Date.now();
      d.velocity = 0;
      d.pointerId = e.pointerId;
    };

    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || d.pointerId !== e.pointerId) return;

      const totalDy = e.clientY - d.startY;

      if (!d.moved && Math.abs(totalDy) > 5) {
        d.moved = true;
        setIsDragging(true);
      }
      if (!d.moved) return;

      e.preventDefault();

      const now = Date.now();
      const dt = Math.max(now - d.lastTime, 1);
      const dy = e.clientY - d.lastY;

      d.velocity = -(dy / GAP) / (dt / 1000) * 0.012;
      d.lastY = e.clientY;
      d.lastTime = now;

      const newPos = d.startPos - totalDy / GAP;
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
  }, [stopAnim, momentumSpring, GAP, spinning]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || spinning) return;

    let accum = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      accum += e.deltaY;
      if (Math.abs(accum) >= 20) {
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
  }, [animateToTarget, spinning]);

  useEffect(() => () => stopAnim(), [stopAnim]);

  const handleCardClick = useCallback(
    (offset: number) => {
      if (drag.current.moved || spinning) return;
      if (Math.abs(offset) >= 0.4) {
        const steps = Math.round(offset);
        const current = Math.round(posRef.current);
        animateToTarget(current + steps);
      }
    },
    [animateToTarget, spinning]
  );

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
    const scale = Math.max(0.7, 1 - absOff * 0.15);
    const opacity = Math.max(0.1, 1 - absOff * 0.3);
    const translateY = offset * GAP;
    const zIndex = 100 - Math.round(absOff * 10);
    // Add 3D rotation effect
    const rotateX = -offset * 25;

    return {
      transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
      opacity,
      zIndex,
      transition: isDragging ? "none" : "all 0.05s linear",
      willChange: "transform, opacity",
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ height: activeHeight, touchAction: "none", perspective: "800px" }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center transform-style-3d">
        {getVisibleCards().map(({ item, offset }) => {
          const isCenter = Math.abs(offset) < 0.3 && !isDragging;

          return (
            <div
              key={`${item.id}-${Math.round(offset * 100)}`}
              className="absolute w-full flex items-center justify-center"
              style={{
                height: itemHeight,
                ...getCardStyle(offset),
              }}
              onClick={() => handleCardClick(offset)}
            >
              <div
                className={`
                  w-full h-full flex items-center justify-center
                  rounded-lg
                  ${isCenter
                    ? "text-accent-cyan font-bold drop-shadow-[0_0_8px_rgba(0,255,240,0.8)]"
                    : "text-text-muted font-medium"
                  }
                `}
              >
                {item.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 inset-x-0 h-10 pointer-events-none bg-gradient-to-b from-bg-surface via-bg-surface/60 to-transparent z-[200]" />
      <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none bg-gradient-to-t from-bg-surface via-bg-surface/60 to-transparent z-[200]" />
    </div>
  );
});

SlotReelCarousel.displayName = 'SlotReelCarousel';

export default SlotReelCarousel;
