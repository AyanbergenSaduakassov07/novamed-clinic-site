/**
 * Verifies the colour contract documented at the top of src/app/globals.css.
 * Run: npm run test:contrast
 *
 * Any change to a brand hex must keep this passing, or the contract comment
 * in globals.css is out of date and the palette is no longer WCAG AA.
 */
const C = {
  teal: "#44A5AE", mint: "#99D1AA", ink: "#123B3A", surface: "#F6FBFA",
  inkMuted: "#3D5F5E", inkFaint: "#D9E8E6", white: "#FFFFFF",
  mameBg: "#FBB5CF", mameFg: "#FF3882",
  zolBg: "#4FAABC", zolFg: "#2F8192",
  detBg: "#87C764", detFg: "#5BA632",
};

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const n = parseInt(h.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const x = L(a), y = L(b), [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05); };

const AA = 4.5, LARGE = 3.0, UI = 3.0;
let failed = 0;

const must = (fg, bg, min, label) => {
  const r = ratio(C[fg], C[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} >= ${min}  ${label}`);
};
const mustNot = (fg, bg, min, label) => {
  const r = ratio(C[fg], C[bg]);
  const ok = r < min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} <  ${min}  ${label}`);
};

console.log("\n— Rule 1: filled pillar surfaces carry ink at AA —");
must("ink", "mameBg", AA, "ink on Маме можно card/button");
must("ink", "zolBg", AA, "ink on Золушка card/button");
must("ink", "detBg", AA, "ink on Детокс+ card/button");

console.log("\n— Body text —");
must("ink", "surface", AA, "default body");
must("inkMuted", "surface", AA, "secondary body (ink-muted)");
must("white", "ink", AA, "reversed body on dark panel");
must("mint", "ink", AA, "mint accent text on dark panel");

console.log("\n— Rule 2: pillar-fg is legal as a large-text / UI accent —");
must("mameFg", "surface", UI, "Маме можно accent stroke on light");
must("zolFg", "surface", UI, "Золушка accent stroke on light");
must("white", "mameFg", LARGE, "large reversed label on pink fill");
must("white", "zolFg", LARGE, "large reversed label on Золушка fill");
must("white", "detFg", LARGE, "large reversed label on detox fill");

console.log("\n— Rule 2/4: these MUST stay banned in the system —");
mustNot("mameFg", "surface", AA, "pink as normal-size text on light — banned");
mustNot("zolFg", "surface", AA, "Золушка fg as normal-size text on light — banned");
mustNot("detFg", "surface", UI, "detox fg as a hairline on light — banned (Rule 4)");
mustNot("teal", "surface", AA, "teal as text on light — banned (Rule 3)");
mustNot("white", "teal", AA, "white on teal panel — banned (Rule 3)");

console.log("\n— Opacity on coloured grounds —");
// Softening text with opacity-* on a pillar ground silently broke AA once.
// zolushka-bg has only 0.06 of headroom at full ink, so nothing may be dimmed
// there, and ink-muted is illegal on mint. Hierarchy on these grounds comes
// from weight and size instead. See the axe run that caught this.
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const blendHex = (fg, bg, a) => {
  const f = rgb(fg), b = rgb(bg);
  const mix = f.map((c, i) => Math.round(c * a + b[i] * (1 - a)));
  return "#" + mix.map((c) => c.toString(16).padStart(2, "0")).join("");
};
const mustBlend = (fg, bg, alpha, min, label) => {
  const r = ratio(blendHex(C[fg], C[bg], alpha), C[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} >= ${min}  ${label}`);
};
const mustNotBlend = (fg, bg, alpha, min, label) => {
  const r = ratio(blendHex(C[fg], C[bg], alpha), C[bg]);
  const ok = r < min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} <  ${min}  ${label}`);
};

mustBlend("ink", "zolBg", 1.0, AA, "full-strength ink on Золушка (the tight one)");
mustNotBlend("ink", "zolBg", 0.9, AA, "ink at 90% on Золушка — banned");
mustNotBlend("ink", "detBg", 0.8, AA, "ink at 80% on detox — banned");
mustNot("inkMuted", "mint", AA, "ink-muted on mint — banned");
mustNot("inkMuted", "zolBg", AA, "ink-muted on Золушка — banned");
mustBlend("ink", "mint", 0.85, AA, "ink at 85% on mint is the floor that still passes");

console.log("\n— Non-text UI —");
must("inkFaint", "surface", 1.1, "hairline visible against surface (decorative)");
must("ink", "surface", UI, "focus ring on light ground");
must("mint", "ink", UI, "focus ring on dark ground");

console.log(failed === 0
  ? "\n✓ colour contract holds\n"
  : `\n✗ ${failed} assertion(s) broke the contract\n`);
process.exit(failed === 0 ? 0 : 1);
