import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { latLngToVector3 } from './geo'
import { GlobeTooltip } from './GlobeTooltip'
import { getMarkerVisualState } from './markerVisuals'

export function GlobeMarker({ circuit, selected, hovered, onHover, onSelect }) {
  const coreRef = useRef()
  const haloRef = useRef()
  const ringRef = useRef()
  const position = useMemo(
    () => latLngToVector3(circuit.latitude, circuit.longitude, selected ? 2.072 : 2.058),
    [circuit.latitude, circuit.longitude, selected],
  )

  useFrame(({ clock }) => {
    const visual = getMarkerVisualState({ selected, hovered, elapsed: clock.elapsedTime })

    if (coreRef.current) {
      const scale = visual.coreRadius / 0.032
      coreRef.current.scale.setScalar(scale)
    }

    if (haloRef.current) {
      const scale = visual.haloRadius / 0.046
      haloRef.current.scale.setScalar(scale)
      haloRef.current.material.opacity = visual.haloOpacity
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(visual.ringScale)
      ringRef.current.material.opacity = visual.ringOpacity
    }
  })

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshBasicMaterial
          color="#e10600"
          transparent
          opacity={selected ? 0.2 : 0}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh
        ref={coreRef}
        userData={{ circuitId: circuit.circuitId }}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(circuit.circuitId)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          onHover(circuit.circuitId)
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          onHover(null)
        }}
      >
        <sphereGeometry args={[0.032, 24, 24]} />
        <meshBasicMaterial color={selected ? '#ff2f45' : '#f7fbff'} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[0.046, 24, 24]} />
        <meshBasicMaterial
          color={selected ? '#ff2f45' : '#5ab8ff'}
          transparent
          opacity={selected ? 0.32 : 0.18}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {hovered || selected ? <GlobeTooltip circuit={circuit} /> : null}
    </group>
  )
}
