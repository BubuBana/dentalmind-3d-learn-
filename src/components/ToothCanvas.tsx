import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport, Environment, Lightformer, Html, useGLTF } from "@react-three/drei";
import { TEETH, type Tooth } from "@/lib/teeth";
import { getModelSource } from "@/lib/models";
import { buildCrownGeometry, buildRootGeometries, cuspPoints, groovePaths } from "@/lib/toothMesh";
import { buildArchCurve, getArchSlot, getArchTeeth, mesialDirection } from "@/lib/toothArch";

export type ViewKey = "buccal" | "oral" | "mesial" | "distal" | "occlusal" | "apical";

export interface Highlights {
  cusps: boolean;
  roots: boolean;
  surfaces: boolean;
  fissures: boolean;
}

export interface OrbitState {
  az: number;
  pol: number;
  dist: number;
}

export interface ToothCanvasProps {
  tooth: Tooth;
  view: ViewKey;
  highlights: Highlights;
  showLandmarks: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  autoSpin: boolean;
  showArch: boolean;
  onOrientation: (code: string) => void;
  orbit?: OrbitState | null;
  onOrbit?: (o: OrbitState) => void;
}

const VIEW_DIR: Record<ViewKey, [number, number, number]> = {
  buccal: [0, 0.15, 1],
  oral: [0, 0.15, -1],
  mesial: [1, 0.15, 0],
  distal: [-1, 0.15, 0],
  occlusal: [0, 1, 0.0001],
  apical: [0, -1, 0.0001],
};

/** local axes -> orientation letters (mesial = +x, vestibular = +z, occlusal = +y) */
function axisCodes(tooth: Tooth) {
  const mesial = mesialDirection(tooth.side);
  return [
    { dir: new THREE.Vector3(mesial, 0, 0), code: "M" },
    { dir: new THREE.Vector3(-mesial, 0, 0), code: "D" },
    { dir: new THREE.Vector3(0, 0, 1), code: "V" },
    { dir: new THREE.Vector3(0, 0, -1), code: tooth.arch === "upper" ? "P" : "L" },
    { dir: new THREE.Vector3(0, 1, 0), code: "O/I" },
    { dir: new THREE.Vector3(0, -1, 0), code: "A" },
  ];
}

function viewDirection(view: ViewKey, tooth: Tooth): [number, number, number] {
  if (view === "mesial") return [mesialDirection(tooth.side), 0.15, 0];
  if (view === "distal") return [-mesialDirection(tooth.side), 0.15, 0];
  return VIEW_DIR[view];
}

