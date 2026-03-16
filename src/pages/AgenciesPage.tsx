import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Star, CheckCircle, Package } from "lucide-react";
import Layout from "@/components/Layout";
import { mockAgencies } from "@/data/mockData";

export default function AgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockAgencies.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Agencies</h1>
          <p className="text-primary-foreground/70">Connect with verified travel professionals</p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agencies or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} agencies found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agency, i) => (
            <motion.div key={agency.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/agencies/${agency.id}`} className="group block">
                <div className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {agency.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors truncate">{agency.name}</h3>
                        {agency.verified && <CheckCircle className="h-4 w-4 text-accent shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {agency.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agency.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                      <span className="text-sm font-medium text-foreground">{agency.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" /> {agency.packagesCount} packages
                    </span>
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
