import type { SearchData, Flight, FlightPair } from '@/types/search'
import { LOCATIONS } from '@/constants'

export function getMockFlightResults(searchData: SearchData): Flight[] | FlightPair[] {
  // Extract search parameters
  const location = searchData.location
  const destination = searchData.destination
  const passengers = searchData.passengers
  // Future enhancement: use searchData.checkIn for filtering by date

  // Generate mock flight results based on the search
  const airlines = ['United Airlines', 'Delta Airlines', 'American Airlines', 'Southwest Airlines', 'JetBlue Airways']
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

    // Extract airport codes by looking up location names in LOCATIONS
    const fromLocation = LOCATIONS.find(loc => loc.name === location)
    const toLocation = LOCATIONS.find(loc => loc.name === destination)
    const fromCode = fromLocation ? fromLocation.code : 'NYC'
    const toCode = toLocation ? toLocation.code : 'LAX'

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

  // If round-trip, pair outbound and return flights
  if (searchData.tripType === 'round-trip') {
    const pairs: FlightPair[] = []

    // For each outbound flight, create a return flight
    results.forEach((outboundFlight, index) => {
      // Generate return flight (swap departure and arrival airports)
      const returnFlight: Flight = {
        ...outboundFlight,
        id: outboundFlight.id + 1000, // Different ID for return flight
        departure: {
          airport: outboundFlight.arrival.airport,
          time: outboundFlight.departure.time // Similar time for return
        },
        arrival: {
          airport: outboundFlight.departure.airport,
          time: outboundFlight.arrival.time
        }
      }

      pairs.push({
        id: index + 1,
        outbound: outboundFlight,
        return: returnFlight,
        totalPrice: outboundFlight.price + returnFlight.price
      })
    })

    return pairs
  }

  return results
}
