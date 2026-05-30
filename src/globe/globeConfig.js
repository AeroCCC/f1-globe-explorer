export const globeConfig = {
  camera: {
    position: [0, 0.1, 6.05],
    fov: 42,
  },
  initialRotation: [0.04, 2.85, 0],
  controls: {
    enablePan: false,
    enableDamping: true,
    dampingFactor: 0.055,
    rotateSpeed: 0.58,
    zoomSpeed: 0.75,
    minDistance: 3.2,
    maxDistance: 8,
  },
  textures: {
    color: '/textures/earth-day.jpg',
    bump: '/textures/earth-bump.jpg',
    clouds: '/textures/earth-clouds.png',
  },
}

export function getCameraPositionForViewport(width, height) {
  const aspect = width / height

  if (aspect < 0.7) {
    return [0, 0.05, 14.2]
  }

  if (aspect < 1.1) {
    return [0, 0.08, 7.4]
  }

  return [0, 0.1, 6.05]
}

export function getGlobeScaleForViewport(width, height) {
  const aspect = width / height

  if (aspect < 0.7) {
    return 0.58
  }

  if (aspect < 1.1) {
    return 0.82
  }

  return 1
}
