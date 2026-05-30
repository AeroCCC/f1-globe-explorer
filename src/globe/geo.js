export function latLngToVector3(lat, lng, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return [normalizeZero(x), normalizeZero(y), normalizeZero(z)]
}

export function getFocusedGlobeRotation(lat, lng) {
  const pitch = lat * (Math.PI / 180)
  const yaw = -(lng * (Math.PI / 180)) - Math.PI / 2

  return [pitch, yaw, 0]
}

function normalizeZero(value) {
  return Math.abs(value) < 1e-12 ? 0 : value
}
