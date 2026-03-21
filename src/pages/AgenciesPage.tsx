import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useApprovedAgencies } from "@/hooks/useAgencies";

export default function AgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: agencies, isLoading } = useApprovedAgencies();

  const filtered = (agencies || []).filter(
    (a) =>
      a.agency_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gradient-hero text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Agencies</h1>
          <p className="text-primary-foreground/70">Connect with verified travel professionals</p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search agencies or locations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} agencies found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agency, i) => (
            <motion.div key={agency.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/agencies/${agency.id}`} className="group block">
                <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border border-border/50">
                  <div className="flex items-center gap-4 mb-4">
                    {agency.logo_url || agency.agency_name.toLowerCase().includes("soaringx") ? (
                      <img src={agency.logo_url || "/soaringx-logo.png"} alt={agency.agency_name} onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                        {agency.agency_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors truncate">{agency.agency_name}</h3>
                        {agency.is_verified && <CheckCircle className="h-4 w-4 text-accent shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {agency.address || "India"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{agency.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
