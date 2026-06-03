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
  lighting: {
    ambientIntensity: 0.26,
    hemisphereSky: '#9ed7ff',
    hemisphereGround: '#050914',
    hemisphereIntensity: 1.12,
    keyPosition: [5.2, 2.8, 4.7],
    keyIntensity: 3.45,
    rimPosition: [-4.5, 1.2, -3.6],
    rimColor: '#5ab8ff',
    rimIntensity: 0.9,
  },
}

export function getCameraPositionForViewport(width, height) {
  void width
  void height
  return [0, 0.1, 6.05]
}

export function getGlobeScaleForViewport(width, height) {
  void width
  void height
  return 1
}
