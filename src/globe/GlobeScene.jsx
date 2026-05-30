import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Preload, Stars, useTexture } from '@react-three/drei'
import { AdditiveBlending, BackSide } from 'three'
import {
  getCameraPositionForViewport,
  getGlobeScaleForViewport,
  globeConfig,
} from './globeConfig'
import { GlobeMarker } from './GlobeMarker'
import { getFocusedGlobeRotation } from './geo'

function Earth({ circuits, selectedCircuitId, hoveredCircuitId, onHoverCircuit, onSelectCircuit }) {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const { size } = useThree()
  const globeScale = getGlobeScaleForViewport(size.width, size.height)
  const selectedCircuit = useMemo(
    () => circuits.find((circuit) => circuit.circuitId === selectedCircuitId),
    [circuits, selectedCircuitId],
  )
  const targetRotation = useMemo(() => {
    if (!selectedCircuit) {
      return globeConfig.initialRotation
    }

    return getFocusedGlobeRotation(selectedCircuit.latitude, selectedCircuit.longitude)
  }, [selectedCircuit])
  const [initialRotation] = useState(() => targetRotation)
  const [earthMap, normalMap, cloudMap] = useTexture([
    globeConfig.textures.color,
    globeConfig.textures.bump,
    globeConfig.textures.clouds,
  ])

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.x = dampAngle(earthRef.current.rotation.x, targetRotation[0], delta, 3.8)
      earthRef.current.rotation.y = dampAngle(earthRef.current.rotation.y, targetRotation[1], delta, 3.8)
      earthRef.current.rotation.z = dampAngle(earthRef.current.rotation.z, targetRotation[2], delta, 3.8)
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.018
    }
  })

  return (
    <group ref={earthRef} rotation={initialRotation} scale={globeScale}>
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={earthMap}
          normalMap={normalMap}
          roughness={0.72}
          metalness={0.03}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.018, 128, 128]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.035}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshBasicMaterial
          color="#5ab8ff"
          transparent
          opacity={0.13}
          side={BackSide}
          blending={AdditiveBlending}
        />
      </mesh>

      {circuits.map((circuit) => {
        const selected = circuit.circuitId === selectedCircuitId

        return (
          <GlobeMarker
            key={circuit.circuitId}
            circuit={circuit}
            selected={selected}
            hovered={selected || circuit.circuitId === hoveredCircuitId}
            onHover={onHoverCircuit}
            onSelect={onSelectCircuit}
          />
        )
      })}
    </group>
  )
}

function dampAngle(current, target, delta, lambda) {
  const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current))
  return current + diff * (1 - Math.exp(-lambda * delta))
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <hemisphereLight args={['#8fcfff', '#08101f', 1.35]} />
      <directionalLight position={[4.5, 2.2, 5]} intensity={3.1} />
      <pointLight position={[-3.5, -2.4, -4]} color="#2f6cff" intensity={0.55} />
    </>
  )
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const [x, y, z] = getCameraPositionForViewport(size.width, size.height)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.height, size.width])

  return null
}

export function GlobeScene({ circuits = [], selectedCircuitId, hoveredCircuitId, onHoverCircuit, onSelectCircuit }) {
  return (
    <Canvas
      className="globeCanvas"
      camera={globeConfig.camera}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050914']} />
      <fog attach="fog" args={['#050914', 7, 16]} />
      <SceneLights />
      <ResponsiveCamera />
      <Stars radius={90} depth={48} count={1800} factor={3.2} saturation={0} fade speed={0.35} />

      <Suspense fallback={null}>
        <Earth
          circuits={circuits}
          selectedCircuitId={selectedCircuitId}
          hoveredCircuitId={hoveredCircuitId}
          onHoverCircuit={onHoverCircuit}
          onSelectCircuit={onSelectCircuit}
        />
        <Preload all />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enablePan={globeConfig.controls.enablePan}
        enableDamping={globeConfig.controls.enableDamping}
        dampingFactor={globeConfig.controls.dampingFactor}
        rotateSpeed={globeConfig.controls.rotateSpeed}
        zoomSpeed={globeConfig.controls.zoomSpeed}
        minDistance={globeConfig.controls.minDistance}
        maxDistance={globeConfig.controls.maxDistance}
      />
    </Canvas>
  )
}
