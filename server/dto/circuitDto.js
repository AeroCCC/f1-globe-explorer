export function normalizeCircuitDto(circuit = {}) {
  return {
    circuitId: circuit.circuitId ?? null,
    name: circuit.name ?? '',
    chineseName: circuit.displayName ?? circuit.chineseName ?? '',
    displayName: circuit.displayName ?? circuit.chineseName ?? '',
    grandPrixName: circuit.grandPrixName ?? '',
    displayGrandPrixName: circuit.displayGrandPrixName ?? '',
    shortGrandPrixName: circuit.shortGrandPrixName ?? '',
    shortDisplayGrandPrixName: circuit.shortDisplayGrandPrixName ?? '',
    country: circuit.country ?? '',
    displayCountry: circuit.displayCountry ?? '',
    city: circuit.city ?? '',
    region: circuit.region ?? '',
    latitude: circuit.latitude ?? null,
    longitude: circuit.longitude ?? null,
    trackType: circuit.trackType ?? '',
    trackTypeLabel: circuit.trackTypeLabel ?? '',
    lengthKm: circuit.lengthKm ?? null,
    turns: circuit.turns ?? null,
    firstGrandPrix: circuit.firstGrandPrix ?? null,
    isCurrentSeason: circuit.isCurrentSeason ?? false,
    tags: Array.isArray(circuit.tags) ? circuit.tags : [],
    overview: circuit.overview ?? '',
    characteristics: Array.isArray(circuit.characteristics) ? circuit.characteristics : [],
  }
}

export function createSuccessBody(data, meta = {}) {
  return {
    ok: true,
    data,
    meta,
  }
}

export function createErrorBody(code, message, details) {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  }
}
