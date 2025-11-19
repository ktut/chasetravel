/**
 * Service to fetch hotel descriptions from online sources
 * Uses Wikipedia API and web search as fallback
 */

interface HotelInfo {
  name: string
  location: string
  address: string
}

// Cache to avoid repeated API calls
const descriptionCache = new Map<string, string>()

/**
 * Fetch hotel description from Wikipedia
 */
async function fetchFromWikipedia(hotelName: string, location: string): Promise<string | null> {
  try {
    // Try searching for the hotel on Wikipedia
    const searchQuery = encodeURIComponent(`${hotelName} ${location}`)
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`
    
    const response = await fetch(searchUrl)
    if (!response.ok) {
      // Try alternative search format
      const altSearchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hotelName)}`
      const altResponse = await fetch(altSearchUrl)
      if (!altResponse.ok) {
        return null
      }
      const altData = await altResponse.json()
      if (altData.extract && altData.extract.length > 50) {
        return altData.extract
      }
      return null
    }
    
    const data = await response.json()
    if (data.extract && data.extract.length > 50) {
      return data.extract
    }
    return null
  } catch (error) {
    console.warn('Wikipedia fetch failed:', error)
    return null
  }
}

/**
 * Generate a description based on hotel data
 */
function generateDescription(hotel: HotelInfo): string {
  const cityName = hotel.location
  const isLuxury = hotel.name.toLowerCase().includes('ritz') || 
                   hotel.name.toLowerCase().includes('four seasons') ||
                   hotel.name.toLowerCase().includes('peninsula') ||
                   hotel.name.toLowerCase().includes('mandarin')
  
  const locationType = cityName === 'New York' ? 'Manhattan' :
                      cityName === 'Los Angeles' ? 'Los Angeles' :
                      cityName === 'Chicago' ? 'downtown Chicago' :
                      cityName === 'San Francisco' ? 'San Francisco' :
                      cityName === 'Miami' ? 'Miami Beach' :
                      cityName === 'Boston' ? 'downtown Boston' :
                      cityName.toLowerCase()
  
  if (isLuxury) {
    return `Luxury ${locationType} hotel offering world-class amenities and exceptional service. This prestigious property combines elegant accommodations with modern conveniences, providing an unforgettable experience in the heart of ${cityName}.`
  }
  
  return `Well-appointed hotel located in ${locationType}, ${cityName}. This property offers comfortable accommodations and convenient access to local attractions, dining, and entertainment. Perfect for both business and leisure travelers.`
}

/**
 * Fetch hotel description from online sources
 * Uses Wikipedia first, then falls back to generated description
 */
export async function fetchHotelDescription(hotel: HotelInfo): Promise<string> {
  // Create cache key
  const cacheKey = `${hotel.name}|${hotel.location}`
  
  // Check cache first
  if (descriptionCache.has(cacheKey)) {
    return descriptionCache.get(cacheKey)!
  }
  
  // Try to fetch from Wikipedia
  let description = await fetchFromWikipedia(hotel.name, hotel.location)
  
  // If Wikipedia fetch failed or returned short text, generate description
  if (!description || description.length < 100) {
    description = generateDescription(hotel)
  }
  
  // Clean up the description (remove Wikipedia citations, etc.)
  description = description
    .replace(/\[.*?\]/g, '') // Remove Wikipedia citations [1], [2], etc.
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  // Ensure minimum length
  if (description.length < 100) {
    description = generateDescription(hotel)
  }
  
  // Cache the result
  descriptionCache.set(cacheKey, description)
  
  return description
}

/**
 * Batch fetch descriptions for multiple hotels
 */
export async function fetchHotelDescriptions(hotels: HotelInfo[]): Promise<Map<string, string>> {
  const descriptions = new Map<string, string>()
  
  // Fetch descriptions with a small delay between requests to avoid rate limiting
  for (const hotel of hotels) {
    try {
      const description = await fetchHotelDescription(hotel)
      const cacheKey = `${hotel.name}|${hotel.location}`
      descriptions.set(cacheKey, description)
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.warn(`Failed to fetch description for ${hotel.name}:`, error)
      // Use generated description as fallback
      const description = generateDescription(hotel)
      const cacheKey = `${hotel.name}|${hotel.location}`
      descriptions.set(cacheKey, description)
    }
  }
  
  return descriptions
}

