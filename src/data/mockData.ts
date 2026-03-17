import keralaImg from "@/assets/kerala-package.png";
import ootyImg from "@/assets/ooty-package.png";
import soaringxLogo from "@/assets/soaringx-logo.png";

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
  includes: string[];
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
  phone?: string;
  email?: string;
  instagram?: string;
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
    name: "Kerala Adventure Trip",
    agency: "SoaringX Tours & Packages",
    agencyId: "a1",
    price: 6499,
    duration: "3 Days / 2 Nights",
    locations: ["Munnar", "Kolukkumalai", "Alleppey"],
    image: keralaImg,
    rating: 4.9,
    reviews: 342,
    description: "Experience the ultimate Kerala adventure! Explore the misty hills of Munnar, witness the breathtaking sunrise at Kolukkumalai, and cruise through the serene backwaters of Alleppey. This trip is packed with thrilling jeep rides, scenic boat cruises, and authentic Kerala cuisine.",
    itinerary: [
      "Day 1: Pickup from Bengaluru, drive to Munnar. Evening: Explore local markets & tea gardens",
      "Day 2: Early morning Kolukkumalai Jeep Ride, Mattupetty Dam, Echo Point. Drive to Alleppey",
      "Day 3: Alleppey Shikara Boat Ride, Alleppey Beach, Return journey",
    ],
    includes: ["Transport", "Hygienic Stay", "Food Included", "Jeep Ride", "Shikara Boat Ride"],
    verified: true,
  },
  {
    id: "2",
    name: "Misty Ooty Escape",
    agency: "SoaringX Tours & Packages",
    agencyId: "a1",
    price: 4499,
    duration: "1 Night / 2 Days",
    locations: ["Bengaluru", "Ooty"],
    image: ootyImg,
    rating: 4.8,
    reviews: 278,
    description: "Escape to the Queen of Hill Stations! This budget-friendly Ooty package includes everything — comfortable transport from Bengaluru, 4 meals with snacks and tea/coffee, the iconic Toy Train ride, entry tickets with boating, and a cozy 3-star hotel stay.",
    itinerary: [
      "Day 1: Bengaluru to Ooty, Botanical Garden, Ooty Lake Boating, Toy Train Ride, Hotel check-in",
      "Day 2: Rose Garden, Tea Factory Visit, Doddabetta Peak, Shopping, Return to Bengaluru",
    ],
    includes: ["Transport", "4 Meals + Snacks + Tea/Coffee", "Toy Train Ticket", "Entry Tickets + Boating", "1 Night 3★ Hotel Stay"],
    verified: true,
  },
  {
    id: "3",
    name: "Goa Beach Paradise",
    agency: "Coastal Holidays",
    agencyId: "a3",
    price: 12999,
    duration: "4 Days / 3 Nights",
    locations: ["Bengaluru", "Goa"],
    image: "",
    rating: 4.9,
    reviews: 256,
    description: "Sun, sand, and sea! Enjoy Goa's best beaches, nightlife, and Portuguese heritage.",
    itinerary: ["Day 1: Arrival, North Goa Beaches", "Day 2: Old Goa Churches, Spice Plantation", "Day 3: South Goa Beaches, Water Sports", "Day 4: Shopping, Departure"],
    includes: ["Transport", "Hotel Stay", "Breakfast"],
    verified: true,
  },
  {
    id: "4",
    name: "Coorg Coffee Trail Adventure",
    agency: "Karnataka Travels",
    agencyId: "a2",
    price: 8999,
    duration: "3 Days / 2 Nights",
    locations: ["Bengaluru", "Coorg", "Madikeri"],
    image: "",
    rating: 4.8,
    reviews: 124,
    description: "Explore the scenic coffee plantations of Coorg with guided tours, waterfall treks, and authentic local cuisine.",
    itinerary: ["Day 1: Bengaluru to Coorg, Abbey Falls", "Day 2: Raja's Seat, Coffee Plantation Tour", "Day 3: Dubare Elephant Camp, Return"],
    includes: ["Transport", "Hotel Stay", "Breakfast & Dinner"],
    verified: true,
  },
  {
    id: "5",
    name: "Chikmagalur Hill Retreat",
    agency: "SoaringX Tours & Packages",
    agencyId: "a1",
    price: 5499,
    duration: "2 Days / 1 Night",
    locations: ["Bengaluru", "Chikmagalur"],
    image: "",
    rating: 4.7,
    reviews: 189,
    description: "Discover the coffee capital of India with stunning mountain views, trekking trails, and serene homestays.",
    itinerary: ["Day 1: Bengaluru to Chikmagalur, Mullayanagiri Trek, Coffee Estate Visit", "Day 2: Baba Budangiri, Hebbe Falls, Return"],
    includes: ["Transport", "Homestay", "Breakfast & Dinner"],
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
    includes: ["Transport", "Hotel + Houseboat Stay", "All Meals"],
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
    owner: "SoaringX Tours & Packages",
    ownerId: "a1",
    location: "Bengaluru",
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
    owner: "SoaringX Tours & Packages",
    ownerId: "a1",
    location: "Bengaluru",
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
    location: "Mysuru",
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
    location: "Bengaluru",
    image: "",
    rating: 4.9,
    verified: true,
    features: ["AC", "Luxury Seats", "LCD Screen", "WiFi", "Mini Fridge"],
  },
];

