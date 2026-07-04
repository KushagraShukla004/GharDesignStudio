import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { Dims } from "../lib/size";

const H = 2.7; // ceiling height (m)
const T = 0.08; // wall thickness (m)

export interface LightPreset {
  ambient: number;
  dir: number;
  dirColor: string;
  ambColor: string;
}

/** Map a lighting key to intensities + colour temperature (warm/cool). */
export const LIGHT_PRESETS: Record<string, LightPreset> = {
  bright: { ambient: 0.85, dir: 1.15, dirColor: "#ffffff", ambColor: "#f2f6ff" },
  soft: { ambient: 0.6, dir: 0.85, dirColor: "#ffe6c2", ambColor: "#fff2df" },
  cozy: { ambient: 0.4, dir: 0.5, dirColor: "#ffc078", ambColor: "#ffd9a8" },
};

function Dollhouse({
  w,
  d,
  wallColor,
  floorColor,
}: {
  w: number;
  d: number;
  wallColor: string;
  floorColor: string;
}) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} />
      </mesh>

      {/* back wall (far, -z) */}
      <mesh position={[0, H / 2, -d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w + T, H, T]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* left wall (-x) */}
      <mesh position={[-w / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* right wall (+x) */}
      <mesh position={[w / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>
    </group>
  );
}

export function RoomPreview({
  dims,
  wallColor,
  floorColor,
  lightKey,
}: {
  dims: Dims;
  wallColor: string;
  floorColor: string;
  lightKey: string;
}) {
  const w = dims.w;
  const d = dims.d;
  const preset = LIGHT_PRESETS[lightKey] ?? LIGHT_PRESETS.soft;
  const reach = Math.max(w, d);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [w * 0.85, H * 1.35, d * 1.15],
        fov: 50,
      }}
    >
      <color attach="background" args={["#fdf4dc"]} />
      <ambientLight intensity={preset.ambient} color={preset.ambColor} />
      <hemisphereLight intensity={preset.ambient * 0.4} color={preset.ambColor} groundColor={floorColor} />
      <directionalLight
        position={[w, H * 2.2, d]}
        intensity={preset.dir}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Dollhouse w={w} d={d} wallColor={wallColor} floorColor={floorColor} />
      <ContactShadows
        position={[0, 0.01, 0]}
        scale={reach * 2.2}
        blur={2.4}
        opacity={0.35}
        far={H}
      />
      <OrbitControls
        target={[0, H / 2, 0]}
        enablePan={false}
        minDistance={reach * 0.6}
        maxDistance={reach * 3}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
