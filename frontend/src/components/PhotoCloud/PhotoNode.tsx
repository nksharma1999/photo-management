import { a } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { useState } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";
type Props = {
  texture: string;
  position: [number, number, number];
  onClick: (src: string, pos: [number, number, number]) => void;
  highlight: boolean;
};

export const PhotoNode = ({ texture, position, onClick, highlight }: Props) => {
  const tex = useLoader(TextureLoader, texture);
  //   tex.colorSpace = THREE.SRGBColorSpace;

  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {hovered && (
        <mesh scale={[2.3, 1.8, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#4fd1ff" transparent opacity={0.4} />
        </mesh>
      )}

      <a.mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(texture, position)}
      >
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial
          color={highlight ? "white" : "#555"}
          map={tex}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </a.mesh>
    </group>
  );
};
