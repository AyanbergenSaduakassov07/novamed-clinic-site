"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SERVICES, SERVICE_THEME, type PillarId } from "@/lib/services";
import { prefersReducedMotion } from "@/lib/motion";

const BAG_X = [-0.95, 0, 0.95];
const POLE = "#C9D8D6";
const CHROME = "#AFC4C2";

/** A single hanging bag: translucent pouch, liquid settled in the bottom. */
function Bag({
  id,
  x,
  active,
  onSelect,
  onHover,
  reduced,
}: {
  id: PillarId;
  x: number;
  active: boolean;
  onSelect: (id: PillarId) => void;
  onHover: (id: PillarId | null) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const liquid = SERVICE_THEME[id].hex.bg;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const target = active ? 1.075 : 1;
    g.scale.lerp(new THREE.Vector3(target, target, target), 0.16);
    // A slow sway, so the bags read as hanging rather than welded on.
    g.rotation.z = reduced
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.55 + x * 2) * 0.014;
  });

  return (
    <group
      ref={group}
      position={[x, 1.02, 0.17]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* hanger tab */}
      <mesh position={[0, 0.56, 0]}>
        <torusGeometry args={[0.06, 0.018, 8, 20]} />
        <meshStandardMaterial color={CHROME} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* liquid, filling the lower part of the pouch */}
      <RoundedBox args={[0.46, 0.66, 0.15]} radius={0.07} smoothness={4} position={[0, -0.14, 0]}>
        <meshStandardMaterial color={liquid} roughness={0.28} metalness={0.02} />
      </RoundedBox>

      {/* pouch shell over the top */}
      <RoundedBox args={[0.52, 1.0, 0.19]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.16}
          metalness={0}
          depthWrite={false}
        />
      </RoundedBox>

      {/* outlet port */}
      <mesh position={[0, -0.56, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.12, 12]} />
        <meshStandardMaterial color="#EAF3F1" roughness={0.5} />
      </mesh>

      {/* drip chamber */}
      <mesh position={[0, -0.74, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.2, 14]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.2} />
      </mesh>

      {/* line running down out of frame */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.05, 8]} />
        <meshStandardMaterial color={liquid} transparent opacity={0.55} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Stand() {
  return (
    <group>
      {/* vertical pole */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 4.3, 16]} />
        <meshStandardMaterial color={POLE} roughness={0.35} metalness={0.55} />
      </mesh>

      {/* cross bar the bags hang from */}
      <mesh position={[0, 1.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 2.3, 12]} />
        <meshStandardMaterial color={POLE} roughness={0.35} metalness={0.55} />
      </mesh>

      {/* hooks */}
      {BAG_X.map((x) => (
        <mesh key={x} position={[x, 1.62, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.014, 8, 18]} />
          <meshStandardMaterial color={CHROME} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}

      {/* base column collar */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.16, 16]} />
        <meshStandardMaterial color={CHROME} roughness={0.35} metalness={0.5} />
      </mesh>

      {/* five-spoke base with castors */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0, -1.62, 0.3]} rotation={[Math.PI / 2.6, 0, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.62, 10]} />
              <meshStandardMaterial color={POLE} roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[0, -1.79, 0.57]}>
              <sphereGeometry args={[0.062, 14, 12]} />
              <meshStandardMaterial color="#8FA6A4" roughness={0.55} metalness={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene({
  active,
  onSelect,
  onHover,
  reduced,
}: {
  active: PillarId | null;
  onSelect: (id: PillarId) => void;
  onHover: (id: PillarId | null) => void;
  reduced: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} castShadow={false} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#99D1AA" />
      <hemisphereLight args={["#ffffff", "#44A5AE", 0.5]} />

      <group position={[0, -0.1, 0]}>
        <Stand />
        {SERVICES.map((s, i) => (
          <Bag
            key={s.id}
            id={s.id}
            x={BAG_X[i]}
            active={active === s.id}
            onSelect={onSelect}
            onHover={onHover}
            reduced={reduced}
          />
        ))}
      </group>
    </>
  );
}

/**
 * The hero scene: an IV stand with the three pillar-coloured bags.
 *
 * Interaction here is a progressive enhancement. The three real <button>s the
 * Hero renders alongside it are the keyboard and screen-reader path, and they
 * drive the same `active` state, so nothing is reachable only by pointing at
 * a WebGL canvas.
 *
 * The frameloop stops entirely when the canvas leaves the viewport.
 */
export function IVStandScene({
  active,
  onSelect,
}: {
  active: PillarId | null;
  onSelect: (id: PillarId) => void;
}) {
  const [hovered, setHovered] = useState<PillarId | null>(null);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.35, 5.4], fov: 34 }}
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <Scene
          active={hovered ?? active}
          onSelect={onSelect}
          onHover={setHovered}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
