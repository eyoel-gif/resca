
/// <reference types="@react-three/fiber" />
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, useTexture, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Rotate3d, ImageOff } from 'lucide-react';

// A mesh that displays the product image on a 3D slab
const ProductSlab = ({ imageUrl }: { imageUrl: string }) => {
  // Load texture from the image URL
  // We use a key in the parent to force remount, but we also ensure imageUrl is valid here
  const texture = useTexture(imageUrl);
  
  // Ensure texture encoding is correct for the lighting
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  
  return (
    /* Container for the 3D meshes using the R3F group element */
    <group>
      {/* Main slab with image */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 3, 0.15]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Add a subtle border/frame around the slab */}
      <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 0.9]}>
        <boxGeometry args={[3, 3, 0.15]} />
        <meshStandardMaterial color="#334155" wireframe />
      </mesh>
    </group>
  );
};

// Loading fallback
const Loader = () => {
  return (
    /* Placeholder mesh for loading state using intrinsic R3F elements */
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  );
};

interface ThreeDViewerProps {
  image?: string;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ image }) => {
  // Guard clause: If no image is provided, render a placeholder instead of the Canvas
  // This prevents useTexture(undefined) which crashes the app
  if (!image || image === '') {
    return (
      <div className="relative w-full aspect-square bg-surface rounded-2xl overflow-hidden border border-border group shadow-2xl shadow-black/50 flex flex-col items-center justify-center text-silver gap-2">
        <ImageOff className="w-10 h-10 opacity-50" />
        <p className="text-sm font-medium">No 3D Preview Available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-surface rounded-2xl overflow-hidden border border-border group shadow-2xl shadow-black/50">
      
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        {/* Attach background fog to the scene using the fog intrinsic element */}
        <fog attach="fog" args={['#1E293B', 5, 20]} />
        
        {/* Environment / Lighting setup using standard R3F light components */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.5} 
          penumbra={1} 
          intensity={2} 
          castShadow 
          shadow-mapSize={1024}
        />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#F97316" />

        {/* Content */}
        <Suspense fallback={<Loader />}>
          <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={0.5} 
            floatingRange={[-0.1, 0.1]}
          >
            <ProductSlab key={image} imageUrl={image} />
          </Float>
        </Suspense>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.6} 
          scale={10} 
          blur={2.5} 
          far={4} 
          color="#000000"
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* Background stars for that "Void" aesthetic */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-mono text-copper border border-copper/30 px-2 py-1 rounded bg-copper/10 backdrop-blur-md">
          LIVE 3D PREVIEW
        </span>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100">
         <Rotate3d className="w-4 h-4 text-copper animate-spin-slow" /> 
         <span className="text-white text-xs font-medium tracking-wide">
           Drag to Rotate
         </span>
      </div>
    </div>
  );
};

export default ThreeDViewer;