import { useGLTF } from '@react-three/drei'

export function Room() {
  const { nodes, materials } = useGLTF('/veridis-quo/models/room.glb') as any;

  return (
    <group rotation={[0, Math.PI, 0]} scale={[5, 5, 5]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor.geometry}
        material={materials['Material.Floor']}
        position={[0, -0.05, 0]}
        scale={[5, 0.05, 5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Speaker_001.geometry}
        material={materials['Material.Speaker']}
        position={[-3.5, 1, -1.4]}
        rotation={[0, -0.523, 0]}
        scale={[0.4, 1, 0.4]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Books.geometry}
        material={materials['Material.Book']}
        position={[-3.4, 2.13, -1.4]}
        rotation={[Math.PI, -3.611, 0]}
        scale={[2, 2, 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Speaker_002.geometry}
        material={materials['Material.Speaker']}
        position={[-3.5, 1, 1.4]}
        rotation={[0, 0.523, 0]}
        scale={[0.4, 1, 0.4]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Healmet_001.geometry}
        material={materials['Material.Healmet.001']}
        position={[-3.5, 2.2, 1.4]}
        rotation={[-1.422, 2.842, -0.504]}
        scale={[0.014, 0.011, 0.014]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_001.geometry}
        material={materials['Material.Table.001']}
        position={[-2.65, 0.54, -2.77]}
        rotation={[0, 0.750, 0]}
        scale={[0.05, 0.54, 0.05]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Synth.geometry}
        material={materials['Material.Synth']}
        position={[-2.1, 0.82, -3.16]}
        rotation={[0, -0.785, 0.524]}
        scale={[0.05, 0.05, 0.05]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Healmet_002.geometry}
        material={materials['Material.Healmet.002']}
        position={[-1.3, 1.22, -3.7]}
        rotation={[1.29, 0.1, 1.2]}
        scale={[0.016, 0.015, 0.016]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_002.geometry}
        material={materials['Material.Table.002']}
        position={[1.2, 0.44, -4.2]}
        scale={[0.05, 0.44, 0.05]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Recorder.geometry}
        material={materials['Material.Recorder']}
        position={[0.65, 0.88, -3.8]}
        scale={[1.5, 1.5, 1.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_003.geometry}
        material={materials['Material.Table.003']}
        position={[-2, 0.3, 2.7]}
        rotation={[0, 0.873, 0]}
        scale={[0.4, 0.3, 0.4]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Three.geometry}
        material={materials['Material.Three']}
        position={[-1.95, 0.6, 2.7]}
        rotation={[0, -1, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Stool.geometry}
        material={materials['Material.Stool']}
        position={[0, 0, 3.5]}
        scale={[0.025, 0.025, 0.025]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bass.geometry}
        material={materials['Material.Bass']}
        position={[0.2, 0.78, 3.6]}
        rotation={[1.4, 0.35, -1.2]}
        scale={[1.7, 1.7, 1.7]}
      />
    </group>
  )
}

useGLTF.preload('/veridis-quo/models/room.glb');