import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./PhotoCloud.css";
import PhotoGalaxy from "./PhotoGalaxy";
import { Suspense, useState } from "react";
import PreviewModal from "./PreviewModal";
import * as THREE from "three";
import type { ClusterMode } from "../../utils/generateClusters";

type CameraControllerProps = {
  target: [number, number, number] | null;
};

function CameraController({ target }: CameraControllerProps) {
  const { camera } = useThree();

  if (target) {
    camera.position.lerp(
      new THREE.Vector3(target[0], target[1] + 1, target[2] + 4),
      0.05,
    );
  }

  return null;
}

export default function PhotoCloud() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ClusterMode>("person");
  const [selected, setSelected] = useState<string | null>(null);
  const [target, setTarget] = useState<[number, number, number] | null>(null);

  const handleClick = (img: string, pos: [number, number, number]) => {
    setSelected(img);
    setTarget(pos);
  };
  return (
    <div className="photo-cloud">
      <div className="photo-cloud-header">
        <h3>3D Photo Galaxy</h3>
        <input
          className="galaxy-search"
          placeholder="Search person or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="cluster-controls">
          <button
            className={mode === "person" ? "active" : ""}
            onClick={() => setMode("person")}
          >
            People
          </button>

          <button
            className={mode === "location" ? "active" : ""}
            onClick={() => setMode("location")}
          >
            Location
          </button>

          <button
            className={mode === "timeline" ? "active" : ""}
            onClick={() => setMode("timeline")}
          >
            Timeline
          </button>
        </div>
      </div>

      <Canvas camera={{ position: [0, 5, 12] }}>
        <ambientLight intensity={1} />

        <OrbitControls />

        <Suspense fallback={null}>
          <PhotoGalaxy mode={mode} onSelect={handleClick} search={search} />
        </Suspense>
        <CameraController target={target} />
      </Canvas>

      {selected && (
        <PreviewModal image={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
