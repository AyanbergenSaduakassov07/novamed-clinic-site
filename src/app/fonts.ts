import { Unbounded, Golos_Text } from "next/font/google";

/**
 * Both faces are variable fonts on Google Fonts, so `weight` is omitted
 * deliberately: next/font then serves one variable file per subset covering
 * every weight, instead of a separate static instance for each of 400/500/
 * 600/800. Fewer requests and less total font payload.
 */

/** Display. Geometric, wide, full Cyrillic. Short headlines only. */
export const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  variable: "--font-unbounded",
  display: "swap",
});

/** Body and UI. Cyrillic-native, holds up at small sizes. */
export const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  variable: "--font-golos",
  display: "swap",
});
