import type { SearchData, Hotel } from '@/types/search'

// Real hotel data for each city with authentic information
const hotelDatabase: Record<string, Omit<Hotel, 'id' | 'pricePerNight' | 'reviewCount'>[]> = {
  'New York': [
    {
      name: 'The Plaza Hotel',
      location: 'New York',
      address: '768 5th Ave, New York, NY 10019',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Free WiFi', 'Spa', 'Fine Dining', 'Concierge', 'Valet Parking', 'Butler Service', 'Champagne Bar'],
      coordinates: { lat: 40.7645, lng: -73.9744 }
    },
    {
      name: 'The St. Regis New York',
      location: 'New York',
      address: '2 E 55th St, New York, NY 10022',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Free WiFi', 'Butler Service', 'Spa', 'Fitness Center', 'Fine Dining', 'Bar', 'Room Service'],
      coordinates: { lat: 40.7614, lng: -73.9745 }
    },
    {
      name: 'The Peninsula New York',
      location: 'New York',
      address: '700 5th Ave, New York, NY 10019',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Rooftop Bar', 'Spa', 'Pool', 'Free WiFi', 'Fitness Center', 'Fine Dining', 'Valet Parking'],
      coordinates: { lat: 40.7623, lng: -73.9754 }
    },
    {
      name: 'Mandarin Oriental New York',
      location: 'New York',
      address: '80 Columbus Circle, New York, NY 10023',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Spa', 'Pool', 'Free WiFi', 'Fitness Center', 'Michelin-Star Restaurant', 'Central Park Views', 'Concierge'],
      coordinates: { lat: 40.7681, lng: -73.9819 }
    },
    {
      name: 'The Carlyle, A Rosewood Hotel',
      location: 'New York',
      address: '35 E 76th St, New York, NY 10021',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Bemelmans Bar', 'Café Carlyle', 'Spa', 'Fitness Center', 'Free WiFi', 'Concierge', 'Pet Friendly'],
      coordinates: { lat: 40.7747, lng: -73.9632 }
    },
    {
      name: 'The Ritz-Carlton New York, Central Park',
      location: 'New York',
      address: '50 Central Park S, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Central Park Views', 'Spa', 'Fine Dining', 'Club Lounge', 'Free WiFi', 'Fitness Center', 'Valet Parking'],
      coordinates: { lat: 40.7654, lng: -73.9768 }
    },
    {
      name: 'Four Seasons Hotel New York',
      location: 'New York',
      address: '57 E 57th St, New York, NY 10022',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Spa', 'Fine Dining', 'Free WiFi', 'Fitness Center', 'Bar', 'Concierge', 'Room Service'],
      coordinates: { lat: 40.7626, lng: -73.9722 }
    },
    {
      name: 'Park Hyatt New York',
      location: 'New York',
      address: '153 W 57th St, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Spa', 'Pool', 'Fine Dining', 'Free WiFi', 'Fitness Center', 'Living Room Bar', 'Art Collection'],
      coordinates: { lat: 40.7651, lng: -73.9784 }
    },
    {
      name: 'The Lowell Hotel',
      location: 'New York',
      address: '28 E 63rd St, New York, NY 10065',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Fireplaces', 'Kitchenettes', 'Pembroke Room', 'Free WiFi', 'Fitness Center', 'Concierge', 'Pet Friendly'],
      coordinates: { lat: 40.7677, lng: -73.9684 }
    },
    {
      name: 'The Beekman, A Thompson Hotel',
      location: 'New York',
      address: '123 Nassau St, New York, NY 10038',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Temple Court Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Historic Architecture', 'Atrium', 'Concierge'],
      coordinates: { lat: 40.7112, lng: -74.0058 }
    },
    {
      name: '1 Hotel Brooklyn Bridge',
      location: 'New York',
      address: '60 Furman St, Brooklyn, NY 11201',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'Farm-to-Table Dining', 'Free WiFi', 'Fitness Center', 'Brooklyn Bridge Views', 'Eco-Friendly'],
      coordinates: { lat: 40.7024, lng: -73.9931 }
    },
    {
      name: 'The Greenwich Hotel',
      location: 'New York',
      address: '377 Greenwich St, New York, NY 10013',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Shibui Spa', 'Pool', 'Italian Restaurant', 'Free WiFi', 'Fitness Center', 'Courtyard', 'Private Spaces'],
      coordinates: { lat: 40.7195, lng: -74.0097 }
    },
    {
      name: 'Baccarat Hotel New York',
      location: 'New York',
      address: '28 W 53rd St, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Spa de La Mer', 'Bar', 'Fine Dining', 'Crystal Decor', 'Free WiFi', 'Fitness Center', 'Concierge'],
      coordinates: { lat: 40.7610, lng: -73.9760 }
    },
    {
      name: 'The Mark Hotel',
      location: 'New York',
      address: '25 E 77th St, New York, NY 10075',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Jean-Georges Restaurant', 'Bar', 'Spa', 'Free WiFi', 'Fitness Center', 'Pet Friendly', 'Designer Interiors'],
      coordinates: { lat: 40.7756, lng: -73.9632 }
    },
    {
      name: 'Conrad New York Downtown',
      location: 'New York',
      address: '102 North End Ave, New York, NY 10282',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Hudson River Views', 'Restaurants', 'Bar', 'Free WiFi', 'Fitness Center', 'Concierge', 'Business Center'],
      coordinates: { lat: 40.7156, lng: -74.0157 }
    },
    {
      name: 'Crosby Street Hotel',
      location: 'New York',
      address: '79 Crosby St, New York, NY 10012',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Screening Room', 'Drawing Room', 'Terrace', 'Free WiFi', 'Fitness Center', 'Bar', 'British Design'],
      coordinates: { lat: 40.7217, lng: -73.9968 }
    },
    {
      name: 'The NoMad Hotel',
      location: 'New York',
      address: '1170 Broadway, New York, NY 10001',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['NoMad Restaurant', 'Library', 'Rooftop', 'Free WiFi', 'Fitness Center', 'Bar', 'Classic Design'],
      coordinates: { lat: 40.7453, lng: -73.9881 }
    },
    {
      name: 'The Knickerbocker',
      location: 'New York',
      address: '6 Times Square, New York, NY 10036',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Rooftop Bar', 'Charlie Palmer Restaurant', 'Free WiFi', 'Fitness Center', 'Times Square Views', 'Concierge', 'Historic Building'],
      coordinates: { lat: 40.7572, lng: -73.9868 }
    },
    {
      name: 'The Ludlow Hotel',
      location: 'New York',
      address: '180 Ludlow St, New York, NY 10002',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Dirty French Restaurant', 'Bar', 'Terrace', 'Free WiFi', 'Fitness Center', 'Lower East Side Location', 'Modern Design'],
      coordinates: { lat: 40.7213, lng: -73.9883 }
    },
    {
      name: 'The Bowery Hotel',
      location: 'New York',
      address: '335 Bowery, New York, NY 10003',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Gemma Restaurant', 'Lobby Bar', 'Free WiFi', 'Fitness Center', 'Floor-to-Ceiling Windows', 'Vintage Decor', 'Pet Friendly'],
      coordinates: { lat: 40.7267, lng: -73.9919 }
    }
  ],
  'Los Angeles': [
    {
      name: 'The Beverly Hills Hotel',
      location: 'Los Angeles',
      address: '9641 Sunset Blvd, Beverly Hills, CA 90210',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Polo Lounge', 'Spa', 'Pool', 'Cabanas', 'Free WiFi', 'Fitness Center', 'Tennis Courts'],
      coordinates: { lat: 34.0789, lng: -118.4152 }
    },
    {
      name: 'Hotel Bel-Air',
      location: 'Los Angeles',
      address: '701 Stone Canyon Rd, Los Angeles, CA 90077',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Spa', 'Pool', 'Wolfgang Puck Restaurant', 'Gardens', 'Free WiFi', 'Fitness Center', 'Swan Lake'],
      coordinates: { lat: 34.0970, lng: -118.4517 }
    },
    {
      name: 'Four Seasons Hotel Los Angeles at Beverly Hills',
      location: 'Los Angeles',
      address: '300 S Doheny Dr, Los Angeles, CA 90048',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Spa', 'Rooftop Pool', 'Culina Restaurant', 'Free WiFi', 'Fitness Center', 'Cabanas', 'Gardens'],
      coordinates: { lat: 34.0754, lng: -118.3842 }
    },
    {
      name: 'Montage Beverly Hills',
      location: 'Los Angeles',
      address: '225 N Canon Dr, Beverly Hills, CA 90210',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Spa Montage', 'Rooftop Pool', 'Fine Dining', 'Free WiFi', 'Fitness Center', 'Concierge', 'Golden Triangle Location'],
      coordinates: { lat: 34.0687, lng: -118.3996 }
    },
    {
      name: 'The Peninsula Beverly Hills',
      location: 'Los Angeles',
      address: '9882 S Santa Monica Blvd, Beverly Hills, CA 90212',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'The Belvedere Restaurant', 'Free WiFi', 'Fitness Center', 'Valet Parking', 'Gardens'],
      coordinates: { lat: 34.0667, lng: -118.4100 }
    },
    {
      name: 'Shutters on the Beach',
      location: 'Los Angeles',
      address: '1 Pico Blvd, Santa Monica, CA 90405',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Beach Access', 'Spa', 'Pool', 'One Pico Restaurant', 'Free WiFi', 'Fitness Center', 'Ocean Views'],
      coordinates: { lat: 34.0085, lng: -118.4987 }
    },
    {
      name: 'Fairmont Miramar Hotel & Bungalows',
      location: 'Los Angeles',
      address: '101 Wilshire Blvd, Santa Monica, CA 90401',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Spa', 'FIG Restaurant', 'Ocean Views', 'Free WiFi', 'Fitness Center', 'Bungalows'],
      coordinates: { lat: 34.0155, lng: -118.4995 }
    },
    {
      name: 'Sunset Tower Hotel',
      location: 'Los Angeles',
      address: '8358 Sunset Blvd, West Hollywood, CA 90069',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Tower Bar', 'Pool', 'Fitness Center', 'Free WiFi', 'Art Deco Architecture', 'Terrace', 'City Views'],
      coordinates: { lat: 34.0965, lng: -118.3770 }
    },
    {
      name: 'The London West Hollywood',
      location: 'Los Angeles',
      address: '1020 N San Vicente Blvd, West Hollywood, CA 90069',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Rooftop Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Suites', 'City Views'],
      coordinates: { lat: 34.0900, lng: -118.3844 }
    },
    {
      name: 'Chateau Marmont',
      location: 'Los Angeles',
      address: '8221 Sunset Blvd, Los Angeles, CA 90046',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Pool', 'Restaurant', 'Bar', 'Garden', 'Free WiFi', 'Bungalows', 'Historic Property'],
      coordinates: { lat: 34.0963, lng: -118.3689 }
    },
    {
      name: 'The Proper Hotel',
      location: 'Los Angeles',
      address: '1100 S Broadway, Los Angeles, CA 90015',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'Restaurants', 'Bar', 'Free WiFi', 'Fitness Center', 'Art Collection'],
      coordinates: { lat: 34.0461, lng: -118.2567 }
    },
    {
      name: 'Hotel Casa del Mar',
      location: 'Los Angeles',
      address: '1910 Ocean Way, Santa Monica, CA 90405',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Beach Access', 'Spa', 'Pool', 'Catch Restaurant', 'Free WiFi', 'Fitness Center', 'Ocean Views'],
      coordinates: { lat: 34.0096, lng: -118.4989 }
    },
    {
      name: 'Waldorf Astoria Beverly Hills',
      location: 'Los Angeles',
      address: '9850 Wilshire Blvd, Beverly Hills, CA 90210',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'Jean-Georges Restaurant', 'Free WiFi', 'Fitness Center', 'City Views', 'Concierge'],
      coordinates: { lat: 34.0644, lng: -118.4131 }
    },
    {
      name: 'The Ritz-Carlton, Los Angeles',
      location: 'Los Angeles',
      address: '900 W Olympic Blvd, Los Angeles, CA 90015',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'WP24 Restaurant', 'Free WiFi', 'Fitness Center', 'City Views', 'Club Lounge'],
      coordinates: { lat: 34.0449, lng: -118.2663 }
    },
    {
      name: 'InterContinental Los Angeles Downtown',
      location: 'Los Angeles',
      address: '900 Wilshire Blvd, Los Angeles, CA 90017',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'City Views'],
      coordinates: { lat: 34.0506, lng: -118.2598 }
    },
    {
      name: 'The LINE LA',
      location: 'Los Angeles',
      address: '3515 Wilshire Blvd, Los Angeles, CA 90010',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Rooftop Restaurant', 'Pool', 'Commissary Restaurant', 'Free WiFi', 'Fitness Center', 'Korean Spa', 'Modern Design'],
      coordinates: { lat: 34.0614, lng: -118.3091 }
    },
    {
      name: 'Ace Hotel Downtown Los Angeles',
      location: 'Los Angeles',
      address: '929 S Broadway, Los Angeles, CA 90015',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Rooftop Bar', 'LA Chapter Restaurant', 'Theater', 'Free WiFi', 'Fitness Center', 'Pool', 'Historic Building'],
      coordinates: { lat: 34.0456, lng: -118.2565 }
    },
    {
      name: 'Hotel Figueroa',
      location: 'Los Angeles',
      address: '939 S Figueroa St, Los Angeles, CA 90015',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Pool', 'Restaurants', 'Bars', 'Free WiFi', 'Fitness Center', 'Spanish Colonial Revival', 'Veranda'],
      coordinates: { lat: 34.0450, lng: -118.2622 }
    },
    {
      name: 'Freehand Los Angeles',
      location: 'Los Angeles',
      address: '416 W 8th St, Los Angeles, CA 90014',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Rooftop Bar', 'Restaurant', 'Pool', 'Free WiFi', 'Cafe', 'Exchange Workspace', 'Social Spaces'],
      coordinates: { lat: 34.0446, lng: -118.2605 }
    },
    {
      name: 'SLS Hotel at Beverly Hills',
      location: 'Los Angeles',
      address: '465 S La Cienega Blvd, Los Angeles, CA 90048',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Spa', 'Bazaar Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Philippe Starck Design'],
      coordinates: { lat: 34.0755, lng: -118.3759 }
    }
  ],
  'Chicago': [
    {
      name: 'The Peninsula Chicago',
      location: 'Chicago',
      address: '108 E Superior St, Chicago, IL 60611',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Spa', 'Pool', 'Shanghai Terrace', 'Free WiFi', 'Fitness Center', 'Afternoon Tea', 'Concierge'],
      coordinates: { lat: 41.8957, lng: -87.6251 }
    },
    {
      name: 'Four Seasons Hotel Chicago',
      location: 'Chicago',
      address: '120 E Delaware Pl, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Spa', 'Pool', 'Fine Dining', 'Lake Views', 'Free WiFi', 'Fitness Center', 'Concierge'],
      coordinates: { lat: 41.8992, lng: -87.6262 }
    },
    {
      name: 'The Langham, Chicago',
      location: 'Chicago',
      address: '330 N Wabash Ave, Chicago, IL 60611',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Chuan Spa', 'Pool', 'Travelle Restaurant', 'River Views', 'Free WiFi', 'Fitness Center', 'Afternoon Tea'],
      coordinates: { lat: 41.8880, lng: -87.6263 }
    },
    {
      name: 'The Ritz-Carlton, Chicago',
      location: 'Chicago',
      address: '160 E Pearson St, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Spa', 'Pool', 'Deca Restaurant', 'Water Tower Views', 'Free WiFi', 'Fitness Center', 'Club Lounge'],
      coordinates: { lat: 41.8979, lng: -87.6256 }
    },
    {
      name: 'Park Hyatt Chicago',
      location: 'Chicago',
      address: '800 N Michigan Ave, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Spa', 'Pool', 'NoMI Kitchen', 'Water Tower Views', 'Free WiFi', 'Fitness Center', 'Art Collection'],
      coordinates: { lat: 41.8978, lng: -87.6238 }
    },
    {
      name: 'Waldorf Astoria Chicago',
      location: 'Chicago',
      address: '11 E Walton St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Spa', 'Pool', 'Bernard\'s Bar', 'Free WiFi', 'Fitness Center', 'Gold Coast Location', 'Concierge'],
      coordinates: { lat: 41.9006, lng: -87.6265 }
    },
    {
      name: 'The Gwen, a Luxury Collection Hotel',
      location: 'Chicago',
      address: '521 N Rush St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Rooftop Terrace', 'Upstairs Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Art Deco', 'River North'],
      coordinates: { lat: 41.8920, lng: -87.6266 }
    },
    {
      name: 'Sofitel Chicago Magnificent Mile',
      location: 'Chicago',
      address: '20 E Chestnut St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Café des Architectes', 'Bar', 'Free WiFi', 'Fitness Center', 'French Design', 'Spa Services', 'City Views'],
      coordinates: { lat: 41.8981, lng: -87.6278 }
    },
    {
      name: 'Thompson Chicago',
      location: 'Chicago',
      address: '21 E Bellevue Pl, Chicago, IL 60611',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Nico Osteria', 'Rooftop Bar', 'Free WiFi', 'Fitness Center', 'Modern Design', 'Gold Coast', 'Pet Friendly'],
      coordinates: { lat: 41.8996, lng: -87.6277 }
    },
    {
      name: 'The Chicago Athletic Association',
      location: 'Chicago',
      address: '12 S Michigan Ave, Chicago, IL 60603',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Cindy\'s Rooftop', 'Cherry Circle Room', 'Game Room', 'Free WiFi', 'Fitness Center', 'Historic Building', 'Millennium Park Views'],
      coordinates: { lat: 41.8814, lng: -87.6245 }
    },
    {
      name: 'Viceroy Chicago',
      location: 'Chicago',
      address: '1118 N State St, Chicago, IL 60610',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Rooftop Bar', 'Somerset Restaurant', 'Free WiFi', 'Fitness Center', 'Gold Coast', 'Modern Design', 'City Views'],
      coordinates: { lat: 41.9034, lng: -87.6281 }
    },
    {
      name: 'The Hoxton, Chicago',
      location: 'Chicago',
      address: '200 N Green St, Chicago, IL 60607',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Cira Restaurant', 'Rooftop Bar', 'Free WiFi', 'Coffee & Pastries', 'West Loop', 'Industrial Design', 'Open Lobby'],
      coordinates: { lat: 41.8859, lng: -87.6488 }
    },
    {
      name: 'Kimpton Hotel Monaco Chicago',
      location: 'Chicago',
      address: '225 N Wabash Ave, Chicago, IL 60601',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['South Water Kitchen', 'Wine Hour', 'Free WiFi', 'Fitness Center', 'Pet Friendly', 'Bikes', 'Theater District'],
      coordinates: { lat: 41.8866, lng: -87.6259 }
    },
    {
      name: 'Hotel EMC2',
      location: 'Chicago',
      address: '228 E Ontario St, Chicago, IL 60611',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Albert Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Science Theme', 'Art Installation', 'Streeterville'],
      coordinates: { lat: 41.8933, lng: -87.6218 }
    },
    {
      name: 'Virgin Hotels Chicago',
      location: 'Chicago',
      address: '203 N Wabash Ave, Chicago, IL 60601',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Miss Ricky\'s', 'Cerise Rooftop', 'Free WiFi', 'Fitness Center', 'Modern Design', 'Loop Location', 'Commons Club'],
      coordinates: { lat: 41.8863, lng: -87.6262 }
    },
    {
      name: 'The Robey',
      location: 'Chicago',
      address: '2018 W North Ave, Chicago, IL 60647',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Café Robey', 'Rooftop Bar', 'Free WiFi', 'Wicker Park', 'Mid-Century Design', 'City Views', 'Neighborhood Location'],
      coordinates: { lat: 41.9104, lng: -87.6777 }
    },
    {
      name: 'Ace Hotel Chicago',
      location: 'Chicago',
      address: '311 N Morgan St, Chicago, IL 60607',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['City Mouse Restaurant', 'Coffee Bar', 'Free WiFi', 'Fitness Center', 'West Loop', 'Industrial Design', 'Co-Working'],
      coordinates: { lat: 41.8878, lng: -87.6518 }
    },
    {
      name: 'Freehand Chicago',
      location: 'Chicago',
      address: '19 E Ohio St, Chicago, IL 60611',
      stars: 3,
      rating: 4.1,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Broken Shaker Bar', 'Café', 'Free WiFi', 'Social Spaces', 'River North', 'Vintage Design', 'Co-Working'],
      coordinates: { lat: 41.8923, lng: -87.6279 }
    },
    {
      name: 'Hotel Lincoln',
      location: 'Chicago',
      address: '1816 N Clark St, Chicago, IL 60614',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Perennial Virant', 'J. Parker Rooftop', 'Free WiFi', 'Lincoln Park', 'Park Views', 'Bikes', 'Pet Friendly'],
      coordinates: { lat: 41.9154, lng: -87.6352 }
    },
    {
      name: 'Pendry Chicago',
      location: 'Chicago',
      address: '230 N Michigan Ave, Chicago, IL 60601',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Rooftop Bar', 'Spa', 'Pool', 'Restaurants', 'Free WiFi', 'Fitness Center', 'River Views'],
      coordinates: { lat: 41.8865, lng: -87.6243 }
    }
  ],
  'San Francisco': [
    {
      name: 'Four Seasons Hotel San Francisco',
      location: 'San Francisco',
      address: '757 Market St, San Francisco, CA 94103',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Spa', 'Pool', 'MKT Restaurant', 'Free WiFi', 'Fitness Center', 'Bay Views', 'Concierge'],
      coordinates: { lat: 37.7856, lng: -122.4053 }
    },
    {
      name: 'The Ritz-Carlton, San Francisco',
      location: 'San Francisco',
      address: '600 Stockton St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Spa', 'Parallel 37 Restaurant', 'Club Lounge', 'Free WiFi', 'Fitness Center', 'Nob Hill', 'Concierge'],
      coordinates: { lat: 37.7921, lng: -122.4106 }
    },
    {
      name: 'The St. Regis San Francisco',
      location: 'San Francisco',
      address: '125 3rd St, San Francisco, CA 94103',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Remède Spa', 'Grill Restaurant', 'Butler Service', 'Free WiFi', 'Fitness Center', 'Museum Tower', 'Art Collection'],
      coordinates: { lat: 37.7856, lng: -122.4008 }
    },
    {
      name: 'Fairmont San Francisco',
      location: 'San Francisco',
      address: '950 Mason St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Tonga Room', 'Laurel Court', 'Spa', 'Free WiFi', 'Fitness Center', 'Nob Hill', 'Historic Property'],
      coordinates: { lat: 37.7925, lng: -122.4106 }
    },
    {
      name: 'Palace Hotel, A Luxury Collection',
      location: 'San Francisco',
      address: '2 New Montgomery St, San Francisco, CA 94105',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Garden Court', 'Pied Piper Bar', 'Pool', 'Free WiFi', 'Fitness Center', 'Historic Property', 'Grand Ballroom'],
      coordinates: { lat: 37.7883, lng: -122.4011 }
    },
    {
      name: 'The Fairmont Heritage Place, Ghirardelli Square',
      location: 'San Francisco',
      address: '900 North Point St, San Francisco, CA 94109',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Bay Views', 'Full Kitchens', 'Spa', 'Pool', 'Free WiFi', 'Fitness Center', 'Ghirardelli Square'],
      coordinates: { lat: 37.8058, lng: -122.4224 }
    },
    {
      name: 'Hotel Nikko San Francisco',
      location: 'San Francisco',
      address: '222 Mason St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Pool', 'Anzu Restaurant', 'Fitness Center', 'Free WiFi', 'Union Square', 'Japanese-Inspired', 'Sauna'],
      coordinates: { lat: 37.7856, lng: -122.4094 }
    },
    {
      name: 'InterContinental Mark Hopkins',
      location: 'San Francisco',
      address: '999 California St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Top of the Mark', 'Fitness Center', 'Free WiFi', 'Nob Hill', 'Panoramic Views', 'Historic Property', 'Concierge'],
      coordinates: { lat: 37.7923, lng: -122.4115 }
    },
    {
      name: 'The Westin St. Francis',
      location: 'San Francisco',
      address: '335 Powell St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Oak Room Restaurant', 'Clock Bar', 'Free WiFi', 'Fitness Center', 'Union Square', 'Historic Property', 'City Views'],
      coordinates: { lat: 37.7877, lng: -122.4082 }
    },
    {
      name: 'The Clift Royal Sonesta Hotel',
      location: 'San Francisco',
      address: '495 Geary St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Velvet Room', 'Redwood Room', 'Free WiFi', 'Fitness Center', 'Union Square', 'Philippe Starck Design', 'Art Collection'],
      coordinates: { lat: 37.7867, lng: -122.4109 }
    },
    {
      name: 'Hotel Zephyr',
      location: 'San Francisco',
      address: '250 Beach St, San Francisco, CA 94133',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Bay Views', 'Fisherman\'s Wharf', 'Restaurant', 'Free WiFi', 'Fitness Center', 'Games', 'Nautical Theme'],
      coordinates: { lat: 37.8082, lng: -122.4152 }
    },
    {
      name: 'The Marker San Francisco',
      location: 'San Francisco',
      address: '501 Geary St, San Francisco, CA 94102',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Tratto Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Union Square', 'Theater District', 'Pet Friendly'],
      coordinates: { lat: 37.7867, lng: -122.4115 }
    },
    {
      name: 'Hotel Zelos',
      location: 'San Francisco',
      address: '12 4th St, San Francisco, CA 94103',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Dirty Habit Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'SoMa', 'Modern Design', 'Art Collection'],
      coordinates: { lat: 37.7853, lng: -122.4043 }
    },
    {
      name: 'Hotel Zetta',
      location: 'San Francisco',
      address: '55 5th St, San Francisco, CA 94103',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Cavalier Restaurant', 'Playroom', 'Free WiFi', 'Fitness Center', 'SoMa', 'Tech-Friendly', 'Games'],
      coordinates: { lat: 37.7839, lng: -122.4060 }
    },
    {
      name: 'The Proper Hotel',
      location: 'San Francisco',
      address: '1100 Market St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Villon Restaurant', 'Rooftop Bar', 'Free WiFi', 'Fitness Center', 'Mid-Market', 'Kelly Wearstler Design', 'Art Collection'],
      coordinates: { lat: 37.7815, lng: -122.4115 }
    },
    {
      name: 'Hotel Vitale',
      location: 'San Francisco',
      address: '8 Mission St, San Francisco, CA 94105',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Americano Restaurant', 'Spa', 'Bay Views', 'Free WiFi', 'Fitness Center', 'Embarcadero', 'Rooftop Soaking Tubs'],
      coordinates: { lat: 37.7937, lng: -122.3933 }
    },
    {
      name: 'Omni San Francisco',
      location: 'San Francisco',
      address: '500 California St, San Francisco, CA 94104',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Bob\'s Steak & Chop House', 'Financial District', 'Free WiFi', 'Fitness Center', 'Cable Car Access', 'Historic Building', 'Concierge'],
      coordinates: { lat: 37.7930, lng: -122.4034 }
    },
    {
      name: 'Hotel Kabuki',
      location: 'San Francisco',
      address: '1625 Post St, San Francisco, CA 94115',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Ippongi Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Japantown', 'Japanese-Inspired', 'Zen Garden'],
      coordinates: { lat: 37.7850, lng: -122.4309 }
    },
    {
      name: 'The Phoenix Hotel',
      location: 'San Francisco',
      address: '601 Eddy St, San Francisco, CA 94109',
      stars: 3,
      rating: 4.0,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Chambers Restaurant', 'Free WiFi', 'Tenderloin', 'Rock \'n\' Roll Theme', 'Murals', 'Boutique'],
      coordinates: { lat: 37.7833, lng: -122.4188 }
    },
    {
      name: 'The Line San Francisco',
      location: 'San Francisco',
      address: '1124 Market St, San Francisco, CA 94102',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Fitness Center', 'Mid-Market', 'Modern Design', 'Social Spaces'],
      coordinates: { lat: 37.7814, lng: -122.4119 }
    }
  ],
  'Miami': [
    {
      name: 'Fontainebleau Miami Beach',
      location: 'Miami',
      address: '4441 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['LIV Nightclub', 'Spa', 'Multiple Pools', 'Beach Access', 'Free WiFi', 'Restaurants', 'Fitness Center'],
      coordinates: { lat: 25.8193, lng: -80.1240 }
    },
    {
      name: 'Faena Hotel Miami Beach',
      location: 'Miami',
      address: '3201 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Faena Theater', 'Spa', 'Beach Access', 'Pool', 'Fine Dining', 'Free WiFi', 'Art Collection'],
      coordinates: { lat: 25.8096, lng: -80.1229 }
    },
    {
      name: 'The Setai, Miami Beach',
      location: 'Miami',
      address: '2001 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Three Pools', 'Spa', 'Beach Access', 'Asian-Fusion Dining', 'Free WiFi', 'Fitness Center', 'Art Deco'],
      coordinates: { lat: 25.7913, lng: -80.1300 }
    },
    {
      name: 'Four Seasons Hotel Miami',
      location: 'Miami',
      address: '1435 Brickell Ave, Miami, FL 33131',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Edge Steak & Bar', 'Spa', 'Rooftop Pool', 'Free WiFi', 'Fitness Center', 'Brickell', 'Bay Views'],
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    {
      name: 'Mandarin Oriental, Miami',
      location: 'Miami',
      address: '500 Brickell Key Dr, Miami, FL 33131',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['La Mar Restaurant', 'Spa', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Private Island'],
      coordinates: { lat: 25.7658, lng: -80.1867 }
    },
    {
      name: 'The Ritz-Carlton, South Beach',
      location: 'Miami',
      address: '1 Lincoln Rd, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['DiLido Beach Club', 'Spa', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Art Deco'],
      coordinates: { lat: 25.7809, lng: -80.1300 }
    },
    {
      name: 'W South Beach',
      location: 'Miami',
      address: '2201 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Mr Chow', 'WALL Lounge', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 25.7932, lng: -80.1299 }
    },
    {
      name: 'SLS South Beach',
      location: 'Miami',
      address: '1701 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Hyde Beach', 'Katsuya Restaurant', 'Pool', 'Beach Access', 'Free WiFi', 'Fitness Center', 'Philippe Starck Design'],
      coordinates: { lat: 25.7900, lng: -80.1301 }
    },
    {
      name: '1 Hotel South Beach',
      location: 'Miami',
      address: '2341 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Watr Rooftop', 'Spa', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Eco-Friendly'],
      coordinates: { lat: 25.7946, lng: -80.1298 }
    },
    {
      name: 'The Betsy Hotel',
      location: 'Miami',
      address: '1440 Ocean Dr, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['LT Steak & Seafood', 'Rooftop', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Writers Room'],
      coordinates: { lat: 25.7810, lng: -80.1299 }
    },
    {
      name: 'Soho Beach House',
      location: 'Miami',
      address: '4385 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Cecconi\'s Restaurant', 'Cowshed Spa', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Members Club'],
      coordinates: { lat: 25.8182, lng: -80.1241 }
    },
    {
      name: 'The Confidante Miami Beach',
      location: 'Miami',
      address: '4041 Collins Ave, Miami Beach, FL 33140',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Bird & Bone', 'Backyard', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Retro Design'],
      coordinates: { lat: 25.8146, lng: -80.1234 }
    },
    {
      name: 'The Palms Hotel & Spa',
      location: 'Miami',
      address: '3025 Collins Ave, Miami Beach, FL 33140',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Essensia Restaurant', 'Spa', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Wellness Focus'],
      coordinates: { lat: 25.8073, lng: -80.1227 }
    },
    {
      name: 'The Shore Club',
      location: 'Miami',
      address: '1901 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Skybar', 'Restaurant', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Gardens'],
      coordinates: { lat: 25.7910, lng: -80.1300 }
    },
    {
      name: 'Kimpton EPIC Hotel',
      location: 'Miami',
      address: '270 Biscayne Blvd Way, Miami, FL 33131',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Area 31 Restaurant', 'Rooftop Pool', 'Spa', 'Free WiFi', 'Fitness Center', 'Bay Views', 'Pet Friendly'],
      coordinates: { lat: 25.7705, lng: -80.1871 }
    },
    {
      name: 'Nautilus, A SIXTY Hotel',
      location: 'Miami',
      address: '1825 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Nautilus Cabana Club', 'Pool', 'Beach Access', 'Free WiFi', 'Fitness Center', 'Art Deco', 'Tropicale Restaurant'],
      coordinates: { lat: 25.7896, lng: -80.1301 }
    },
    {
      name: 'Delano South Beach',
      location: 'Miami',
      address: '1685 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Bianca Restaurant', 'Pool', 'Beach Access', 'Spa', 'Free WiFi', 'Fitness Center', 'White Design'],
      coordinates: { lat: 25.7898, lng: -80.1301 }
    },
    {
      name: 'The Miami Beach EDITION',
      location: 'Miami',
      address: '2901 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Matador Room', 'Basement Nightclub', 'Beach Access', 'Pool', 'Free WiFi', 'Fitness Center', 'Ice Skating Rink'],
      coordinates: { lat: 25.8066, lng: -80.1227 }
    },
    {
      name: 'Hotel Victor',
      location: 'Miami',
      address: '1144 Ocean Dr, Miami Beach, FL 33139',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Pawn Broker', 'Pool', 'Beach Access', 'Free WiFi', 'Fitness Center', 'Art Deco', 'Ocean Drive'],
      coordinates: { lat: 25.7806, lng: -80.1299 }
    },
    {
      name: 'Royal Palm South Beach',
      location: 'Miami',
      address: '1545 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Florida Cookery', 'Pool', 'Beach Access', 'Free WiFi', 'Fitness Center', 'Art Deco', 'Garden'],
      coordinates: { lat: 25.7876, lng: -80.1302 }
    }
  ],
  'Boston': [
    {
      name: 'Four Seasons Hotel Boston',
      location: 'Boston',
      address: '200 Boylston St, Boston, MA 02116',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Spa', 'Pool', 'Bristol Lounge', 'Free WiFi', 'Fitness Center', 'Public Garden Views', 'Concierge'],
      coordinates: { lat: 42.3519, lng: -71.0707 }
    },
    {
      name: 'The Langham, Boston',
      location: 'Boston',
      address: '250 Franklin St, Boston, MA 02110',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Grill 23 & Bar', 'Bond Lounge', 'Spa', 'Free WiFi', 'Fitness Center', 'Former Federal Reserve', 'Concierge'],
      coordinates: { lat: 42.3558, lng: -71.0539 }
    },
    {
      name: 'Boston Harbor Hotel',
      location: 'Boston',
      address: '70 Rowes Wharf, Boston, MA 02110',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Rowes Wharf Bar', 'Spa', 'Harbor Views', 'Free WiFi', 'Fitness Center', 'Boat Access', 'Wine Festival'],
      coordinates: { lat: 42.3561, lng: -71.0502 }
    },
    {
      name: 'Mandarin Oriental, Boston',
      location: 'Boston',
      address: '776 Boylston St, Boston, MA 02199',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Bar Boulud', 'Spa', 'Free WiFi', 'Fitness Center', 'Back Bay', 'Fenway Park Views', 'Concierge'],
      coordinates: { lat: 42.3478, lng: -71.0827 }
    },
    {
      name: 'The Ritz-Carlton, Boston',
      location: 'Boston',
      address: '10 Avery St, Boston, MA 02111',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Artisan Bistro', 'Spa', 'Free WiFi', 'Fitness Center', 'Downtown Crossing', 'Theater District', 'Club Lounge'],
      coordinates: { lat: 42.3531, lng: -71.0623 }
    },
    {
      name: 'XV Beacon',
      location: 'Boston',
      address: '15 Beacon St, Boston, MA 02108',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Mooo.... Restaurant', 'Free WiFi', 'Fitness Center', 'Beacon Hill', 'Gas Fireplaces', 'Pet Friendly', 'Custom Minibar'],
      coordinates: { lat: 42.3586, lng: -71.0633 }
    },
    {
      name: 'The Liberty, A Luxury Collection Hotel',
      location: 'Boston',
      address: '215 Charles St, Boston, MA 02114',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Clink. Restaurant', 'Alibi Bar', 'Free WiFi', 'Fitness Center', 'Former Jail', 'Historic Property', 'Unique Design'],
      coordinates: { lat: 42.3612, lng: -71.0683 }
    },
    {
      name: 'Fairmont Copley Plaza',
      location: 'Boston',
      address: '138 St James Ave, Boston, MA 02116',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['OAK Long Bar + Kitchen', 'Free WiFi', 'Fitness Center', 'Back Bay', 'Historic Property', 'Grand Ballroom', 'Pet Friendly'],
      coordinates: { lat: 42.3495, lng: -71.0771 }
    },
    {
      name: 'The Newbury Boston',
      location: 'Boston',
      address: '1 Newbury St, Boston, MA 02116',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Contessa Restaurant', 'Rooftop', 'Free WiFi', 'Fitness Center', 'Public Garden Views', 'Newbury Street', 'Spa'],
      coordinates: { lat: 42.3536, lng: -71.0708 }
    },
    {
      name: 'The Eliot Hotel',
      location: 'Boston',
      address: '370 Commonwealth Ave, Boston, MA 02215',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Uni Restaurant', 'Free WiFi', 'Fitness Center', 'Back Bay', 'Suites', 'Kitchenettes', 'Pet Friendly'],
      coordinates: { lat: 42.3495, lng: -71.0884 }
    },
    {
      name: 'Omni Parker House',
      location: 'Boston',
      address: '60 School St, Boston, MA 02108',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Parker\'s Restaurant', 'Last Hurrah Bar', 'Free WiFi', 'Fitness Center', 'Oldest Hotel', 'Freedom Trail', 'Boston Cream Pie'],
      coordinates: { lat: 42.3579, lng: -71.0599 }
    },
    {
      name: 'The Lenox Hotel',
      location: 'Boston',
      address: '61 Exeter St, Boston, MA 02116',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['City Table', 'City Bar', 'Free WiFi', 'Fitness Center', 'Back Bay', 'Fireplaces', 'Historic Property'],
      coordinates: { lat: 42.3493, lng: -71.0794 }
    },
    {
      name: 'Hotel Commonwealth',
      location: 'Boston',
      address: '500 Commonwealth Ave, Boston, MA 02215',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Island Creek Oyster Bar', 'Hawthorne Bar', 'Free WiFi', 'Fitness Center', 'Fenway', 'Red Sox', 'Rooftop'],
      coordinates: { lat: 42.3487, lng: -71.0969 }
    },
    {
      name: 'Omni Boston Hotel at the Seaport',
      location: 'Boston',
      address: '450 Summer St, Boston, MA 02210',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Rooftop Pool', 'Spa', 'Restaurants', 'Free WiFi', 'Fitness Center', 'Seaport', 'Harbor Views'],
      coordinates: { lat: 42.3479, lng: -71.0421 }
    },
    {
      name: 'The Godfrey Hotel Boston',
      location: 'Boston',
      address: '505 Washington St, Boston, MA 02111',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['RUKA Restobar', 'George Howell Coffee', 'Free WiFi', 'Fitness Center', 'Downtown Crossing', 'Modern Design', 'Pet Friendly'],
      coordinates: { lat: 42.3544, lng: -71.0631 }
    },
    {
      name: 'The Bostonian Boston',
      location: 'Boston',
      address: '26 North St, Boston, MA 02109',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['North 26 Restaurant', 'Free WiFi', 'Fitness Center', 'Faneuil Hall', 'Waterfront', 'Historic District', 'Balconies'],
      coordinates: { lat: 42.3602, lng: -71.0556 }
    },
    {
      name: 'citizenM Boston North Station',
      location: 'Boston',
      address: '80-120 Causeway St, Boston, MA 02114',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['CanteenM', 'CloudM Bar', 'Free WiFi', '24hr Gym', 'North Station', 'TD Garden', 'Modern Design'],
      coordinates: { lat: 42.3661, lng: -71.0621 }
    },
    {
      name: 'The Verb Hotel',
      location: 'Boston',
      address: '1271 Boylston St, Boston, MA 02215',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Hojoko Restaurant', 'Pool', 'Free WiFi', 'Fenway Park', 'Rock \'n\' Roll Theme', 'Vinyl Records', 'Retro Design'],
      coordinates: { lat: 42.3473, lng: -71.1007 }
    },
    {
      name: 'The Revolution Hotel',
      location: 'Boston',
      address: '40 Berkeley St, Boston, MA 02116',
      stars: 3,
      rating: 4.2,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Cosmica Restaurant', 'Free WiFi', 'Fitness Center', 'South End', 'Modern Design', 'Co-Working', 'Budget Luxury'],
      coordinates: { lat: 42.3507, lng: -71.0721 }
    },
    {
      name: 'The Boxer Boston',
      location: 'Boston',
      address: '107 Merrimac St, Boston, MA 02114',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Finch Restaurant', 'Free WiFi', 'Fitness Center', 'West End', 'Boutique', 'Pet Friendly', 'TD Garden'],
      coordinates: { lat: 42.3639, lng: -71.0625 }
    }
  ]
}

export function getMockHotelResults(searchData: SearchData): Hotel[] {
  // Extract location code from search data
  const locationMatch = searchData.location?.match(/^([^,]+)/)
  const locationName = locationMatch ? locationMatch[1].trim() : ''

  // Get hotels for this location
  const cityHotels = hotelDatabase[locationName] || []

  // Map to full Hotel objects with mock pricing and review counts
  const results: Hotel[] = cityHotels.map((hotel, index) => ({
    ...hotel,
    id: index + 1,
    // Generate mock price based on star rating
    pricePerNight: Math.floor(Math.random() * 200) + (hotel.stars === 5 ? 300 : hotel.stars === 4 ? 150 : 100),
    // Generate mock review count
    reviewCount: Math.floor(Math.random() * 2000) + 500
  }))

  // Sort by rating (highest first)
  results.sort((a, b) => b.rating - a.rating)

  return results
}
