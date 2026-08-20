import type { PillarId } from "./services";

export type Weights = Partial<Record<PillarId, number>>;

/**
 * Three questions, four answers each. Copy lives in messages under `quiz.qN`;
 * only the scoring lives here.
 *
 * The pregnancy and breastfeeding answers carry a deliberately dominant weight
 * so they win outright. Routing someone who is pregnant toward anything other
 * than the supervised «Маме можно» track would be wrong regardless of what
 * else they picked, and this is a suggestion engine, not a triage tool.
 */
export const QUIZ: ReadonlyArray<{
  key: "q1" | "q2" | "q3";
  answers: ReadonlyArray<{ key: "a1" | "a2" | "a3" | "a4"; weights: Weights }>;
}> = [
  {
    key: "q1",
    answers: [
      { key: "a1", weights: { zolushka: 3 } },
      { key: "a2", weights: { detox: 2, zolushka: 1 } },
      { key: "a3", weights: { detox: 3 } },
      { key: "a4", weights: { mame: 9 } },
    ],
  },
  {
    key: "q2",
    answers: [
      { key: "a1", weights: { detox: 2 } },
      { key: "a2", weights: { zolushka: 2 } },
      { key: "a3", weights: { detox: 1, mame: 1 } },
      { key: "a4", weights: { detox: 2, zolushka: 1 } },
    ],
  },
  {
    key: "q3",
    answers: [
      { key: "a1", weights: { zolushka: 3 } },
      { key: "a2", weights: { detox: 2 } },
      { key: "a3", weights: { mame: 9 } },
      { key: "a4", weights: { detox: 3 } },
    ],
  },
];

/** Ties fall back to the first pillar in SERVICES order, which is stable. */
export function scoreQuiz(picks: ReadonlyArray<number>): PillarId {
  const totals: Record<PillarId, number> = { mame: 0, zolushka: 0, detox: 0 };

  picks.forEach((answerIndex, questionIndex) => {
    const answer = QUIZ[questionIndex]?.answers[answerIndex];
    if (!answer) return;
    for (const [pillar, weight] of Object.entries(answer.weights)) {
      totals[pillar as PillarId] += weight ?? 0;
    }
  });

  return (Object.keys(totals) as PillarId[]).reduce((best, id) =>
    totals[id] > totals[best] ? id : best,
  );
}
