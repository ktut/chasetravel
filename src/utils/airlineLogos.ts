// Utility function to get airline logo path based on airline name
import unitedLogo from '@/assets/united-airlines-logo.png'
import deltaLogo from '@/assets/delta-airlines-logo.png'
import americanLogo from '@/assets/american-airlines-logo.png'
import southwestLogo from '@/assets/southwest-airlines-logo.png'
import jetblueLogo from '@/assets/jetblue-airways-logo.png'

const airlineLogoMap: Record<string, string> = {
  'United Airlines': unitedLogo,
  'Delta Airlines': deltaLogo,
  'Delta Air Lines': deltaLogo, // Handle both variations
  'American Airlines': americanLogo,
  'Southwest Airlines': southwestLogo,
  'JetBlue Airways': jetblueLogo
}

export function getAirlineLogo(airlineName: string): string | null {
  // First try exact match
  if (airlineLogoMap[airlineName]) {
    return airlineLogoMap[airlineName]
  }
  
  // Try case-insensitive match
  const normalizedName = airlineName.toLowerCase().trim()
  for (const [key, logo] of Object.entries(airlineLogoMap)) {
    if (key.toLowerCase() === normalizedName) {
      return logo
    }
  }
  
  return null
}

