import { useMemo } from 'react'
import { AdditiveBlending } from 'three'
import { latLngToVector3 } from './geo'
import { GlobeTooltip } from './GlobeTooltip'

export function GlobeMarker({ circuit, selected, hovered, onHover, onSelect }) {
  const position = useMemo(
    () => latLngToVector3(circuit.latitude, circuit.longitude, selected ? 2.072 : 2.058),
    [circuit.latitude, circuit.longitude, selected],
  )

  return (
    <group position={position}>
      {selected ? (
        <mesh>
          <sphereGeometry args={[0.095, 32, 32]} />
          <meshBasicMaterial
            color="#e10600"
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ) : null}

      <mesh
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
        <sphereGeometry args={[selected ? 0.045 : 0.032, 24, 24]} />
        <meshBasicMaterial color={selected ? '#ff2f45' : '#f7fbff'} />
      </mesh>

      <mesh>
        <sphereGeometry args={[selected ? 0.066 : 0.046, 24, 24]} />
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
