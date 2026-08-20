import { SERVICE_THEME, SERVICES } from "@/lib/services";

/**
 * Shown while the WebGL scene loads, and permanently if WebGL is unavailable.
 * Same footprint as the canvas, so swapping one for the other shifts nothing.
 */
export function IVStandFallback() {
  const x = [58, 150, 242];
  return (
    <svg viewBox="0 0 300 340" fill="none" aria-hidden="true" className="h-full w-full">
      <g stroke="#C3D6D3" strokeWidth="5" strokeLinecap="round">
        <path d="M150 44 V286" />
        <path d="M58 44 H242" />
        <path d="M150 286 L96 312 M150 286 L204 312 M150 286 V318" />
      </g>
      {SERVICES.map((s, i) => (
        <g key={s.id}>
          <rect
            x={x[i] - 26}
            y={52}
            width={52}
            height={100}
            rx={16}
            fill={SERVICE_THEME[s.id].hex.bg}
            opacity={0.32}
          />
          <rect
            x={x[i] - 22}
            y={86}
            width={44}
            height={62}
            rx={13}
            fill={SERVICE_THEME[s.id].hex.bg}
          />
          <path
            d={`M${x[i]} 152 V214`}
            stroke={SERVICE_THEME[s.id].hex.bg}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
      ))}
    </svg>
  );
}
