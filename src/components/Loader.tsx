"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Timeline } from "animejs";
import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/LogoMark";
import { prefersReducedMotion } from "@/lib/motion";

const SESSION_KEY = "novamed:intro-played";
/** Hard ceiling on waiting for assets, so a slow image can never trap anyone. */
const ASSET_WAIT_CAP_MS = 900;

/**
 * The one orchestrated moment on the site. Everything else stays restrained.
 *
 *   0.00–0.40  hands-and-cross draws in via stroke-dashoffset
 *   0.40–0.90  mark solidifies, NOVA reveals per character, MED pill wipes in
 *   0.90–1.60  a droplet falls from the pill and spreads into a progress bar
 *              that fills while real page assets finish loading
 *   1.60–1.90  the ink screen splits at the centre
 *   1.90–2.20  mint and teal panels behind it split too, revealing the hero
 *
 * The hero is already laid out underneath the whole time. This is a fixed
 * overlay and never occupies layout, so nothing shifts when it leaves.
 *
 * Skipped entirely under prefers-reduced-motion. Second visit in the same tab
 * session gets a 300ms fade. Click, tap, or Escape skips to the end.
 */
export function Loader() {
  const t = useTranslations("loader");
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);

  // `null` = still deciding, so nothing paints before we know which path.
  const [mode, setMode] = useState<"full" | "short" | "off" | null>(null);
  const [done, setDone] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect --
     Deliberate client-only decision that must NOT run during SSR: it reads
     sessionStorage and matchMedia, neither of which exists on the server, and
     rendering the outcome server-side would guarantee a hydration mismatch.
     Rendering null until the mode is known is the point, not an accident. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      setMode("off");
      return;
    }
    const seen = sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, "1");
    setMode(seen ? "short" : "full");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const finish = useCallback(() => {
    setDone(true);
    document.documentElement.style.removeProperty("overflow");
  }, []);

  const skip = useCallback(() => {
    timelineRef.current?.complete();
    finish();
  }, [finish]);

  useEffect(() => {
    if (mode === null || mode === "off") return;
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = "hidden";

    // anime.js is ~60KB and nothing above the fold needs it to render. It is
    // fetched here, in parallel with the page, rather than sitting in the
    // initial bundle where it costs hydration time on every visit.
    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const { animate, createTimeline, stagger, svg } = await import("animejs");
      if (cancelled || !rootRef.current) return;

      const q = <T extends Element>(sel: string) => root.querySelector<T>(sel) as T;
      const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

      if (mode === "short") {
        const a = animate(root, { opacity: [1, 0], duration: 300, ease: "out(2)" });
        void a.then(finish);
        teardown = () => a.pause();
        return;
      }

      const chars = qa("[data-nova] [data-char]");

      const tl = createTimeline({
        defaults: { ease: "out(3)" },
        onComplete: finish,
      });
      timelineRef.current = tl;

      // 0.00–0.40 — draw the mark. Scoped to this loader's own paths so the
      // nav and footer logos are untouched.
      const markPaths = Array.from(
        root.querySelectorAll<SVGPathElement>("[data-mark-path]"),
      );
      tl.add(
        svg.createDrawable(markPaths),
        { draw: ["0 0", "0 1"], duration: 400, ease: "inOut(2)" },
        0,
      );

      // 0.40–0.90 — mark settles, NOVA per character, MED pill wipes in
      tl.add(q("[data-icon]"), { scale: [0.94, 1], duration: 420 }, 380)
        .add(
          chars,
          { opacity: [0, 1], translateY: [14, 0], duration: 320, delay: stagger(46) },
          420,
        )
        .add(q("[data-med]"), { "--wipe": ["100%", "0%"], duration: 380 }, 640);

      // 0.90–1.60 — droplet falls, spreads into a bar, bar fills
      tl.add(q("[data-drop]"), { opacity: [0, 1], duration: 120 }, 900)
        .add(q("[data-drop]"), { translateY: [0, 42], duration: 320, ease: "in(2)" }, 940)
        .add(
          q("[data-drop]"),
          {
            width: [10, 168],
            height: [10, 3],
            backgroundColor: ["#99D1AA", "rgba(255,255,255,0.22)"],
            duration: 240,
          },
          1260,
        )
        .add(q("[data-fill]"), { width: ["0%", "100%"], duration: 340 }, 1300);

      // 1.60–2.20 — ink splits, then the mint/teal curtain behind it
      tl.add(q("[data-stage]"), { opacity: [1, 0], duration: 200 }, 1600)
        .add(q("[data-ink-l]"), { translateX: ["0%", "-101%"], duration: 320, ease: "in(2)" }, 1620)
        .add(q("[data-ink-r]"), { translateX: ["0%", "101%"], duration: 320, ease: "in(2)" }, 1620)
        .add(q("[data-curtain-l]"), { translateX: ["0%", "-101%"], duration: 340, ease: "in(2)" }, 1900)
        .add(q("[data-curtain-r]"), { translateX: ["0%", "101%"], duration: 340, ease: "in(2)" }, 1900);

      // Hold the bar until the page has actually loaded, capped so a slow
      // asset can never trap anyone behind the intro.
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        tl.play();
      };
      if (document.readyState === "complete") {
        release();
      } else {
        tl.pause();
        window.addEventListener("load", release, { once: true });
        setTimeout(release, ASSET_WAIT_CAP_MS);
      }

      teardown = () => {
        window.removeEventListener("load", release);
        tl.pause();
      };
    })();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      teardown?.();
      document.documentElement.style.removeProperty("overflow");
    };
  }, [mode, finish, skip]);

  if (mode === null || mode === "off" || done) return null;

  return (
    <div
      ref={rootRef}
      onClick={skip}
      className="fixed inset-0 z-[100] cursor-pointer"
      role="presentation"
    >
      {/* revealed once the ink splits, then splits in turn */}
      <div data-curtain-l className="absolute inset-y-0 left-0 w-1/2 bg-mint" />
      <div data-curtain-r className="absolute inset-y-0 right-0 w-1/2 bg-teal" />

      {/* the ink screen itself */}
      <div data-ink-l className="absolute inset-y-0 left-0 w-1/2 bg-ink" />
      <div data-ink-r className="absolute inset-y-0 right-0 w-1/2 bg-ink" />

      <div
        data-stage
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center gap-7 text-white"
      >
        <span data-icon className="block w-24 md:w-28">
          <LogoMark ground="#123B3A" className="w-full" />
        </span>

        <span className="font-display flex flex-col items-center leading-none">
          <span data-nova className="text-[2rem] font-extrabold tracking-[0.14em] md:text-[3rem]">
            {"NOVA".split("").map((c, i) => (
              <span key={i} data-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
          <span
            data-med
            style={{ clipPath: "inset(0 var(--wipe,0%) 0 0 round 0.28em)" }}
            className="mt-[0.14em] rounded-[0.28em] border-[0.075em] border-current px-[0.3em]
                       pt-[0.09em] pb-[0.13em] text-[1.25rem] font-extrabold tracking-[0.2em] md:text-[1.86rem]"
          >
            MED
          </span>
        </span>

        <div className="relative flex h-14 w-[168px] items-start justify-center">
          <div
            data-drop
            className="h-[10px] w-[10px] rounded-full bg-mint opacity-0"
          >
            <div data-fill className="h-full w-0 rounded-full bg-mint" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full px-5 py-3
                   text-sm text-white/80 underline underline-offset-4
                   transition-colors duration-150 hover:text-white
                   focus-visible:outline-3 focus-visible:outline-mint"
      >
        {t("skip")}
      </button>
    </div>
  );
}
