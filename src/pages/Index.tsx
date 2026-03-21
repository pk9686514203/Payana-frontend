import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, ChevronRight, CheckCircle, ArrowRight, Shield, Clock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useApprovedPackages } from "@/hooks/usePackages";
import { useApprovedVehicles } from "@/hooks/useVehicles";
import { useApprovedAgencies } from "@/hooks/useAgencies";
import SmartSearchInput from "@/components/SmartSearchInput";
import heroBg from "@/assets/hero-bg.jpg";

const pickupCities = ["Bengaluru", "Mysuru", "Chennai", "Hyderabad", "Hubli", "Mangalore", "Coimbatore", "Kochi"];
const destinationsList = ["Ooty", "Coorg", "Kerala", "Goa", "Chikmagalur", "Munnar", "Alleppey", "Wayanad"];

const staticReviews = [
  { id: "r1", name: "Rahul Menon", avatar: "RM", rating: 5, text: "Incredible Kerala trip! The Kolukkumalai sunrise was unforgettable. Everything was perfectly organized.", trip: "Kerala Adventure Trip" },
  { id: "r2", name: "Priya Sharma", avatar: "PS", rating: 5, text: "Booked the Ooty package for my family. The toy train ride was magical! Kids loved it.", trip: "Misty Ooty Escape" },
  { id: "r3", name: "Amit Patel", avatar: "AP", rating: 5, text: "Booked a Tempo Traveller for our college trip. Clean vehicle, polite driver, great service.", trip: "Bengaluru to Goa" },
  { id: "r4", name: "Sneha Reddy", avatar: "SR", rating: 5, text: "Got 4 quotes in 2 hours and chose the best deal. Saved so much time and money!", trip: "Coorg Weekend Trip" },
];

export default function Index() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");

  const { data: packages } = useApprovedPackages();
  const { data: vehicles } = useApprovedVehicles();
  const { data: agencies } = useApprovedAgencies();

  const handleSearch = () => {
    navigate(`/packages?from=${from}&to=${to}&date=${date}&passengers=${passengers}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Travel landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/60" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-orange" />
              Trusted by 5000+ Happy Travelers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-5">
              Your Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-gold">Our Booking.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-lg leading-relaxed">
              Discover premium tour packages, rent tourist vehicles, and connect with verified travel agencies — all in one platform.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="glass-card rounded-2xl p-5 md:p-6 shadow-hero max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <SmartSearchInput placeholder="From" value={from} onChange={setFrom} suggestions={pickupCities} />
              <SmartSearchInput placeholder="To" value={to} onChange={setTo} suggestions={destinationsList} />
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="number" placeholder="Passengers" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <Button onClick={handleSearch} className="bg-gradient-warm text-primary-foreground h-auto py-3 rounded-xl font-semibold text-sm hover:opacity-90 shadow-sm">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-6 mt-8 text-primary-foreground/80 text-sm">
            {[{ icon: Shield, text: "Verified Agencies" }, { icon: Clock, text: "24/7 Support" }, { icon: TrendingUp, text: "Best Price Guarantee" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary-foreground/10"><Icon className="h-4 w-4" /></div>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages from DB */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">🔥 Trending Packages</h2>
              <p className="text-muted-foreground mt-1">Handpicked tours loved by travelers</p>
            </div>
            <Link to="/packages"><Button variant="ghost" className="gap-1 text-secondary hover:text-secondary font-semibold">View All <ChevronRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.slice(0, 3).map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/packages/${pkg.id}`} className="group block">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                    <div className="relative h-52 bg-muted overflow-hidden">
                      {pkg.images?.[0] || pkg.title.toLowerCase().includes("kerala") || pkg.title.toLowerCase().includes("ooty") ? (
                        <img src={pkg.title.toLowerCase().includes("kerala") ? "/kerala-package.png" : pkg.title.toLowerCase().includes("ooty") ? "/ooty-package.png" : pkg.images[0] || "/kerala-package.png"} alt={pkg.title} onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-sky opacity-60 flex items-center justify-center"><MapPin className="h-12 w-12 text-primary-foreground/60" /></div>
                      )}
                      {pkg.agents?.is_verified && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-sm font-bold text-foreground">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">/person</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors text-lg">{pkg.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{pkg.agents?.agency_name} • {pkg.duration}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {pkg.locations?.slice(0, 2).map((loc) => (
                          <span key={loc} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-md font-medium">{loc}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(!packages || packages.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">No packages available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Vehicles from DB */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">🚐 Featured Vehicles</h2>
              <p className="text-muted-foreground mt-1">Reliable vehicles for every journey</p>
            </div>
            <Link to="/vehicles"><Button variant="ghost" className="gap-1 text-secondary hover:text-secondary font-semibold">View All <ChevronRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles?.slice(0, 3).map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/vehicles/${v.id}`} className="group block">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                    <div className="relative h-44 bg-muted overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-hero opacity-40 flex items-center justify-center"><Users className="h-12 w-12 text-primary-foreground/50" /></div>
                      {v.vehicle_owners?.is_verified && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors">{v.vehicle_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{v.vehicle_owners?.owner_name} • {v.location}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-md font-medium">{v.seats} seats</span>
                        <span className="text-sm font-bold text-foreground">₹{v.price_per_km}/km</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">No vehicles available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Agencies from DB */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">⭐ Top Travel Agencies</h2>
              <p className="text-muted-foreground mt-1">Trusted partners for your travels</p>
            </div>
            <Link to="/agencies"><Button variant="ghost" className="gap-1 text-secondary hover:text-secondary font-semibold">View All <ChevronRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies?.slice(0, 3).map((agency, i) => (
              <motion.div key={agency.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/agencies/${agency.id}`} className="group block">
                  <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                      {agency.logo_url || agency.agency_name.toLowerCase().includes("soaringx") ? (
                        <img src={agency.logo_url || "/soaringx-logo.png"} alt={agency.agency_name} onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">
                          {agency.agency_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors">{agency.agency_name}</h3>
                          {agency.is_verified && <CheckCircle className="h-4 w-4 text-accent" />}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {agency.address || "India"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{agency.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(!agencies || agencies.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">No agencies available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Reviews (static — these are testimonials) */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">💬 What Travelers Say</h2>
            <p className="text-muted-foreground mt-1">Real reviews from real travelers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticReviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground font-bold text-sm">{review.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.trip}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-orange text-orange" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Submit a trip request and get quotes from multiple verified agencies. It's free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/trip-request">
                <Button size="lg" className="bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl px-8 shadow-sm">
                  Submit Trip Request <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl px-8">
                  Register as Agency
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
