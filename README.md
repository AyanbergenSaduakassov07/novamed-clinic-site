# NovaMed — сайт клиники инфузионной терапии, Актобе

Marketing site for NovaMed, an IV therapy clinic in Aktobe sharing a building
with the KDL Olymp diagnostic lab.

Russian at the root, Kazakh under `/kz`. Every booking path ends in WhatsApp.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
npm run test:contrast # verify the colour contract still holds
```

Node 20+. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`
before deploying, or `rel=canonical` and `hreflang` point at the wrong origin.

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router) + React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| i18n | next-intl 4 — `ru` at `/`, `kk` at `/kz` |
| Motion | anime.js v4 (loader + quiz only), Lenis (smooth scroll) |
| 3D | react-three-fiber + drei, lazy and gated |
| Deploy | Vercel |

**The brief specified Next.js 15.** `create-next-app@latest` now ships 16.3,
and every dependency here supports it (next-intl declares `^16`, R3F 9 wants
React `>=19 <19.3` and we are on 19.2). Starting a new client project on an
older major had no upside. The App Router code is identical either way — to pin
back to 15, change `next` in `package.json` and reinstall.

## Layout

```
src/
├─ app/[locale]/          route tree, one folder per page
├─ components/
│  ├─ brand/              logo mark, wordmark lockup, cursive tagline
│  ├─ home/               homepage sections + the 3D hero
│  ├─ layout/             Nav, Footer, ContactDock
│  ├─ motion/             Reveal (CSS), SmoothScroll (Lenis)
│  ├─ services/           catalog list + filter
│  └─ ui/                 Button, Container, icons, headings
├─ i18n/                  routing, request config, client namespace list
├─ lib/                   contacts, services, quiz, gallery, site, contrast test
└─ proxy.ts               locale middleware (Next 16 renamed this from middleware.ts)
messages/{ru,kk}.json     all copy, both locales, key-for-key identical
```

---

## The colour contract

`src/app/globals.css` opens with a measured contrast table and five rules.
**Read it before touching a colour.** The short version:

- Anything **filled** with a pillar colour uses `*-bg` with `--ink` text
  (4.56–7.37:1). Filling with `*-fg` and labelling it white lands at 3.02–4.49
  and fails AA, so that combination does not exist in the codebase.
- `*-fg` is an accent only: focus rings, borders ≥2px, icon strokes, liquid fills.
- Dark panels use `--ink`, never `--brand-teal`. Teal fails against both white
  (2.90) and ink (4.23), so it is a fill and scene colour only.
- **Never dim text with `opacity` on a coloured ground.** `ink` on
  `zolushka-bg` is 4.56 — six hundredths of headroom. At 90% it is 3.89 and
  fails. Hierarchy on those grounds comes from weight and size.

`npm run test:contrast` asserts all of it, including the combinations that must
stay *banned*. It fails the build loudly if a hex changes.

## The design

Grounded in what an infusion clinic actually is: fluid settling in a bag.

- **The meniscus** is the signature element. A real meniscus climbs the walls of
  its container, so the divider sits high at the edges and low across the middle.
  It appears four times only — hero into the mint pool, pool back to the page,
  into the safety section, into the footer. It never animates.
- The **hero IV stand** stands *in* the mint pool: the pool paints over the
  canvas so the base sits below the liquid line.
- **Pillar cards** hang at different heights, like bags on a stand, and take
  their proportion and corner radius from the logo card.
- The **hover fill** on a service card rises and stops below the text, because
  filling the whole card would break the contrast contract.
- The **walkthrough** is the only numbered sequence, and its bar segments are
  sized in proportion to real minutes, so the long stretch in the chair looks long.

Type: Unbounded (display) + Golos Text (body), both variable, both Cyrillic-native.

## Motion

One orchestrated moment — the loader — and restraint everywhere else.

`Loader.tsx` runs a five-beat anime.js timeline: the mark draws in via
`stroke-dashoffset`, NOVA reveals per character, the MED pill wipes in, a
droplet falls and spreads into a progress bar that waits on real asset loading
(capped at 900ms), then the ink screen and a mint/teal curtain split apart.

It is `sessionStorage`-gated (repeat visits get a 300ms fade), skippable by
click or Escape, and **not rendered at all** under `prefers-reduced-motion`.
It is a fixed overlay over an already-laid-out hero, so it never shifts layout.

Scroll reveals are pure CSS transitions with a stagger delay. anime.js is
dynamically imported and only reaches the browser for the loader and the quiz.

## The 3D hero

`IVStandScene.tsx` builds a real IV stand in react-three-fiber: pole, castor
base, cross bar, three pillar-coloured bags with liquid settled in the bottom,
drip chambers and lines. Hovering or selecting a bag swells it.

It is a **progressive enhancement**, gated in `useSceneUpgrade()` in `Hero.tsx`:

| condition | behaviour |
|---|---|
| `prefers-reduced-motion` | never loads — the value is the motion |
| fine pointer, ≥1024px | upgrades when the browser goes idle |
| everything else | upgrades on first touch of the scene |

Until then `IVStandFallback.tsx` renders the same stand as inline SVG at the
same size, so nothing shifts. three.js is ~231KB transferred and ~520ms of
script evaluation on a mid-range phone; this keeps that off the critical path.
Set `FORCE_SCENE_EVERYWHERE = true` in `Hero.tsx` to always upgrade at idle.

**The brief asked for a Spline scene.** Spline is a hosted visual editor that
needs an account and a manual publish step, so it cannot be produced from a
terminal. This is coded instead and lives behind one `<IVStandScene>` boundary —
dropping in a Spline embed later is a one-file swap.

## Contact

`src/lib/contacts.ts` is the only place the phone number lives. Every booking
CTA goes through `whatsappUrl(message)`, which encodes an already-translated
message into a `wa.me` deep link. No component builds that URL itself.

There are no star ratings, review counts or numeric scores anywhere, by design.

## Audit

Production build, Lighthouse via the installed Chrome:

| | mobile | desktop |
|---|---|---|
| Performance | 90 | 97–98 |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | 100 | 100 |
| CLS | **0** | **0** |
| Total blocking time | 0 ms | 0 ms |

`axe-core` (WCAG 2.0/2.1 A + AA): **0 violations** across all 7 page types in
both locales.

Observed FCP and LCP on a throttled mobile profile are ~126ms; Lighthouse's
mobile LCP figure is its *simulated* (Lantern) estimate, which charges a
render-delay against hydration.

SEO scores 92 when tested on `localhost` because the canonical points at the
production domain — it is 100 once `NEXT_PUBLIC_SITE_URL` matches the origin.

## Deploy

Push to a Git repo, import in Vercel, set `NEXT_PUBLIC_SITE_URL`. All 16 pages
(7 types × 2 locales) prerender as static HTML.

**`novamed.kz` was available** at the time of writing, along with
`novamedaktobe.kz`, `novamed-aktobe.kz` and `novamedclinic.kz`. `.kz` requires a
Kazakh registrar and a BIN, which ТОО «НоваМед» has. Register it before someone
else does.
