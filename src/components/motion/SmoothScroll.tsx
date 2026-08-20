"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll.
 *
 * Skipped entirely under prefers-reduced-motion: hijacking the scroll wheel is
 * exactly the kind of motion that setting is asking us not to do. Native
 * scrolling stays fully intact in that case.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      let frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      teardown = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
