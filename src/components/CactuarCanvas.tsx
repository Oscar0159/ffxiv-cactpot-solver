import { Suspense, useMemo, useRef } from 'react';

import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { CanvasProps } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { useTheme } from '@/theme/ThemeContext';

interface CactuarModelProps {
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
}

function CactuarModel({ onPointerOver, onPointerOut }: CactuarModelProps) {
  const gltf = useGLTF('/models/cactuar_final_fantasy.glb');
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return (
    <mesh
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onPointerOver?.(e);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onPointerOut?.(e);
      }}
    >
      <primitive object={cloned} />
    </mesh>
  );
}
useGLTF.preload('/models/cactuar_final_fantasy.glb');

type CactuarCanvasProps = CanvasProps;

export default function CactuarCanvas(props: CactuarCanvasProps) {
  const { theme } = useTheme();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleHoverIn = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  };

  const handleHoverOut = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
    }
  };

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 45 }} {...props}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <ContactShadows
        color={theme === 'light' ? '#000000' : '#ffffff'}
        position={[0, -5.2, 0]}
        opacity={0.6}
        scale={10}
        blur={4}
        far={10}
      />
      <Suspense fallback={null}>
        <CactuarModel
          onPointerOver={handleHoverIn}
          onPointerOut={handleHoverOut}
        />
        <Environment preset="sunset" />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        target={[0, -1, 0]}
        enablePan={false}
        enableZoom={false}
        enableDamping
        autoRotate
      />
    </Canvas>
  );
}
