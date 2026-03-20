import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users, CheckCircle, MapPin, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useApprovedVehicles } from "@/hooks/useVehicles";

const vehicleTypes = ["All", "SUV", "Sedan", "Tempo Traveller", "Mini Bus", "Tourist Bus"];

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");
  const { data: vehicles, isLoading } = useApprovedVehicles();

  const filtered = (vehicles || []).filter((v) => {
    const matchSearch = v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = activeType === "All" || v.vehicle_type === activeType;
    return matchSearch && matchType;
  });

  return (
    <Layout>
      <div className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tourist Vehicles</h1>
          <p className="text-primary-foreground/70">Rent reliable vehicles for your trips</p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search vehicles or locations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {vehicleTypes.map((type) => (
            <button key={type} onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {type}
            </button>
          ))}
        </div>

        {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} vehicles found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/vehicles/${v.id}`} className="group block">
                <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="relative h-44 bg-muted">
                    <div className="absolute inset-0 bg-gradient-hero opacity-30 flex items-center justify-center"><Users className="h-12 w-12 text-primary-foreground/40" /></div>
                    {v.vehicle_owners?.is_verified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-foreground">{v.vehicle_type}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{v.vehicle_name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {v.vehicle_owners?.owner_name} • {v.location}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">{v.seats} seats</span>
                      <span className="text-base font-bold text-foreground">₹{v.price_per_km}/km</span>
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
