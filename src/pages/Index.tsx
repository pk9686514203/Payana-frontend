import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, ChevronRight, CheckCircle, ArrowRight, Shield, Clock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { mockPackages, mockVehicles, mockAgencies, mockReviews } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");

  const handleSearch = () => {
    navigate(`/packages?from=${from}&to=${to}&date=${date}&passengers=${passengers}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Travel landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
              Your Journey, <br />
              <span className="text-orange">Our Booking.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              Discover tour packages, rent tourist vehicles, and connect with verified travel agencies — all in one platform.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-4 md:p-6 shadow-hero max-w-4xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Passengers"
                  min="1"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-gradient-warm text-primary-foreground h-auto py-3 rounded-xl font-semibold text-sm hover:opacity-90"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 mt-8 text-primary-foreground/70 text-sm">
            {[
              { icon: Shield, text: "Verified Agencies" },
              { icon: Clock, text: "24/7 Support" },
              { icon: Headphones, text: "Best Price Guarantee" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Packages</h2>
              <p className="text-muted-foreground mt-1">Handpicked tours loved by travelers</p>
            </div>
            <Link to="/packages">
              <Button variant="ghost" className="gap-1 text-secondary hover:text-secondary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPackages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PackageCard pkg={pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Vehicles</h2>
              <p className="text-muted-foreground mt-1">Reliable vehicles for every journey</p>
            </div>
            <Link to="/vehicles">
              <Button variant="ghost" className="gap-1 text-secondary hover:text-secondary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVehicles.slice(0, 3).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <VehicleCard vehicle={v} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Agencies */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Travel Agencies</h2>
              <p className="text-muted-foreground mt-1">Trusted partners for your travels</p>
            </div>
            <Link to="/agencies">
              <Button variant="ghost" className="gap-1 text-secondary hover:text-secondary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAgencies.slice(0, 3).map((agency, i) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AgencyCard agency={agency} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Travelers Say</h2>
            <p className="text-muted-foreground mt-1">Real reviews from real travelers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                    {review.avatar}
                  </div>
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
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Submit a trip request and get quotes from multiple verified agencies. It's free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/trip-request">
                <Button size="lg" className="bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl px-8">
                  Submit Trip Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup?role=agency">
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

// Sub-components
function PackageCard({ pkg }: { pkg: typeof mockPackages[0] }) {
  return (
    <Link to={`/packages/${pkg.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="relative h-48 bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-sky opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/60">
            <MapPin className="h-12 w-12" />
          </div>
          {pkg.verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
              <CheckCircle className="h-3 w-3" /> Verified
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="text-sm font-bold text-foreground">₹{pkg.price.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{pkg.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{pkg.agency} • {pkg.duration}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-orange text-orange" />
              <span className="text-sm font-medium text-foreground">{pkg.rating}</span>
              <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pkg.locations.slice(0, 2).map((loc) => (
                <span key={loc} className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{loc}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function VehicleCard({ vehicle }: { vehicle: typeof mockVehicles[0] }) {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="relative h-44 bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/50">
            <Users className="h-12 w-12" />
          </div>
          {vehicle.verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
              <CheckCircle className="h-3 w-3" /> Verified
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{vehicle.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{vehicle.owner} • {vehicle.location}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{vehicle.seats} seats</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{vehicle.type}</span>
            </div>
            <span className="text-sm font-bold text-foreground">₹{vehicle.pricePerKm}/km</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AgencyCard({ agency }: { agency: typeof mockAgencies[0] }) {
  return (
    <Link to={`/agencies/${agency.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">
            {agency.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{agency.name}</h3>
              {agency.verified && <CheckCircle className="h-4 w-4 text-accent" />}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {agency.location}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agency.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-orange text-orange" />
            <span className="text-sm font-medium text-foreground">{agency.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">{agency.packagesCount} packages</span>
        </div>
      </div>
    </Link>
  );
}
