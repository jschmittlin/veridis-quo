import { useGLTF } from '@react-three/drei'

export function Turntable() {
  const { scene } = useGLTF('/veridis-quo/models/turntable.glb') as any;

  return (
    <primitive 
      castShadow
      receiveShadow
      object={scene}
      scale={[14, 14, 14]}
      position={[1, 0, 0.52]}
      rotation-y={-Math.PI / 2}
    />
  );
}

useGLTF.preload('/veridis-quo/models/turntable.glb');