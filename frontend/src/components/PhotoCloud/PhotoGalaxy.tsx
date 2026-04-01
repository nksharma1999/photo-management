import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhotoNode } from "./PhotoNode";
import {
  generateClusters,
  type ClusterMode,
} from "../../utils/generateClusters";
import type { Photo } from "../../data/photos";
import { BaseIPForThumbnails } from "../../data/BaseIP";

type Props = {
  mode: ClusterMode;
  photos: Photo[];
  onSelect: (img: string, pos: [number, number, number]) => void;
  search: string;
};

export default function PhotoGalaxy({ mode, photos, onSelect, search }: Props) {
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
          imageUrl={BaseIPForThumbnails + photo.url+".jpg"}
          texture={BaseIPForThumbnails+photo.thumbnail}
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
