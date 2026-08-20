import { cn } from "@/lib/utils";

/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║  SWAP POINT — the cursive «сенімді медицина» tagline.                   ║
 * ║                                                                        ║
 * ║  The brief marks this as a LOCKED export from the source logo file.    ║
 * ║  What renders below is a stand-in: the calligraphic swash is drawn as  ║
 * ║  a real path, but the lettering is not the client's lettering and must ║
 * ║  not ship to production as-is.                                          ║
 * ║                                                                        ║
 * ║  TO SWAP: replace the <svg> body with the vector export. Keep the      ║
 * ║  component name, the props, and the viewBox aspect ratio and every     ║
 * ║  call site keeps working. This is the only file that needs to change.  ║
 * ║                                                                        ║
 * ║  In the source logo the script is filled blue on the mint card and     ║
 * ║  navy on the teal card, neither of which is in the brand token table.  ║
 * ║  `scriptFill` carries that value so it stays out of the palette.       ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 */
export function BrandTagline({
  className,
  scriptFill = "#2E5FBF",
  title = "сенімді медицина",
}: {
  className?: string;
  /** Fill for the script itself. Not a brand token: see the note above. */
  scriptFill?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("block", className)}
      data-placeholder="brand-tagline"
    >
      {/* swash, kept clear of the lettering so the words stay legible */}
      <path
        d="M30 150 C92 172 214 170 264 146 C284 136 278 116 259 121
           C241 126 240 152 268 158"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* stand-in lettering */}
      <g
        fontFamily="'Snell Roundhand','Apple Chancery','Segoe Script',cursive"
        fontStyle="italic"
        fontWeight="700"
        textAnchor="middle"
        paintOrder="stroke"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        fill={scriptFill}
      >
        <text x="150" y="74" fontSize="62" letterSpacing="1">
          сенімді
        </text>
        <text x="150" y="134" fontSize="62" letterSpacing="1">
          медицина
        </text>
      </g>
    </svg>
  );
}