export const mockAgencies: Agency[] = [
  {
    id: "a1",
    name: "SoaringX Tours & Packages",
    owner: "SoaringX Team",
    location: "Bengaluru",
    description: "Pack Your Bags. We Handle the Rest. Premium tour packages covering Kerala, Ooty, Coorg, Goa, and more. Trusted by 5000+ happy travelers.",
    logo: soaringxLogo,
    packagesCount: 15,
    rating: 4.9,
    verified: true,
    phone: "9390071812",
    email: "soaring.xofficial@gmail.com",
    instagram: "https://www.instagram.com/soaringx.tour",
  },
  {
    id: "a2",
    name: "Karnataka Travels",
    owner: "Prakash Rao",
    location: "Bengaluru",
    description: "Premier travel agency specializing in Karnataka tourism with 15+ years of experience.",
    logo: "",
    packagesCount: 12,
    rating: 4.8,
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
    name: "Rahul Menon",
    avatar: "RM",
    rating: 5,
    text: "Incredible Kerala trip with SoaringX! The Kolukkumalai sunrise was unforgettable. Everything was perfectly organized — transport, food, stay. Best ₹6499 I ever spent!",
    trip: "Kerala Adventure Trip",
  },
  {
    id: "r2",
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "Booked the Ooty package for my family. The toy train ride was magical! Kids loved it. Great food, comfortable hotel. Highly recommend SoaringX!",
    trip: "Misty Ooty Escape",
  },
  {
    id: "r3",
    name: "Amit Patel",
    avatar: "AP",
    rating: 5,
    text: "Booked a Tempo Traveller for our college trip. Clean vehicle, polite driver, and great service. Will definitely book again through Payana!",
    trip: "Bengaluru to Goa",
  },
  {
    id: "r4",
    name: "Sneha Reddy",
    avatar: "SR",
    rating: 5,
    text: "The trip request feature is genius! Got 4 quotes in 2 hours and chose the best deal. Saved so much time and money. Love this platform!",
    trip: "Coorg Weekend Trip",
  },
];

export const pickupCities = [
  "Bengaluru", "Mysuru", "Chennai", "Hyderabad", "Hubli", "Mangalore",
  "Coimbatore", "Kochi", "Vijayawada", "Pune",
];

export const destinations = [
  "Ooty", "Coorg", "Kerala", "Goa", "Chikmagalur",
  "Munnar", "Alleppey", "Wayanad", "Hampi", "Pondicherry",
];

export const popularLocations = [
  "Bengaluru", "Mysuru", "Coorg", "Goa", "Ooty", "Hampi",
  "Kochi", "Munnar", "Alleppey", "Chennai", "Pondicherry", "Wayanad",
];
