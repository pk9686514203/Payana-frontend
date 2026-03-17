import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { mockPackages } from "@/data/mockData";

export default function PackagesPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("to") || "");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = mockPackages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.locations.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  return (
    <Layout>
      <div className="bg-gradient-hero text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tour Packages</h1>
          <p className="text-primary-foreground/70">Discover amazing travel experiences across India</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search packages, locations, or agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground mb-6">{sorted.length} packages found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/packages/${pkg.id}`} className="group block">
                <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                  <div className="relative h-52 bg-muted overflow-hidden">
                    {pkg.image ? (
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-sky opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/50">
                          <MapPin className="h-12 w-12" />
                        </div>
                      </>
                    )}
                    {pkg.verified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="text-sm font-bold text-foreground">₹{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors text-lg">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{pkg.agency} • {pkg.duration}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                        <span className="text-sm font-semibold text-foreground">{pkg.rating}</span>
                        <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                      </div>
                      <Button size="sm" className="bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-lg text-xs shadow-sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
