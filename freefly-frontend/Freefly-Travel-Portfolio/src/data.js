import { BedDouble, Compass, Headphones, Map, Plane, ShieldCheck, Sparkles, TramFront } from 'lucide-react'

export const services = [

  { title: 'Flight Booking', description: 'Smart routes and fares, arranged around your plans.', icon: Plane },

  { title: 'Hotel Booking', description: 'Handpicked stays that make every arrival feel easy.', icon: BedDouble },

  { title: 'Tour Packages', description: 'Thoughtful itineraries with room for your own rhythm.', icon: Compass },

  { title: 'Visa Assistance', description: 'Clear guidance for the documents your journey needs.', icon: Map },

  { title: 'Travel Insurance', description: 'Extra confidence for the unexpected parts of travel.', icon: ShieldCheck },

  { title: 'Transportation', description: 'Smooth transfers and local rides, arranged ahead.', icon: TramFront },

  { title: 'Customized Trips', description: 'A personal route shaped around what matters to you.', icon: Sparkles },

  { title: 'Travel Support', description: 'A real person in your corner, wherever you are.', icon: Headphones },

]

export const destinations = [

  { name: 'Paris', country: 'France', category: 'International', description: 'Cafes, culture, and the glow of the city by the Seine.', image: '/travel/paris.jpg' },

  { name: 'Maldives', country: 'Indian Ocean', category: 'Beach', description: 'Slow mornings, clear water, and barefoot island days.', image: '/travel/maldives.jpg' },

  { name: 'Dubai', country: 'United Arab Emirates', category: 'International', description: 'A bold blend of desert horizons and electric city life.', image: '/travel/dubai.jpg' },

  { name: 'Switzerland', country: 'Europe', category: 'Adventure', description: 'Alpine air, storybook villages, and train-window views.', image: '/travel/switzerland.jpg' },

  { name: 'Bali', country: 'Indonesia', category: 'Honeymoon', description: 'A soulful mix of jungle, ceremony, surf, and stillness.', image: '/travel/bali.jpg' },

  { name: 'Singapore', country: 'Southeast Asia', category: 'International', description: 'Garden city energy, hawker stalls, and future-facing design.', image: '/travel/singapore.jpg' },

]

export const packages = [

  {
    title: 'Bali Escape',
    destination: 'Bali',
    duration: '4 Days / 3 Nights',
    price: 'From ₹45,000',
    description: 'An easy island escape with beautiful beaches, tropical views, private villa stays, and unforgettable sunset experiences.',
    image: '/travel/bali.jpg',
    tag: 'Most loved'
  },

  {
    title: 'Manali Adventure',
    destination: 'Manali',
    duration: '5 Days / 4 Nights',
    price: 'From ₹25,000',
    description: 'Explore the beautiful mountains, peaceful valleys, rivers, and scenic landscapes of Manali with family and friends.',
    image: '/travel/mountain-lake.jpg',
    tag: 'New route'
  },

  {
    title: 'Dubai Explorer',
    destination: 'Dubai',
    duration: '6 Days / 5 Nights',
    price: 'From ₹55,000',
    description: 'Experience Dubai with iconic skyscrapers, luxury shopping, desert adventures, beautiful attractions, and modern city life.',
    image: '/travel/dubai.jpg',
    tag: 'Popular'
  },

]

export const gallery = [

  { image: destinations[1].image, alt: 'Turquoise Maldives lagoon', className: 'gallery-tall' },

  { image: '/travel/mountain-lake.jpg', alt: 'Mountain lake beneath a wide sky' },

  { image: destinations[0].image, alt: 'Paris skyline at dusk' },

  { image: '/travel/alpine-hiker.jpg', alt: 'Hiker looking across alpine peaks', className: 'gallery-wide' },

  { image: destinations[4].image, alt: 'Bali temple surrounded by green' },

  { image: '/travel/tropical-beach.jpg', alt: 'Tropical beach and gentle waves' },

]