/**
 * The appointment, start to finish. Durations are real minutes and drive the
 * width of each segment in the walkthrough, so the graphic is a picture of the
 * visit rather than five equal boxes.
 *
 * CLINIC TO CONFIRM: sanity-check these against real appointment lengths.
 */
export const EXPECT_STEPS = [
  { key: "one", minutes: 5 },
  { key: "two", minutes: 10 },
  { key: "three", minutes: 5 },
  { key: "four", minutes: 40 },
  { key: "five", minutes: 10 },
] as const;

export const EXPECT_TOTAL = EXPECT_STEPS.reduce((n, s) => n + s.minutes, 0);
