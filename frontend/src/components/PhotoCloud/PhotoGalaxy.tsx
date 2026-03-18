import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhotoNode } from "./PhotoNode";
import { photos } from "../../data/photos";
import {
  generateClusters,
  type ClusterMode,
} from "../../utils/generateClusters";
// import ClusterLabel from "./ClusterLabel";

type Props = {
  mode: ClusterMode;
  onSelect: (img: string, pos: [number, number, number]) => void;
  search: string;
};

export default function PhotoGalaxy({ mode, onSelect, search }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const clustered = generateClusters(photos, mode);

  const filtered = clustered.map((photo) => ({
    ...photo,
    highlight:
      photo.person.toLowerCase().includes(search.toLowerCase()) ||
      photo.location.toLowerCase().includes(search.toLowerCase()),
  }));
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {filtered.map((photo) => (
        <PhotoNode
          key={photo.id}
          texture={photo.src}
          position={photo.position}
          onClick={onSelect}
          highlight={photo.highlight}
        />
      ))}
      
      {/* {filtered.map((cluster) => (
        <ClusterLabel
          key={cluster.id}
          text={cluster.person}
          position={cluster.position}
        />
      ))} */}
    </group>
  );
}
