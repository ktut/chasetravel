import type { SearchData, Hotel, Room } from '@/types/search'

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
      amenities: ['Free Wifi', 'Spa', 'On-site Restaurant', 'Bar'],
      coordinates: { lat: 40.7645, lng: -73.9744 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The St. Regis New York',
      location: 'New York',
      address: '2 E 55th St, New York, NY 10022',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Free Wifi', 'Spa', 'Fitness Center', 'On-site Restaurant', 'Bar'],
      coordinates: { lat: 40.7614, lng: -73.9745 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Peninsula New York',
      location: 'New York',
      address: '700 5th Ave, New York, NY 10019',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Bar', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center', 'On-site Restaurant'],
      coordinates: { lat: 40.7623, lng: -73.9754 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Mandarin Oriental New York',
      location: 'New York',
      address: '80 Columbus Circle, New York, NY 10023',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Spa', 'Pool', 'Free Wifi', 'Fitness Center', 'On-site Restaurant'],
      coordinates: { lat: 40.7681, lng: -73.9819 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Carlyle, A Rosewood Hotel',
      location: 'New York',
      address: '35 E 76th St, New York, NY 10021',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Spa', 'Fitness Center', 'Free Wifi'],
      coordinates: { lat: 40.7747, lng: -73.9632 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton New York, Central Park',
      location: 'New York',
      address: '50 Central Park S, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Spa', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7654, lng: -73.9768 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Four Seasons Hotel New York',
      location: 'New York',
      address: '57 E 57th St, New York, NY 10022',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 40.7626, lng: -73.9722 },
      description: "Luxury Manhattan hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of New York. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Park Hyatt New York',
      location: 'New York',
      address: '153 W 57th St, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 40.7651, lng: -73.9784 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Lowell Hotel',
      location: 'New York',
      address: '28 E 63rd St, New York, NY 10065',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7677, lng: -73.9684 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Beekman, A Thompson Hotel',
      location: 'New York',
      address: '123 Nassau St, New York, NY 10038',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7112, lng: -74.0058 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: '1 Hotel Brooklyn Bridge',
      location: 'New York',
      address: '60 Furman St, Brooklyn, NY 11201',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7024, lng: -73.9931 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Greenwich Hotel',
      location: 'New York',
      address: '377 Greenwich St, New York, NY 10013',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7195, lng: -74.0097 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Baccarat Hotel New York',
      location: 'New York',
      address: '28 W 53rd St, New York, NY 10019',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Spa', 'Bar', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7610, lng: -73.9760 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Mark Hotel',
      location: 'New York',
      address: '25 E 77th St, New York, NY 10075',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7756, lng: -73.9632 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Conrad New York Downtown',
      location: 'New York',
      address: '102 North End Ave, New York, NY 10282',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7156, lng: -74.0157 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Crosby Street Hotel',
      location: 'New York',
      address: '79 Crosby St, New York, NY 10012',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 40.7217, lng: -73.9968 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The NoMad Hotel',
      location: 'New York',
      address: '1170 Broadway, New York, NY 10001',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 40.7453, lng: -73.9881 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Knickerbocker',
      location: 'New York',
      address: '6 Times Square, New York, NY 10036',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7572, lng: -73.9868 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Ludlow Hotel',
      location: 'New York',
      address: '180 Ludlow St, New York, NY 10002',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7213, lng: -73.9883 },
      description: "Well-appointed hotel located in Manhattan, New York. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Bowery Hotel',
      location: 'New York',
      address: '335 Bowery, New York, NY 10003',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 40.7267, lng: -73.9919 },
      description: "Premier Manhattan hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in New York. Ideal for both business and leisure travelers looking for a refined stay."
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
      amenities: ['Bar', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0789, lng: -118.4152 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Bel-Air',
      location: 'Los Angeles',
      address: '701 Stone Canyon Rd, Los Angeles, CA 90077',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0970, lng: -118.4517 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Four Seasons Hotel Los Angeles at Beverly Hills',
      location: 'Los Angeles',
      address: '300 S Doheny Dr, Los Angeles, CA 90048',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0754, lng: -118.3842 },
      description: "Luxury Los Angeles hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Los Angeles. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Montage Beverly Hills',
      location: 'Los Angeles',
      address: '225 N Canon Dr, Beverly Hills, CA 90210',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0687, lng: -118.3996 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Peninsula Beverly Hills',
      location: 'Los Angeles',
      address: '9882 S Santa Monica Blvd, Beverly Hills, CA 90212',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0667, lng: -118.4100 },
      description: "Luxury Los Angeles hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Los Angeles. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Shutters on the Beach',
      location: 'Los Angeles',
      address: '1 Pico Blvd, Santa Monica, CA 90405',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0085, lng: -118.4987 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Fairmont Miramar Hotel & Bungalows',
      location: 'Los Angeles',
      address: '101 Wilshire Blvd, Santa Monica, CA 90401',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0155, lng: -118.4995 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Sunset Tower Hotel',
      location: 'Los Angeles',
      address: '8358 Sunset Blvd, West Hollywood, CA 90069',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Bar', 'Pool', 'Fitness Center', 'Free Wifi'],
      coordinates: { lat: 34.0965, lng: -118.3770 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The London West Hollywood',
      location: 'Los Angeles',
      address: '1020 N San Vicente Blvd, West Hollywood, CA 90069',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Pool', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0900, lng: -118.3844 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Chateau Marmont',
      location: 'Los Angeles',
      address: '8221 Sunset Blvd, Los Angeles, CA 90046',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Pool', 'On-site Restaurant', 'Bar', 'Free Wifi'],
      coordinates: { lat: 34.0963, lng: -118.3689 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Proper Hotel',
      location: 'Los Angeles',
      address: '1100 S Broadway, Los Angeles, CA 90015',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0461, lng: -118.2567 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Casa del Mar',
      location: 'Los Angeles',
      address: '1910 Ocean Way, Santa Monica, CA 90405',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0096, lng: -118.4989 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Waldorf Astoria Beverly Hills',
      location: 'Los Angeles',
      address: '9850 Wilshire Blvd, Beverly Hills, CA 90210',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0644, lng: -118.4131 },
      description: "Luxury Los Angeles hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Los Angeles. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton, Los Angeles',
      location: 'Los Angeles',
      address: '900 W Olympic Blvd, Los Angeles, CA 90015',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 34.0449, lng: -118.2663 },
      description: "Luxury Los Angeles hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Los Angeles. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'InterContinental Los Angeles Downtown',
      location: 'Los Angeles',
      address: '900 Wilshire Blvd, Los Angeles, CA 90017',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0506, lng: -118.2598 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The LINE LA',
      location: 'Los Angeles',
      address: '3515 Wilshire Blvd, Los Angeles, CA 90010',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 34.0614, lng: -118.3091 },
      description: "Well-appointed hotel located in Los Angeles, Los Angeles. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Ace Hotel Downtown Los Angeles',
      location: 'Los Angeles',
      address: '929 S Broadway, Los Angeles, CA 90015',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Pool'],
      coordinates: { lat: 34.0456, lng: -118.2565 },
      description: "Well-appointed hotel located in Los Angeles, Los Angeles. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel Figueroa',
      location: 'Los Angeles',
      address: '939 S Figueroa St, Los Angeles, CA 90015',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Pool', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 34.0450, lng: -118.2622 },
      description: "Well-appointed hotel located in Los Angeles, Los Angeles. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Freehand Los Angeles',
      location: 'Los Angeles',
      address: '416 W 8th St, Los Angeles, CA 90014',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Pool', 'Free Wifi', 'Spa'],
      coordinates: { lat: 34.0446, lng: -118.2605 },
      description: "Well-appointed hotel located in Los Angeles, Los Angeles. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'SLS Hotel at Beverly Hills',
      location: 'Los Angeles',
      address: '465 S La Cienega Blvd, Los Angeles, CA 90048',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 34.0755, lng: -118.3759 },
      description: "Premier Los Angeles hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Los Angeles. Ideal for both business and leisure travelers looking for a refined stay."
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
      amenities: ['Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8957, lng: -87.6251 },
      description: "Luxury downtown Chicago hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, providing an unforgettable experience in the heart of Chicago. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Four Seasons Hotel Chicago',
      location: 'Chicago',
      address: '120 E Delaware Pl, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8992, lng: -87.6262 },
      description: "Luxury downtown Chicago hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Chicago. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Langham, Chicago',
      location: 'Chicago',
      address: '330 N Wabash Ave, Chicago, IL 60611',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8880, lng: -87.6263 },
      description: "Luxury downtown Chicago hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Chicago. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton, Chicago',
      location: 'Chicago',
      address: '160 E Pearson St, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 41.8979, lng: -87.6256 },
      description: "Luxury downtown Chicago hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Chicago. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Park Hyatt Chicago',
      location: 'Chicago',
      address: '800 N Michigan Ave, Chicago, IL 60611',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8978, lng: -87.6238 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Waldorf Astoria Chicago',
      location: 'Chicago',
      address: '11 E Walton St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Spa', 'Pool', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.9006, lng: -87.6265 },
      description: "Luxury downtown Chicago hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, providing an unforgettable experience in the heart of Chicago. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Gwen, a Luxury Collection Hotel',
      location: 'Chicago',
      address: '521 N Rush St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8920, lng: -87.6266 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Sofitel Chicago Magnificent Mile',
      location: 'Chicago',
      address: '20 E Chestnut St, Chicago, IL 60611',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 41.8981, lng: -87.6278 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Thompson Chicago',
      location: 'Chicago',
      address: '21 E Bellevue Pl, Chicago, IL 60611',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8996, lng: -87.6277 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Chicago Athletic Association',
      location: 'Chicago',
      address: '12 S Michigan Ave, Chicago, IL 60603',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8814, lng: -87.6245 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Viceroy Chicago',
      location: 'Chicago',
      address: '1118 N State St, Chicago, IL 60610',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.9034, lng: -87.6281 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Hoxton, Chicago',
      location: 'Chicago',
      address: '200 N Green St, Chicago, IL 60607',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi'],
      coordinates: { lat: 41.8859, lng: -87.6488 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Kimpton Hotel Monaco Chicago',
      location: 'Chicago',
      address: '225 N Wabash Ave, Chicago, IL 60601',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8866, lng: -87.6259 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel EMC2',
      location: 'Chicago',
      address: '228 E Ontario St, Chicago, IL 60611',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8933, lng: -87.6218 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Virgin Hotels Chicago',
      location: 'Chicago',
      address: '203 N Wabash Ave, Chicago, IL 60601',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8863, lng: -87.6262 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Robey',
      location: 'Chicago',
      address: '2018 W North Ave, Chicago, IL 60647',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi'],
      coordinates: { lat: 41.9104, lng: -87.6777 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Ace Hotel Chicago',
      location: 'Chicago',
      address: '311 N Morgan St, Chicago, IL 60607',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8878, lng: -87.6518 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Freehand Chicago',
      location: 'Chicago',
      address: '19 E Ohio St, Chicago, IL 60611',
      stars: 3,
      rating: 4.1,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Free Wifi', 'Spa'],
      coordinates: { lat: 41.8923, lng: -87.6279 },
      description: "Comfortable hotel situated in downtown Chicago, Chicago. This property offers clean accommodations, essential amenities, and easy access to the city's main attractions. A great choice for budget-conscious travelers."
    },
    {
      name: 'Hotel Lincoln',
      location: 'Chicago',
      address: '1816 N Clark St, Chicago, IL 60614',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Free Wifi'],
      coordinates: { lat: 41.9154, lng: -87.6352 },
      description: "Well-appointed hotel located in downtown Chicago, Chicago. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Pendry Chicago',
      location: 'Chicago',
      address: '230 N Michigan Ave, Chicago, IL 60601',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Bar', 'Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 41.8865, lng: -87.6243 },
      description: "Premier downtown Chicago hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Chicago. Ideal for both business and leisure travelers looking for a refined stay."
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
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7856, lng: -122.4053 },
      description: "Luxury San Francisco hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of San Francisco. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton, San Francisco',
      location: 'San Francisco',
      address: '600 Stockton St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Spa', 'On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7921, lng: -122.4106 },
      description: "Luxury San Francisco hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of San Francisco. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The St. Regis San Francisco',
      location: 'San Francisco',
      address: '125 3rd St, San Francisco, CA 94103',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7856, lng: -122.4008 },
      description: "Luxury San Francisco hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of San Francisco. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Fairmont San Francisco',
      location: 'San Francisco',
      address: '950 Mason St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7925, lng: -122.4106 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Palace Hotel, A Luxury Collection',
      location: 'San Francisco',
      address: '2 New Montgomery St, San Francisco, CA 94105',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Bar', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7883, lng: -122.4011 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Fairmont Heritage Place, Ghirardelli Square',
      location: 'San Francisco',
      address: '900 North Point St, San Francisco, CA 94109',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.8058, lng: -122.4224 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Nikko San Francisco',
      location: 'San Francisco',
      address: '222 Mason St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['Pool', 'On-site Restaurant', 'Fitness Center', 'Free Wifi'],
      coordinates: { lat: 37.7856, lng: -122.4094 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'InterContinental Mark Hopkins',
      location: 'San Francisco',
      address: '999 California St, San Francisco, CA 94108',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Fitness Center', 'Free Wifi'],
      coordinates: { lat: 37.7923, lng: -122.4115 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Westin St. Francis',
      location: 'San Francisco',
      address: '335 Powell St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7877, lng: -122.4082 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Clift Royal Sonesta Hotel',
      location: 'San Francisco',
      address: '495 Geary St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7867, lng: -122.4109 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Zephyr',
      location: 'San Francisco',
      address: '250 Beach St, San Francisco, CA 94133',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.8082, lng: -122.4152 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Marker San Francisco',
      location: 'San Francisco',
      address: '501 Geary St, San Francisco, CA 94102',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7867, lng: -122.4115 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel Zelos',
      location: 'San Francisco',
      address: '12 4th St, San Francisco, CA 94103',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7853, lng: -122.4043 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel Zetta',
      location: 'San Francisco',
      address: '55 5th St, San Francisco, CA 94103',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7839, lng: -122.4060 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Proper Hotel',
      location: 'San Francisco',
      address: '1100 Market St, San Francisco, CA 94102',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7815, lng: -122.4115 },
      description: "Premier San Francisco hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in San Francisco. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Vitale',
      location: 'San Francisco',
      address: '8 Mission St, San Francisco, CA 94105',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Free Wifi', 'Fitness Center', 'Bar', 'Hot Tub'],
      coordinates: { lat: 37.7937, lng: -122.3933 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Omni San Francisco',
      location: 'San Francisco',
      address: '500 California St, San Francisco, CA 94104',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7930, lng: -122.4034 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel Kabuki',
      location: 'San Francisco',
      address: '1625 Post St, San Francisco, CA 94115',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 37.7850, lng: -122.4309 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Phoenix Hotel',
      location: 'San Francisco',
      address: '601 Eddy St, San Francisco, CA 94109',
      stars: 3,
      rating: 4.0,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'On-site Restaurant', 'Free Wifi'],
      coordinates: { lat: 37.7833, lng: -122.4188 },
      description: "Comfortable hotel situated in San Francisco, San Francisco. This property offers clean accommodations, essential amenities, and easy access to the city's main attractions. A great choice for budget-conscious travelers."
    },
    {
      name: 'The Line San Francisco',
      location: 'San Francisco',
      address: '1124 Market St, San Francisco, CA 94102',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 37.7814, lng: -122.4119 },
      description: "Well-appointed hotel located in San Francisco, San Francisco. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
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
      amenities: ['Bar', 'Spa', 'Pool', 'Free Wifi', 'On-site Restaurant', 'Fitness Center'],
      coordinates: { lat: 25.8193, lng: -80.1240 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Faena Hotel Miami Beach',
      location: 'Miami',
      address: '3201 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Spa', 'Pool', 'On-site Restaurant', 'Free Wifi'],
      coordinates: { lat: 25.8096, lng: -80.1229 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Setai, Miami Beach',
      location: 'Miami',
      address: '2001 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7913, lng: -80.1300 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Four Seasons Hotel Miami',
      location: 'Miami',
      address: '1435 Brickell Ave, Miami, FL 33131',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['Bar', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7617, lng: -80.1918 },
      description: "Luxury Miami Beach hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, providing an unforgettable experience in the heart of Miami. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Mandarin Oriental, Miami',
      location: 'Miami',
      address: '500 Brickell Key Dr, Miami, FL 33131',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7658, lng: -80.1867 },
      description: "Luxury Miami Beach hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, fine dining, providing an unforgettable experience in the heart of Miami. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton, South Beach',
      location: 'Miami',
      address: '1 Lincoln Rd, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7809, lng: -80.1300 },
      description: "Luxury Miami Beach hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, providing an unforgettable experience in the heart of Miami. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'W South Beach',
      location: 'Miami',
      address: '2201 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Bar', 'Pool', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 25.7932, lng: -80.1299 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'SLS South Beach',
      location: 'Miami',
      address: '1701 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7900, lng: -80.1301 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: '1 Hotel South Beach',
      location: 'Miami',
      address: '2341 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7946, lng: -80.1298 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Betsy Hotel',
      location: 'Miami',
      address: '1440 Ocean Dr, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7810, lng: -80.1299 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Soho Beach House',
      location: 'Miami',
      address: '4385 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.8182, lng: -80.1241 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Confidante Miami Beach',
      location: 'Miami',
      address: '4041 Collins Ave, Miami Beach, FL 33140',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.8146, lng: -80.1234 },
      description: "Well-appointed hotel located in Miami Beach, Miami. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Palms Hotel & Spa',
      location: 'Miami',
      address: '3025 Collins Ave, Miami Beach, FL 33140',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.8073, lng: -80.1227 },
      description: "Well-appointed hotel located in Miami Beach, Miami. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Shore Club',
      location: 'Miami',
      address: '1901 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['Bar', 'On-site Restaurant', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7910, lng: -80.1300 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Kimpton EPIC Hotel',
      location: 'Miami',
      address: '270 Biscayne Blvd Way, Miami, FL 33131',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7705, lng: -80.1871 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Nautilus, A SIXTY Hotel',
      location: 'Miami',
      address: '1825 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['Pool', 'Free Wifi', 'Fitness Center', 'On-site Restaurant'],
      coordinates: { lat: 25.7896, lng: -80.1301 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Delano South Beach',
      location: 'Miami',
      address: '1685 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.3,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7898, lng: -80.1301 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Miami Beach EDITION',
      location: 'Miami',
      address: '2901 Collins Ave, Miami Beach, FL 33140',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['Bar', 'Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.8066, lng: -80.1227 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Hotel Victor',
      location: 'Miami',
      address: '1144 Ocean Dr, Miami Beach, FL 33139',
      stars: 4,
      rating: 4.2,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7806, lng: -80.1299 },
      description: "Well-appointed hotel located in Miami Beach, Miami. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Royal Palm South Beach',
      location: 'Miami',
      address: '1545 Collins Ave, Miami Beach, FL 33139',
      stars: 5,
      rating: 4.4,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Pool', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 25.7876, lng: -80.1302 },
      description: "Premier Miami Beach hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Miami. Ideal for both business and leisure travelers looking for a refined stay."
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
      amenities: ['Spa', 'Pool', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3519, lng: -71.0707 },
      description: "Luxury downtown Boston hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, swimming pool, providing an unforgettable experience in the heart of Boston. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Langham, Boston',
      location: 'Boston',
      address: '250 Franklin St, Boston, MA 02110',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Bar', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3558, lng: -71.0539 },
      description: "Luxury downtown Boston hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, providing an unforgettable experience in the heart of Boston. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'Boston Harbor Hotel',
      location: 'Boston',
      address: '70 Rowes Wharf, Boston, MA 02110',
      stars: 5,
      rating: 4.7,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['Bar', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3561, lng: -71.0502 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Mandarin Oriental, Boston',
      location: 'Boston',
      address: '776 Boylston St, Boston, MA 02199',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Bar', 'Spa', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3478, lng: -71.0827 },
      description: "Luxury downtown Boston hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, providing an unforgettable experience in the heart of Boston. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'The Ritz-Carlton, Boston',
      location: 'Boston',
      address: '10 Avery St, Boston, MA 02111',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['On-site Restaurant', 'Spa', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 42.3531, lng: -71.0623 },
      description: "Luxury downtown Boston hotel offering world-class amenities and exceptional service. This prestigious 5-star property combines elegant accommodations with modern conveniences with full-service spa, fine dining, providing an unforgettable experience in the heart of Boston. Perfect for discerning travelers seeking the finest in hospitality."
    },
    {
      name: 'XV Beacon',
      location: 'Boston',
      address: '15 Beacon St, Boston, MA 02108',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Bar'],
      coordinates: { lat: 42.3586, lng: -71.0633 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Liberty, A Luxury Collection Hotel',
      location: 'Boston',
      address: '215 Charles St, Boston, MA 02114',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3612, lng: -71.0683 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Fairmont Copley Plaza',
      location: 'Boston',
      address: '138 St James Ave, Boston, MA 02116',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-4.jpg',
      images: ['/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3495, lng: -71.0771 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Newbury Boston',
      location: 'Boston',
      address: '1 Newbury St, Boston, MA 02116',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-5.jpg',
      images: ['/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center', 'Spa'],
      coordinates: { lat: 42.3536, lng: -71.0708 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Eliot Hotel',
      location: 'Boston',
      address: '370 Commonwealth Ave, Boston, MA 02215',
      stars: 5,
      rating: 4.6,
      image: '/images/hotels/generic-6.jpg',
      images: ['/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3495, lng: -71.0884 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Omni Parker House',
      location: 'Boston',
      address: '60 School St, Boston, MA 02108',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-7.jpg',
      images: ['/images/hotels/generic-7.jpg', '/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg'],
      amenities: ['On-site Restaurant', 'Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3579, lng: -71.0599 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Lenox Hotel',
      location: 'Boston',
      address: '61 Exeter St, Boston, MA 02116',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-8.jpg',
      images: ['/images/hotels/generic-8.jpg', '/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3493, lng: -71.0794 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'Hotel Commonwealth',
      location: 'Boston',
      address: '500 Commonwealth Ave, Boston, MA 02215',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-9.jpg',
      images: ['/images/hotels/generic-9.jpg', '/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3487, lng: -71.0969 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'Omni Boston Hotel at the Seaport',
      location: 'Boston',
      address: '450 Summer St, Boston, MA 02210',
      stars: 5,
      rating: 4.5,
      image: '/images/hotels/generic-10.jpg',
      images: ['/images/hotels/generic-10.jpg', '/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg'],
      amenities: ['Pool', 'Spa', 'On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3479, lng: -71.0421 },
      description: "Premier downtown Boston hotel featuring sophisticated accommodations and outstanding service. This 5-star property offers well-appointed rooms, excellent amenities, and a prime location in Boston. Ideal for both business and leisure travelers looking for a refined stay."
    },
    {
      name: 'The Godfrey Hotel Boston',
      location: 'Boston',
      address: '505 Washington St, Boston, MA 02111',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-11.jpg',
      images: ['/images/hotels/generic-11.jpg', '/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3544, lng: -71.0631 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Bostonian Boston',
      location: 'Boston',
      address: '26 North St, Boston, MA 02109',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-12.jpg',
      images: ['/images/hotels/generic-12.jpg', '/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3602, lng: -71.0556 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'citizenM Boston North Station',
      location: 'Boston',
      address: '80-120 Causeway St, Boston, MA 02114',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-13.jpg',
      images: ['/images/hotels/generic-13.jpg', '/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg'],
      amenities: ['Bar', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3661, lng: -71.0621 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Verb Hotel',
      location: 'Boston',
      address: '1271 Boylston St, Boston, MA 02215',
      stars: 4,
      rating: 4.4,
      image: '/images/hotels/generic-1.jpg',
      images: ['/images/hotels/generic-1.jpg', '/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg'],
      amenities: ['On-site Restaurant', 'Pool', 'Free Wifi'],
      coordinates: { lat: 42.3473, lng: -71.1007 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
    },
    {
      name: 'The Revolution Hotel',
      location: 'Boston',
      address: '40 Berkeley St, Boston, MA 02116',
      stars: 3,
      rating: 4.2,
      image: '/images/hotels/generic-2.jpg',
      images: ['/images/hotels/generic-2.jpg', '/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3507, lng: -71.0721 },
      description: "Comfortable hotel situated in downtown Boston, Boston. This property offers clean accommodations, essential amenities, and easy access to the city's main attractions. A great choice for budget-conscious travelers."
    },
    {
      name: 'The Boxer Boston',
      location: 'Boston',
      address: '107 Merrimac St, Boston, MA 02114',
      stars: 4,
      rating: 4.3,
      image: '/images/hotels/generic-3.jpg',
      images: ['/images/hotels/generic-3.jpg', '/images/hotels/generic-4.jpg', '/images/hotels/generic-5.jpg', '/images/hotels/generic-6.jpg', '/images/hotels/generic-7.jpg'],
      amenities: ['On-site Restaurant', 'Free Wifi', 'Fitness Center'],
      coordinates: { lat: 42.3639, lng: -71.0625 },
      description: "Well-appointed hotel located in downtown Boston, Boston. This 4-star property offers comfortable accommodations, modern amenities, and convenient access to local attractions, dining, and entertainment. Perfect for travelers seeking quality and value."
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

// Mock room data per hotel
export function getMockRoomsForHotel(hotelId: number): Room[] {
  const roomTemplates = [
    {
      name: 'Suite (Level)',
      capacity: 'Sleeps 4',
      bedConfig: '1 Double Sofa Bed and 1 King Bed',
      bedCount: 2,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Partially refundable'],
      basePrice: 190,
      imageCount: 7
    },
    {
      name: 'Deluxe Suite, 1 Bedroom',
      capacity: 'Sleeps 4',
      bedConfig: '1 Double Sofa Bed and 1 King Bed',
      bedCount: 2,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Partially refundable'],
      basePrice: 239,
      imageCount: 8,
      hasDiscount: true,
      discountAmount: 69
    },
    {
      name: 'Executive Suite, 1 Bedroom',
      capacity: 'Sleeps 4',
      bedConfig: '1 King Bed and 1 Double Sofa Bed',
      bedCount: 2,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Partially refundable'],
      basePrice: 260,
      imageCount: 9,
      hasDiscount: true,
      discountAmount: 84
    },
    {
      name: 'Penthouse Suite',
      capacity: 'Sleeps 6',
      bedConfig: '1 King Bed and 2 Queen Beds',
      bedCount: 3,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Fully refundable', 'City View'],
      basePrice: 450,
      imageCount: 10
    },
    {
      name: 'Standard Room',
      capacity: 'Sleeps 2',
      bedConfig: '1 King Bed',
      bedCount: 1,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Partially refundable'],
      basePrice: 150,
      imageCount: 5
    },
    {
      name: 'Family Suite',
      capacity: 'Sleeps 6',
      bedConfig: '2 Queen Beds and 1 Sofa Bed',
      bedCount: 3,
      features: ['✓ Reserve now, pay later', 'Free Wifi', 'Partially refundable', 'Kitchenette'],
      basePrice: 320,
      imageCount: 8
    }
  ]

  // Generate 3-6 rooms based on hotel ID (for consistency per hotel)
  const roomCount = 3 + (hotelId % 4) // 3-6 rooms
  const selectedTemplates = roomTemplates.slice(0, roomCount)
  
  // Use hotel images as base for room images
  const genericImages = [
    '/images/hotels/generic-1.jpg',
    '/images/hotels/generic-2.jpg',
    '/images/hotels/generic-3.jpg',
    '/images/hotels/generic-4.jpg',
    '/images/hotels/generic-5.jpg',
    '/images/hotels/generic-6.jpg',
    '/images/hotels/generic-7.jpg',
    '/images/hotels/generic-8.jpg',
    '/images/hotels/generic-9.jpg',
    '/images/hotels/generic-10.jpg'
  ]

  return selectedTemplates.map((template, index) => {
    const roomId = hotelId * 100 + index + 1
    const imageCount = template.imageCount
    const roomImages = genericImages.slice(0, imageCount)
    
    // Calculate pricing with potential discount
    let pricePerNight = template.basePrice
    let originalPrice: number | undefined
    let discount: number | undefined
    
    if (template.hasDiscount) {
      originalPrice = template.basePrice
      pricePerNight = template.basePrice - template.discountAmount
      discount = template.discountAmount
    }

    // Generate availability (1-10 rooms left)
    const availability = 1 + Math.floor((hotelId * 7 + index * 3) % 10)

    return {
      id: roomId,
      name: template.name,
      images: roomImages,
      imageCount: imageCount,
      capacity: template.capacity,
      bedConfig: template.bedConfig,
      features: [...template.features],
      pricePerNight: pricePerNight,
      originalPrice: originalPrice,
      discount: discount,
      availability: availability,
      bedCount: template.bedCount
    } as Room
  })
}

// Get a hotel by ID from the search results
export function getHotelById(hotelId: number, searchData: SearchData): Hotel | null {
  const hotels = getMockHotelResults(searchData)
  return hotels.find(h => h.id === hotelId) || null
}
