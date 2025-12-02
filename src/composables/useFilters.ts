import type { Flight, FlightPair, Hotel } from '@/types/search'

export interface FilterState {
  maxStops: number
  priceRange: [number, number]
  selectedAirlines: string[]
  selectedAmenities: string[]
  sortBy: 'price' | 'duration' | 'departure'
}

/**
 * Parses duration string (e.g., "2h 30m") to minutes
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

/**
 * Filters and sorts flight results
 */
export function filterFlights(
  results: (Flight | FlightPair)[],
  filters: FilterState,
  isRoundTrip: boolean
): (Flight | FlightPair)[] {
  let filtered = [...results]

  if (isRoundTrip) {
    // Handle FlightPair filtering - narrow type
    const pairs = filtered.filter((item): item is FlightPair => 'outbound' in item && 'return' in item)

    // Filter by stops (check outbound flight)
    let filteredPairs = pairs.filter(p => p.outbound.stops <= filters.maxStops)

    // Filter by airlines (check outbound flight)
    if (filters.selectedAirlines.length > 0) {
      filteredPairs = filteredPairs.filter(p =>
        filters.selectedAirlines.includes(p.outbound.airline)
      )
    }

    // Filter by price (use totalPrice)
    filteredPairs = filteredPairs.filter(p => {
      const price = Number(p.totalPrice)
      const min = Number(filters.priceRange[0])
      const max = Number(filters.priceRange[1])
      return price >= min && price <= max
    })

    // Sort
    if (filters.sortBy === 'price') {
      filteredPairs.sort((a, b) => a.totalPrice - b.totalPrice)
    } else if (filters.sortBy === 'duration') {
      filteredPairs.sort((a, b) => {
        const aDur = parseDuration(a.outbound.duration)
        const bDur = parseDuration(b.outbound.duration)
        return aDur - bDur
      })
    } else if (filters.sortBy === 'departure') {
      filteredPairs.sort((a, b) => {
        return a.outbound.departure.time.localeCompare(b.outbound.departure.time)
      })
    }

    filtered = filteredPairs as (Flight | FlightPair)[]
  } else {
    // Handle Flight filtering (one-way) - narrow type
    const flights = filtered.filter((item): item is Flight => !('outbound' in item))

    // Filter by stops
    let filteredFlights = flights.filter(f => f.stops <= filters.maxStops)

    // Filter by airlines
    if (filters.selectedAirlines.length > 0) {
      filteredFlights = filteredFlights.filter(f =>
        filters.selectedAirlines.includes(f.airline)
      )
    }

    // Filter by price
    filteredFlights = filteredFlights.filter(f => {
      const price = Number(f.price)
      const min = Number(filters.priceRange[0])
      const max = Number(filters.priceRange[1])
      return price >= min && price <= max
    })

    // Sort
    if (filters.sortBy === 'price') {
      filteredFlights.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'duration') {
      filteredFlights.sort((a, b) => {
        const aDur = parseDuration(a.duration)
        const bDur = parseDuration(b.duration)
        return aDur - bDur
      })
    } else if (filters.sortBy === 'departure') {
      filteredFlights.sort((a, b) => {
        return a.departure.time.localeCompare(b.departure.time)
      })
    }

    filtered = filteredFlights as (Flight | FlightPair)[]
  }

  return filtered
}

/**
 * Filters hotel results
 */
export function filterHotels(
  results: Hotel[],
  filters: FilterState
): Hotel[] {
  let filtered = [...results]

  // Filter by price per night
  filtered = filtered.filter((h: Hotel) => {
    const price = Number(h.pricePerNight)
    const min = Number(filters.priceRange[0])
    const max = Number(filters.priceRange[1])
    return price >= min && price <= max
  })

  // Filter by amenities
  if (filters.selectedAmenities.length > 0) {
    filtered = filtered.filter((h: Hotel) =>
      filters.selectedAmenities.every(amenity => h.amenities.includes(amenity))
    )
  }

  return filtered
}

