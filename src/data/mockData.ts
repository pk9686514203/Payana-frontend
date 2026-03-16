// Mock data for Payana Bookings

export interface TourPackage {
  id: string;
  name: string;
  agency: string;
  agencyId: string;
  price: number;
  duration: string;
  locations: string[];
  image: string;
  rating: number;
  reviews: number;
  description: string;
  itinerary: string[];
  verified: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  seats: number;
  pricePerKm: number;
  owner: string;
  ownerId: string;
  location: string;
  image: string;
  rating: number;
  verified: boolean;
  features: string[];
}

export interface Agency {
  id: string;
  name: string;
  owner: string;
  location: string;
  description: string;
  logo: string;
  packagesCount: number;
  rating: number;
  verified: boolean;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  trip: string;
}

export const mockPackages: TourPackage[] = [
  {
    id: "1",
    name: "Coorg Coffee Trail Adventure",
    agency: "Karnataka Travels",
    agencyId: "a1",
    price: 8999,
    duration: "3 Days / 2 Nights",
    locations: ["Bangalore", "Coorg", "Madikeri"],
    image: "",
    rating: 4.8,
    reviews: 124,
    description: "Explore the scenic coffee plantations of Coorg with guided tours, waterfall treks, and authentic local cuisine.",
    itinerary: ["Day 1: Bangalore to Coorg, Abbey Falls", "Day 2: Raja's Seat, Coffee Plantation Tour", "Day 3: Dubare Elephant Camp, Return"],
    verified: true,
  },
  {
    id: "2",
    name: "Mysore Royal Heritage Tour",
    agency: "South India Tours",
    agencyId: "a2",
    price: 6499,
    duration: "2 Days / 1 Night",
    locations: ["Bangalore", "Mysore", "Srirangapatna"],
    image: "",
    rating: 4.6,
    reviews: 89,
    description: "Visit the majestic Mysore Palace, Chamundi Hills, and the historic town of Srirangapatna.",
    itinerary: ["Day 1: Bangalore to Mysore, Palace Visit", "Day 2: Chamundi Hills, Srirangapatna, Return"],
    verified: true,
  },
  {
    id: "3",
    name: "Goa Beach Paradise",
    agency: "Coastal Holidays",
    agencyId: "a3",
    price: 12999,
    duration: "4 Days / 3 Nights",
    locations: ["Bangalore", "Goa"],
    image: "",
    rating: 4.9,
    reviews: 256,
    description: "Sun, sand, and sea! Enjoy Goa's best beaches, nightlife, and Portuguese heritage.",
    itinerary: ["Day 1: Arrival, North Goa Beaches", "Day 2: Old Goa Churches, Spice Plantation", "Day 3: South Goa Beaches, Water Sports", "Day 4: Shopping, Departure"],
    verified: true,
  },
  {
    id: "4",
    name: "Ooty & Coonoor Hill Retreat",
    agency: "Nilgiri Adventures",
    agencyId: "a4",
    price: 7999,
    duration: "3 Days / 2 Nights",
    locations: ["Bangalore", "Ooty", "Coonoor"],
    image: "",
    rating: 4.7,
    reviews: 167,
    description: "Escape to the Queen of Hill Stations with tea garden visits and the famous toy train ride.",
    itinerary: ["Day 1: Drive to Ooty, Botanical Garden", "Day 2: Toy Train to Coonoor, Tea Factory", "Day 3: Ooty Lake, Return"],
    verified: false,
  },
  {
    id: "5",
    name: "Hampi Heritage Explorer",
    agency: "Karnataka Travels",
    agencyId: "a1",
    price: 5999,
    duration: "2 Days / 1 Night",
    locations: ["Bangalore", "Hampi", "Hospet"],
    image: "",
    rating: 4.5,
    reviews: 78,
    description: "Walk through the ruins of the Vijayanagara Empire in this UNESCO World Heritage Site.",
    itinerary: ["Day 1: Bangalore to Hampi, Temple Tours", "Day 2: Hampi Bazaar, Sunset Point, Return"],
    verified: true,
  },
  {
    id: "6",
    name: "Kerala Backwaters Bliss",
    agency: "God's Own Tours",
    agencyId: "a5",
    price: 15999,
    duration: "5 Days / 4 Nights",
    locations: ["Kochi", "Munnar", "Alleppey"],
    image: "",
    rating: 4.9,
    reviews: 312,
    description: "Experience Kerala's famous backwaters on a houseboat, lush tea gardens in Munnar, and vibrant Kochi.",
    itinerary: ["Day 1: Kochi Fort, Chinese Nets", "Day 2: Drive to Munnar", "Day 3: Tea Plantations, Mattupetty Dam", "Day 4: Alleppey Houseboat", "Day 5: Departure"],
    verified: true,
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Toyota Innova Crysta",
    type: "SUV",
    seats: 7,
    pricePerKm: 16,
    owner: "Rajesh Kumar",
    ownerId: "o1",
    location: "Bangalore",
    image: "",
    rating: 4.8,
    verified: true,
    features: ["AC", "Music System", "GPS", "First Aid Kit"],
  },
  {
    id: "v2",
    name: "Tempo Traveller (12 Seater)",
    type: "Tempo Traveller",
    seats: 12,
    pricePerKm: 22,
    owner: "Suresh Travels",
    ownerId: "o2",
    location: "Bangalore",
    image: "",
    rating: 4.6,
    verified: true,
    features: ["AC", "Push Back Seats", "LCD Screen", "Luggage Space"],
  },
  {
    id: "v3",
    name: "Luxury Tourist Bus",
    type: "Tourist Bus",
    seats: 40,
    pricePerKm: 45,
    owner: "VRL Travels",
    ownerId: "o3",
    location: "Hubli",
    image: "",
    rating: 4.7,
    verified: true,
    features: ["AC", "Sleeper", "Charging Points", "WiFi"],
  },
  {
    id: "v4",
    name: "Maruti Swift Dzire",
    type: "Sedan",
    seats: 4,
    pricePerKm: 12,
    owner: "Anand Cabs",
    ownerId: "o4",
    location: "Mysore",
    image: "",
    rating: 4.5,
    verified: true,
    features: ["AC", "Music System", "GPS"],
  },
  {
    id: "v5",
    name: "Mini Bus (20 Seater)",
    type: "Mini Bus",
    seats: 20,
    pricePerKm: 30,
    owner: "City Line Tours",
    ownerId: "o5",
    location: "Chennai",
    image: "",
    rating: 4.4,
    verified: false,
    features: ["AC", "Mic System", "Luggage Space", "First Aid"],
  },
  {
    id: "v6",
    name: "Force Urbania",
    type: "Tempo Traveller",
    seats: 17,
    pricePerKm: 28,
    owner: "Horizon Travels",
    ownerId: "o6",
    location: "Bangalore",
    image: "",
    rating: 4.9,
    verified: true,
    features: ["AC", "Luxury Seats", "LCD Screen", "WiFi", "Mini Fridge"],
  },
];

