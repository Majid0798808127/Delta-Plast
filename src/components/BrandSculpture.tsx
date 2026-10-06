import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Color, Group } from "three";

type Palette = { red: string; mint: string; paper: string };

function Sculpture({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame(({ pointer }, rawDelta) => {
    const g = group.current;
    if (!g || reduced) return;
    const dt = Math.min(rawDelta, 0.05);
    time.current += dt;
    const blend = 1 - Math.exp(-3 * dt);
    g.rotation.y += (pointer.x * 0.28 + Math.sin(time.current * 0.22) * 0.18 - g.rotation.y) * blend;
    g.rotation.x += (pointer.y * 0.12 - g.rotation.x) * blend;
    g.rotation.z = Math.sin(time.current * 0.25) * 0.06;
  });
  return <group ref={group}>
    <mesh rotation={[0.4, 0.3, -0.5]}>
      <torusKnotGeometry args={[1.15, 0.24, 180, 20, 2, 3]} />
      <meshPhysicalMaterial color={palette.red} metalness={0.18} roughness={0.22} clearcoat={1} clearcoatRoughness={0.2} />
    </mesh>
    <mesh position={[0.55, -0.75, -0.6]} rotation={[0.8, -0.3, 0.6]}>
      <torusGeometry args={[1.45, 0.11, 16, 100]} />
      <meshStandardMaterial color={palette.mint} metalness={0.3} roughness={0.38} />
    </mesh>
    <Environment resolution={128}>
      <Lightformer intensity={3} position={[0, 4, 3]} scale={[8, 4, 1]} />
      <Lightformer intensity={2} color={palette.mint} position={[-4, 1, 2]} rotation-y={Math.PI / 2} scale={[5, 5, 1]} />
      <Lightformer intensity={2} position={[4, -1, 3]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} />
    </Environment>
  </group>;
}

export default function BrandSculpture() {
  const [palette, setPalette] = useState<Palette>();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const resolve = (name: string) => {
      const probe = document.createElement("span");
      probe.style.color = css.getPropertyValue(name);
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      // Browsers can return oklch; normalize through a canvas to sRGB for Three.
      const context = document.createElement("canvas").getContext("2d");
      if (!context) return color;
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
      return new Color(`rgb(${r},${g},${b})`).getStyle();
    };
    setPalette({ red: resolve("--primary"), mint: resolve("--mint"), paper: resolve("--background") });
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (!palette) return null;
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6.5], fov: 40 }} gl={{ alpha: true, antialias: true }} frameloop={reduced ? "demand" : "always"}>
    <ambientLight intensity={0.8} />
    <directionalLight position={[3, 5, 4]} intensity={2} />
    <Sculpture palette={palette} reduced={reduced} />
  </Canvas>;
}