interface Flight {
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

interface SearchData {
  searchType: string
  location: string
  destination?: string | null
  checkIn: Date | null
  checkOut: Date | null
  checkInFlexibility: string
  checkOutFlexibility: string
  passengers: {
    adults: number
    children: number
    total: number
  }
}

export function getMockFlightResults(searchData: SearchData): Flight[] {
  // Extract search parameters
  const { location, destination, checkIn, passengers } = searchData

  // Generate mock flight results based on the search
  const airlines = ['United Airlines', 'Delta Air Lines', 'American Airlines', 'Southwest Airlines', 'JetBlue Airways']
  const results: Flight[] = []

  // Generate 5-8 mock flights
  const numFlights = Math.floor(Math.random() * 4) + 5

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const basePrice = 200 + Math.floor(Math.random() * 600)
    const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : 2

    // Generate departure time
    const departureHour = 6 + Math.floor(Math.random() * 16)
    const departureMin = Math.floor(Math.random() * 60)
    const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMin.toString().padStart(2, '0')}`

    // Calculate duration based on stops
    const baseDuration = 120 + Math.floor(Math.random() * 300)
    const layoverTime = stops * (60 + Math.floor(Math.random() * 60))
    const totalDuration = baseDuration + layoverTime
    const durationHours = Math.floor(totalDuration / 60)
    const durationMins = totalDuration % 60

    // Calculate arrival time
    const arrivalTotalMins = departureHour * 60 + departureMin + totalDuration
    const arrivalHour = Math.floor(arrivalTotalMins / 60) % 24
    const arrivalMin = arrivalTotalMins % 60
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`

    // Extract airport codes (last 3 chars in parentheses if they exist)
    const fromMatch = location?.match(/\(([A-Z]{3})\)/)
    const toMatch = destination?.match(/\(([A-Z]{3})\)/)
    const fromCode = fromMatch ? fromMatch[1] : 'NYC'
    const toCode = toMatch ? toMatch[1] : 'LAX'

    results.push({
      id: i + 1,
      airline,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      departure: {
        airport: fromCode,
        time: departureTime
      },
      arrival: {
        airport: toCode,
        time: arrivalTime
      },
      duration: `${durationHours}h ${durationMins}m`,
      price: basePrice * passengers.total,
      stops
    })
  }

  // Sort by price
  results.sort((a, b) => a.price - b.price)

  return results
}
