import { Html } from '@react-three/drei'

export function GlobeTooltip({ circuit }) {
  return (
    <Html center position={[0, 0.16, 0]} className="globeTooltipWrapper">
      <div className="globeTooltip">
        <strong>{circuit.displayName}</strong>
        <span>{circuit.displayGrandPrixName}</span>
      </div>
    </Html>
  )
}
