"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reads the OS setting and keeps up if it changes mid-session.
 *
 * useSyncExternalStore rather than useState + useEffect: a media query is an
 * external store, and this is the hook built for subscribing to one. It also
 * gives a correct server snapshot (false) without a cascading re-render.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** Synchronous read, for code that has to decide before first paint. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Subscribes to window scroll and reports whether it is past `threshold`.
 * Same reasoning as above: scroll position is an external store.
 */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      window.addEventListener("resize", onChange, { passive: true });
      return () => {
        window.removeEventListener("scroll", onChange);
        window.removeEventListener("resize", onChange);
      };
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
