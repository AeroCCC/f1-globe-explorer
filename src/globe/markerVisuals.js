export function getMarkerVisualState({ selected, hovered, elapsed }) {
  const pulse = (Math.sin(elapsed * 3.2) + 1) / 2

  if (selected) {
    return {
      coreRadius: 0.047 + pulse * 0.006,
      haloRadius: 0.074 + pulse * 0.01,
      haloOpacity: 0.34 + pulse * 0.18,
      ringScale: 1.06 + pulse * 0.32,
      ringOpacity: 0.18 + pulse * 0.2,
    }
  }

  if (hovered) {
    return {
      coreRadius: 0.038,
      haloRadius: 0.056,
      haloOpacity: 0.28,
      ringScale: 1.08,
      ringOpacity: 0.12,
    }
  }

  return {
    coreRadius: 0.032,
    haloRadius: 0.046,
    haloOpacity: 0.18,
    ringScale: 1,
    ringOpacity: 0,
  }
}
