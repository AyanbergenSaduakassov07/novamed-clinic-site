"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered stagger reveal.
 *
 * Deliberately CSS-only. A fade-and-rise is exactly what a CSS transition is
 * for, and pulling an animation engine into the initial bundle to drive it was
 * measurable hydration cost on every page. anime.js is now reserved for the
 * things that genuinely need timeline orchestration: the loader and the quiz.
 *
 * Children are marked `.reveal`, which only hides them once the inline script
 * in the layout has added `.js` to <html>. Without JS, with broken JS, or under
 * prefers-reduced-motion the content renders plainly visible.
 *
 * Stagger defaults to 40ms, inside the 30–50ms band the brief specifies.
 */
export function Reveal({
  children,
  className,
  stagger = 40,
  selector = ":scope > *",
  threshold = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  /** Which descendants animate. Defaults to direct children. */
  selector?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    const show = () =>
      targets.forEach((el) => el.setAttribute("data-revealed", "true"));

    if (prefersReducedMotion()) {
      show();
      return;
    }

    targets.forEach((el, i) => {
      el.style.transitionDelay = `${i * stagger}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          show();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [selector, stagger, threshold]);

  return (
    <div ref={ref} className={cn("[&>*]:reveal", className)}>
      {children}
    </div>
  );
}