export const mockAgencies: Agency[] = [
  {
    id: "a1",
    name: "Karnataka Travels",
    owner: "Prakash Rao",
    location: "Bangalore",
    description: "Premier travel agency specializing in Karnataka tourism with 15+ years of experience.",
    logo: "",
    packagesCount: 12,
    rating: 4.8,
    verified: true,
  },
  {
    id: "a2",
    name: "South India Tours",
    owner: "Meera Nair",
    location: "Chennai",
    description: "Comprehensive South Indian travel solutions covering all major destinations.",
    logo: "",
    packagesCount: 18,
    rating: 4.6,
    verified: true,
  },
  {
    id: "a3",
    name: "Coastal Holidays",
    owner: "Joseph D'Souza",
    location: "Goa",
    description: "Beach and coastal holiday specialists with curated Goa experiences.",
    logo: "",
    packagesCount: 8,
    rating: 4.9,
    verified: true,
  },
  {
    id: "a4",
    name: "Nilgiri Adventures",
    owner: "Senthil Murugan",
    location: "Coimbatore",
    description: "Adventure and hill station packages in the Nilgiri range.",
    logo: "",
    packagesCount: 6,
    rating: 4.7,
    verified: true,
  },
  {
    id: "a5",
    name: "God's Own Tours",
    owner: "Thomas Kurian",
    location: "Kochi",
    description: "Experience the best of Kerala with our expertly crafted tour packages.",
    logo: "",
    packagesCount: 15,
    rating: 4.9,
    verified: true,
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "Amazing Coorg trip organized by Karnataka Travels! Everything was perfectly planned. The coffee plantation visit was the highlight.",
    trip: "Coorg Coffee Trail",
  },
  {
    id: "r2",
    name: "Amit Patel",
    avatar: "AP",
    rating: 5,
    text: "Booked a Tempo Traveller for our family trip. Clean vehicle, polite driver, and great service. Will definitely book again!",
    trip: "Bangalore to Goa",
  },
  {
    id: "r3",
    name: "Sneha Reddy",
    avatar: "SR",
    rating: 4,
    text: "Kerala backwaters houseboat experience was magical. The food was incredible. Highly recommend God's Own Tours.",
    trip: "Kerala Backwaters",
  },
  {
    id: "r4",
    name: "Karthik Nair",
    avatar: "KN",
    rating: 5,
    text: "The trip request feature is genius! Got 4 quotes in 2 hours and chose the best deal. Saved so much time and money.",
    trip: "Mysore Heritage Tour",
  },
];

export const popularLocations = [
  "Bangalore", "Mysore", "Coorg", "Goa", "Ooty", "Hampi",
  "Kochi", "Munnar", "Alleppey", "Chennai", "Pondicherry", "Wayanad",
];
