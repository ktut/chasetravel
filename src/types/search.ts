// Global search-related type definitions

export interface SearchData {
  searchType: 'flights' | 'hotels'
  location: string
  destination?: string
  checkIn: Date
  checkOut: Date
  checkInFlexibility: string
  checkOutFlexibility: string
  passengers: {
    adults: number
    children: number
    total: number
  }
}

export interface Flight {
  id: number
  airline: string
  flightNumber: string
  departure: {
    airport: string
    time: string
  }
  arrival: {
    airport: string
    time: string
  }
  duration: string
  price: number
  stops: number
}

export interface Hotel {
  id: number
  name: string
  location: string
  address: string
  stars: number
  rating: number
  reviewCount: number
  pricePerNight: number
  image: string
  images: string[]
  amenities: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

// URL param validation
export function validateSearchParams(query: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!query.type || !['flights', 'hotels'].includes(query.type)) {
    errors.push('Invalid or missing search type')
  }

  if (!query.from || typeof query.from !== 'string' || query.from.length === 0) {
    errors.push('Invalid or missing origin location')
  }

  if (query.type === 'flights' && (!query.to || typeof query.to !== 'string' || query.to.length === 0)) {
    errors.push('Invalid or missing destination location for flights')
  }

  // Date validation
  if (!query.checkIn) {
    errors.push('Missing check-in date')
  } else {
    const checkInDate = new Date(query.checkIn as string)
    if (isNaN(checkInDate.getTime())) {
      errors.push('Invalid check-in date format')
    }
  }

  if (!query.checkOut) {
    errors.push('Missing check-out date')
  } else {
    const checkOutDate = new Date(query.checkOut as string)
    if (isNaN(checkOutDate.getTime())) {
      errors.push('Invalid check-out date format')
    } else if (query.checkIn) {
      const checkInDate = new Date(query.checkIn as string)
      if (checkOutDate <= checkInDate) {
        errors.push('Check-out date must be after check-in date')
      }
    }
  }

  // Passenger validation
  if (!query.adults) {
    errors.push('Missing number of adults')
  } else {
    const adults = parseInt(query.adults as string)
    if (isNaN(adults) || adults < 1 || adults > 9) {
      errors.push('Invalid number of adults (must be 1-9)')
    }
  }

  // Children is optional
  if (query.children) {
    const children = parseInt(query.children as string)
    if (isNaN(children) || children < 0 || children > 9) {
      errors.push('Invalid number of children (must be 0-9)')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function parseSearchDataFromQuery(query: any): SearchData | null {
  const validation = validateSearchParams(query)
  if (!validation.valid) {
    return null
  }

  const adults = parseInt(query.adults as string)
  const children = parseInt(query.children as string) || 0

  return {
    searchType: query.type as 'flights' | 'hotels',
    location: query.from as string,
    destination: query.to as string | undefined,
    checkIn: new Date(query.checkIn as string),
    checkOut: new Date(query.checkOut as string),
    checkInFlexibility: (query.checkInFlex as string) || 'exact',
    checkOutFlexibility: (query.checkOutFlex as string) || 'exact',
    passengers: {
      adults,
      children,
      total: adults + children
    }
  }
}