function ToothBody({ tooth, highlights }: { tooth: Tooth; highlights: Highlights }) {
  const g = tooth.geometry;
  const crown = React.useMemo(() => buildCrownGeometry(g), [g]);
  const roots = React.useMemo(() => buildRootGeometries(g), [g]);
  const cusps = React.useMemo(() => cuspPoints(g), [g]);
  const grooves = React.useMemo(() => groovePaths(g), [g]);

  React.useEffect(() => {
    return () => {
      crown.dispose();
      roots.forEach((r) => r.geometry.dispose());
    };
  }, [crown, roots]);

  const grooveGeoms = React.useMemo(
    () =>
      grooves
        .filter((path) => path.length > 1)
        .map((path) => {
          const curve = new THREE.CatmullRomCurve3(path.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
          return new THREE.TubeGeometry(curve, Math.max(8, path.length * 2), 0.012, 6, false);
        }),
    [grooves],
  );

  React.useEffect(() => () => grooveGeoms.forEach((geo) => geo.dispose()), [grooveGeoms]);

  return (
    <group>
      <mesh geometry={crown} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f3eee2"
          roughness={0.32}
          metalness={0}
          clearcoat={0.55}
          clearcoatRoughness={0.3}
          sheen={0.4}
          sheenColor="#fffaf0"
          sheenRoughness={0.6}
        />
      </mesh>

      {roots.map((r, i) => (
        <mesh key={i} geometry={r.geometry} position={r.position} castShadow>
          <meshPhysicalMaterial
            color={highlights.roots ? "#0d9488" : "#e3d2ad"}
            roughness={0.62}
            metalness={0}
            clearcoat={0.2}
            emissive={highlights.roots ? "#0d9488" : "#000000"}
            emissiveIntensity={highlights.roots ? 0.25 : 0}
          />
        </mesh>
      ))}

      {highlights.cusps &&
        cusps.map((p, i) => (
          <mesh key={`c${i}`} position={p}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
          </mesh>
        ))}

      {highlights.fissures &&
        grooveGeoms.map((geo, i) => (
          <mesh key={`g${i}`} geometry={geo}>
            <meshStandardMaterial color="#134e4a" emissive="#134e4a" emissiveIntensity={0.35} />
          </mesh>
        ))}

      {highlights.surfaces && <SurfacePatches tooth={tooth} />}
    </group>
  );
}

function GhostTooth({ tooth }: { tooth: Tooth }) {
  const crown = React.useMemo(() => buildCrownGeometry(tooth.geometry), [tooth.geometry]);
  const roots = React.useMemo(() => buildRootGeometries(tooth.geometry), [tooth.geometry]);

  React.useEffect(() => {
    return () => {
      crown.dispose();
      roots.forEach((root) => root.geometry.dispose());
    };
  }, [crown, roots]);

  return (
    <group>
      <mesh geometry={crown} renderOrder={1}>
        <meshPhysicalMaterial
          color="#5fb8ad"
          transparent
          opacity={0.13}
          roughness={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={crown} renderOrder={2}>
        <meshBasicMaterial color="#0f766e" transparent opacity={0.2} wireframe depthWrite={false} />
      </mesh>
      {roots.map((root, index) => (
        <group key={index} position={root.position}>
          <mesh geometry={root.geometry} renderOrder={1}>
            <meshPhysicalMaterial
              color="#79c8bf"
              transparent
              opacity={0.1}
              roughness={0.65}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh geometry={root.geometry} renderOrder={2}>
            <meshBasicMaterial color="#0f766e" transparent opacity={0.16} wireframe depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DentalArchContext({ tooth }: { tooth: Tooth }) {
  const archTeeth = React.useMemo(() => getArchTeeth(TEETH, tooth.arch), [tooth.arch]);
  const archCurve = React.useMemo(() => buildArchCurve(TEETH, tooth.arch), [tooth.arch]);
  const curveGeometry = React.useMemo(() => new THREE.TubeGeometry(archCurve, 72, 0.035, 8, false), [archCurve]);

  React.useEffect(() => () => curveGeometry.dispose(), [curveGeometry]);

  return (
    <group>
      <mesh geometry={curveGeometry} position-y={-0.04} renderOrder={0}>
        <meshBasicMaterial color="#0d9488" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {archTeeth
        .filter((neighbor) => neighbor.fdi !== tooth.fdi)
        .map((neighbor) => {
          const slot = getArchSlot(neighbor);
          return (
            <group
              key={neighbor.fdi}
              position={slot.position}
              rotation-y={slot.rotationY}
              scale-x={-mesialDirection(neighbor.side)}
            >
              <GhostTooth tooth={neighbor} />
            </group>
          );
        })}
    </group>
  );
}

function SurfacePatches({ tooth }: { tooth: Tooth }) {
  const g = tooth.geometry;
  const y = g.crownHeight * 0.5;
  const rx = g.crownWidth / 2;
  const rz = g.depth / 2;
  const upper = tooth.arch === "upper";
  const mesial = -1; // local frame; the parent group mirrors the tooth to the patient side
  const faces: Array<{ code: string; color: string; pos: [number, number, number]; rot: [number, number, number] }> = [
    { code: "V", color: "#0d9488", pos: [0, y, rz * 1.08], rot: [0, 0, 0] },
    { code: upper ? "P" : "L", color: "#6366f1", pos: [0, y, -rz * 1.08], rot: [0, Math.PI, 0] },
    { code: "M", color: "#f59e0b", pos: [mesial * rx * 1.08, y, 0], rot: [0, mesial * Math.PI / 2, 0] },
    { code: "D", color: "#ef4444", pos: [-mesial * rx * 1.08, y, 0], rot: [0, -mesial * Math.PI / 2, 0] },
  ];
  return (
    <group>
      {faces.map((f) => (
        <mesh key={f.code} position={f.pos} rotation={f.rot}>
          <circleGeometry args={[Math.min(rx, rz) * 0.85, 32]} />
          <meshBasicMaterial color={f.color} transparent opacity={0.42} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {faces.map((f) => (
        <Html key={`l${f.code}`} position={f.pos} center distanceFactor={6}>
          <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">{f.code}</span>
        </Html>
      ))}
    </group>
  );
}

function Landmarks({
  tooth,
  selected,
  onSelect,
}: {
  tooth: Tooth;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const g = tooth.geometry;
  const top = g.crownHeight * 1.1;
  const bottom = -g.rootLength * 1.35;
  return (
    <group>
      {tooth.landmarks.map((l) => {
        const x = l.x * (g.crownWidth / 2) * 1.1;
        const z = l.z * (g.depth / 2) * 1.15;
        const y = top + ((l.y + 1) / 2) * (bottom - top);
        const active = selected === l.id;
        return (
          <mesh
            key={l.id}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(active ? null : l.id);
            }}
          >
            <sphereGeometry args={[active ? 0.075 : 0.05, 18, 18]} />
            <meshStandardMaterial
              color={active ? "#0f766e" : "#0d9488"}
              emissive={active ? "#0d9488" : "#000000"}
              emissiveIntensity={active ? 0.6 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Rig({
  tooth,
  view,
  autoSpin,
  showArch,
  onOrientation,
  orbit,
  onOrbit,
}: {
  tooth: Tooth;
  view: ViewKey;
  autoSpin: boolean;
  showArch: boolean;
  onOrientation: (c: string) => void;
  orbit?: OrbitState | null;
  onOrbit?: (o: OrbitState) => void;
}) {
  const controls = React.useRef<React.ComponentRef<typeof OrbitControls> | null>(null);
  const { camera } = useThree();
  const target = React.useRef(new THREE.Vector3());
  const animating = React.useRef(false);
  const lastCode = React.useRef("");
  const codes = React.useMemo(() => axisCodes(tooth), [tooth]);
  const dist = React.useMemo(
    () => (showArch ? 8.2 : 3.2 + tooth.geometry.rootLength * 0.9),
    [showArch, tooth.geometry.rootLength],
  );
  const centerY = React.useMemo(
    () => (tooth.geometry.crownHeight * 1.2 - tooth.geometry.rootLength * 1.35) / 2,
    [tooth.geometry],
  );

  React.useEffect(() => {
    const d = viewDirection(view, tooth);
    target.current.set(d[0], d[1], d[2]).normalize().multiplyScalar(dist).add(new THREE.Vector3(0, centerY, 0));
    animating.current = true;
  }, [view, dist, centerY, tooth]);

  React.useEffect(() => {
    if (!orbit || !controls.current) return;
    const c = controls.current;
    if (
      Math.abs(c.getAzimuthalAngle() - orbit.az) < 0.001 &&
      Math.abs(c.getPolarAngle() - orbit.pol) < 0.001 &&
      Math.abs(c.getDistance() - orbit.dist) < 0.005
    )
      return;
    c.setAzimuthalAngle(orbit.az);
    c.setPolarAngle(orbit.pol);
    camera.position.setLength(orbit.dist);
    c.update();
  }, [orbit, camera]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (animating.current) {
      camera.position.lerp(target.current, Math.min(1, delta * 6));
      if (camera.position.distanceTo(target.current) < 0.02) {
        camera.position.copy(target.current);
        animating.current = false;
      }
      c?.update();
    } else if (autoSpin && c) {
      c.setAzimuthalAngle(c.getAzimuthalAngle() + delta * 0.45);
      c.update();
    }

    const dir = camera.position.clone().sub(new THREE.Vector3(0, centerY, 0)).normalize();
    let best = codes[0]!;
    let bestDot = -2;
    for (const a of codes) {
      const d = a.dir.dot(dir);
      if (d > bestDot) {
        bestDot = d;
        best = a;
      }
    }
    if (best.code !== lastCode.current) {
      lastCode.current = best.code;
      onOrientation(best.code);
    }
  });

  return (
    <OrbitControls
      ref={controls}
      target={[0, centerY, 0]}
      enablePan={false}
      minDistance={1.6}
      maxDistance={12}
      dampingFactor={0.12}
      onChange={() => {
        const c = controls.current;
        if (!c || !onOrbit) return;
        onOrbit({ az: c.getAzimuthalAngle(), pol: c.getPolarAngle(), dist: c.getDistance() });
      }}
    />
  );
}

function GltfTooth({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url);
  const cloned = React.useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

export default function ToothCanvas(props: ToothCanvasProps) {
  const { tooth, highlights, showLandmarks, selected, onSelect } = props;
  const src = getModelSource(tooth.fdi);
  const selectedSlot = React.useMemo(() => getArchSlot(tooth), [tooth]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 4.2], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#eef6f5"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 6, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#cfe9e6" />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={1} color="#bfe4de" position={[-5, 1, -2]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
      </Environment>

      <group rotation-y={props.showArch ? -selectedSlot.rotationY : 0}>
        <group position={props.showArch ? selectedSlot.position.map((value) => -value) as [number, number, number] : [0, 0, 0]}>
          {props.showArch && <DentalArchContext tooth={tooth} />}
          <group
            position={props.showArch ? selectedSlot.position : [0, 0, 0]}
            rotation-y={props.showArch ? selectedSlot.rotationY : 0}
            scale-x={-mesialDirection(tooth.side)}
          >
            <React.Suspense fallback={null}>
              {src ? <GltfTooth url={src.url} scale={src.scale ?? 1} /> : <ToothBody tooth={tooth} highlights={highlights} />}
            </React.Suspense>
            {showLandmarks && <Landmarks tooth={tooth} selected={selected} onSelect={onSelect} />}
          </group>
        </group>
      </group>

      <Rig
        tooth={props.tooth}
        view={props.view}
        autoSpin={props.autoSpin}
        showArch={props.showArch}
        onOrientation={props.onOrientation}
        {...(props.orbit ? { orbit: props.orbit } : {})}
        {...(props.onOrbit ? { onOrbit: props.onOrbit } : {})}
      />

      <GizmoHelper alignment="bottom-right" margin={[64, 64]}>
        <GizmoViewport axisColors={["#f59e0b", "#0d9488", "#2563eb"]} labels={["M", "O", "V"]} labelColor="#ffffff" />
      </GizmoHelper>
    </Canvas>
  );
}
