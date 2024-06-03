import { useGLTF } from '@react-three/drei'

export function Turntable() {
  const { scene } = useGLTF('/models/turntable.glb') as any;

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

useGLTF.preload('/models/turntable.glb');