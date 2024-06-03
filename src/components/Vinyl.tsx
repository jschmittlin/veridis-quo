import { useRef, FC } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import * as THREE from "three"

interface VinylProps {
    name: string,
    isActive: boolean,
    originalPosition: [number, number, number],
    originalRotation: [number, number, number],
    stickerCover: string,
    onClick: (name: string) => void,
}


export const Vinyl: FC<VinylProps> = ({ name, isActive, originalPosition, originalRotation, stickerCover, onClick }) => {
    const { nodes, materials } = useGLTF('/veridis-quo/models/vinyl.glb') as unknown as { 
        nodes: { Vinyl: THREE.Mesh}
        materials: { sticker: THREE.MeshBasicMaterial }
    }

    const texture = useTexture("/veridis-quo/" + stickerCover)

    const stickerMaterial = materials.sticker.clone();
    stickerMaterial.map = texture;
    stickerMaterial.needsUpdate = true;

    const groupRef = useRef<THREE.Group>(null);

    const { position, rotation } = useSpring({
        from: { 
            position: originalPosition,
            rotation: originalRotation
        },
        to: isActive ? [
            { position: [1, 5, 0], rotation: [2 * Math.PI, Math.PI, Math.PI / -5] },
            { position: [1, 1, 0], rotation: [2 * Math.PI, Math.PI, 0] }
        ] : { position: originalPosition, rotation: originalRotation },
        config: { 
            mass: 3, tension: 350, friction: 50
        }
    })

    useFrame(() => {
        if (groupRef.current) {
            if (isActive) {
                groupRef.current.rotation.y -= 0.01
            }
        }
    })

    const handlePointerOver = () => {
        document.body.style.cursor = 'pointer';
        if (groupRef.current)
            groupRef.current.scale.set(1.05, 1.02, 1.05);
    }

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
        if (groupRef.current)
            groupRef.current.scale.set(1, 1, 1);
    }

    return (
        <a.group
            ref={groupRef}
            dispose={null}
            position={position}
            rotation={rotation as any}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={() => onClick(name)}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Vinyl.geometry}
                material={stickerMaterial}
                scale={[10, 10, 10]}
            />
        </a.group>
    )
}

useGLTF.preload('/veridis-quo/models/vinyl.glb')