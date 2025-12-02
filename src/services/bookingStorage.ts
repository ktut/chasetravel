/**
 * Centralized service for managing booking data in sessionStorage
 */

import type { Flight, FlightPair, Hotel, Room, SearchData } from '@/types/search'

export interface BookingData {
  searchData: SearchData
  flight?: Flight
  outboundFlight?: Flight
  returnFlight?: Flight
  hotel?: Hotel
  room?: Room
}

/**
 * Saves flight booking data to sessionStorage
 * @param flight - Flight object (for one-way) or FlightPair (for round-trip)
 * @param searchData - Search data associated with the booking
 */
export function saveFlightBooking(
  flight: Flight | FlightPair,
  searchData: SearchData
): void {
  try {
    const searchDataJson = JSON.stringify(searchData)
    sessionStorage.setItem('confirmationSearchData', searchDataJson)

    if ('outbound' in flight && 'return' in flight) {
      // Round-trip flight
      sessionStorage.setItem('outboundFlight', JSON.stringify(flight.outbound))
      sessionStorage.setItem('returnFlight', JSON.stringify(flight.return))
      // Clear one-way flight storage if it exists
      sessionStorage.removeItem('selectedFlight')
    } else {
      // One-way flight
      sessionStorage.setItem('selectedFlight', JSON.stringify(flight))
      // Clear round-trip flight storage if it exists
      sessionStorage.removeItem('outboundFlight')
      sessionStorage.removeItem('returnFlight')
    }
  } catch (e) {
    console.error('Error saving flight booking:', e)
    throw e
  }
}

/**
 * Saves hotel booking data to sessionStorage
 * @param hotel - Hotel object
 * @param searchData - Search data associated with the booking
 * @param room - Optional room object
 */
export function saveHotelBooking(
  hotel: Hotel,
  searchData: SearchData,
  room?: Room
): void {
  try {
    const searchDataJson = JSON.stringify(searchData)
    sessionStorage.setItem('confirmationSearchData', searchDataJson)
    sessionStorage.setItem('selectedHotel', JSON.stringify(hotel))
    
    if (room) {
      sessionStorage.setItem('selectedRoom', JSON.stringify(room))
    } else {
      sessionStorage.removeItem('selectedRoom')
    }
  } catch (e) {
    console.error('Error saving hotel booking:', e)
    throw e
  }
}

/**
 * Loads booking data from sessionStorage
 * @returns BookingData object or null if no booking data found
 */
export function loadBookingData(): BookingData | null {
  try {
    const searchDataStr = sessionStorage.getItem('confirmationSearchData')
    if (!searchDataStr) {
      return null
    }

    const searchData: SearchData = JSON.parse(searchDataStr)
    // Convert date strings back to Date objects
    searchData.checkIn = new Date(searchData.checkIn)
    searchData.checkOut = new Date(searchData.checkOut)

    const bookingData: BookingData = { searchData }

    // Check for round-trip flights first
    const outboundFlightStr = sessionStorage.getItem('outboundFlight')
    const returnFlightStr = sessionStorage.getItem('returnFlight')
    
    if (outboundFlightStr && returnFlightStr) {
      bookingData.outboundFlight = JSON.parse(outboundFlightStr)
      bookingData.returnFlight = JSON.parse(returnFlightStr)
      return bookingData
    }

    // Check for one-way flight
    const flightStr = sessionStorage.getItem('selectedFlight')
    if (flightStr) {
      bookingData.flight = JSON.parse(flightStr)
      return bookingData
    }

    // Check for hotel
    const hotelStr = sessionStorage.getItem('selectedHotel')
    if (hotelStr) {
      bookingData.hotel = JSON.parse(hotelStr)
      
      const roomStr = sessionStorage.getItem('selectedRoom')
      if (roomStr) {
        bookingData.room = JSON.parse(roomStr)
      }
      
      return bookingData
    }

    return null
  } catch (e) {
    console.error('Error loading booking data:', e)
    return null
  }
}

/**
 * Clears all booking data from sessionStorage
 */
export function clearBookingData(): void {
  sessionStorage.removeItem('selectedFlight')
  sessionStorage.removeItem('outboundFlight')
  sessionStorage.removeItem('returnFlight')
  sessionStorage.removeItem('selectedHotel')
  sessionStorage.removeItem('selectedRoom')
  sessionStorage.removeItem('confirmationSearchData')
}

