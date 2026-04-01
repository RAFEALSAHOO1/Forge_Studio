import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from 'react-error-boundary';

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!ctx;
  } catch {
    return false;
  }
}

interface SafeCanvasProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  className?: string;
}

export default function SafeCanvas({ fallback, children, camera, className }: SafeCanvasProps) {
  const hasWebGL = useMemo(() => checkWebGL(), []);

  if (!hasWebGL) {
    return <>{fallback}</>;
  }

  return (
    <ErrorBoundary fallbackRender={() => <>{fallback}</>}>
      <Suspense fallback={null}>
        <Canvas camera={camera} className={className}>
          {children}
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
}
