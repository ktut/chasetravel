import type { SearchData, Hotel } from '@/types/search'

export function getMockHotelResults(searchData: SearchData): Hotel[] {
  // Extract search parameters
  const location = searchData.location
  // Future enhancement: use searchData.checkIn, checkOut, passengers for filtering

  // Hotel names and amenities
  const hotelPrefixes = ['Grand', 'Royal', 'Luxury', 'Riverside', 'Downtown', 'Seaside', 'Mountain View', 'Plaza', 'Imperial', 'Sunset']
  const hotelSuffixes = ['Hotel', 'Resort', 'Inn', 'Suites', 'Lodge']
  const amenitiesList = [
    ['Free WiFi', 'Pool', 'Gym', 'Spa'],
    ['Free WiFi', 'Restaurant', 'Bar', 'Room Service'],
    ['Free WiFi', 'Pool', 'Beach Access', 'Parking'],
    ['Free WiFi', 'Gym', 'Business Center', 'Restaurant'],
    ['Pool', 'Spa', 'Restaurant', 'Concierge'],
    ['Free WiFi', 'Parking', 'Pet Friendly', 'Gym']
  ]

  // Mock hotel images (using placeholder service)
  const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1549294413-26f195200c16?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop'
  ]

  const results: Hotel[] = []

  // Generate 6-10 mock hotels
  const numHotels = Math.floor(Math.random() * 5) + 6

  for (let i = 0; i < numHotels; i++) {
    const prefix = hotelPrefixes[Math.floor(Math.random() * hotelPrefixes.length)]
    const suffix = hotelSuffixes[Math.floor(Math.random() * hotelSuffixes.length)]
    const stars = Math.floor(Math.random() * 3) + 3 // 3-5 stars
    const rating = (Math.random() * 2 + 7).toFixed(1) // 7.0-9.0 rating
    const reviewCount = Math.floor(Math.random() * 1500) + 100
    const pricePerNight = Math.floor(Math.random() * 350) + 100 // $100-$450 per night

    // Extract location name
    const locationName = location?.split(',')[0] || 'City Center'

    results.push({
      id: i + 1,
      name: `${prefix} ${suffix}`,
      location: locationName,
      stars,
      rating: parseFloat(rating),
      reviewCount,
      pricePerNight,
      image: hotelImages[i % hotelImages.length],
      amenities: amenitiesList[Math.floor(Math.random() * amenitiesList.length)]
    })
  }

  // Sort by rating (highest first)
  results.sort((a, b) => b.rating - a.rating)

  return results
}
