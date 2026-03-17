import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, CheckCircle, Clock, ArrowLeft, Phone, Mail, Instagram, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BookingModal from "@/components/BookingModal";
import { mockPackages, mockAgencies } from "@/data/mockData";

export default function PackageDetailPage() {
  const { id } = useParams();
  const pkg = mockPackages.find((p) => p.id === id);
  const agency = pkg ? mockAgencies.find((a) => a.id === pkg.agencyId) : null;
  const [showBooking, setShowBooking] = useState(false);

  if (!pkg) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Package not found</h1>
          <Link to="/packages"><Button className="mt-4">Back to Packages</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/packages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-64 md:h-[28rem] bg-muted rounded-2xl overflow-hidden shadow-card">
              {pkg.image ? (
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-sky opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/50">
                    <MapPin className="h-16 w-16" />
                  </div>
                </>
              )}
              {pkg.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                  <CheckCircle className="h-4 w-4" /> Verified Agency
                </div>
              )}
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{pkg.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-orange text-orange" /> {pkg.rating} ({pkg.reviews} reviews)</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.locations.join(" → ")}</span>
              </div>
            </motion.div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">About This Tour</h2>
              <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
            </div>

            {/* Includes */}
            {pkg.includes && pkg.includes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">What's Included</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.includes.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Itinerary</h2>
              <div className="space-y-3">
                {pkg.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">{i + 1}</div>
                      {i < pkg.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1.5 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-5 border border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-4xl font-bold text-gradient-warm">₹{pkg.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
              <Button onClick={() => setShowBooking(true)} className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-6 text-base font-semibold shadow-sm">
                Book Now
              </Button>

              {/* Agency info */}
              <div className="border-t border-border pt-5">
                <h3 className="font-semibold text-sm text-foreground mb-3">Organized by</h3>
                <div className="flex items-center gap-3 mb-4">
                  {agency?.logo ? (
                    <img src={agency.logo} alt={agency.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {pkg.agency.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-foreground">{pkg.agency}</p>
                    {pkg.verified && (
                      <p className="text-xs text-accent flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Verified</p>
                    )}
                  </div>
                </div>
                {agency && (
                  <div className="space-y-2 text-sm">
                    {agency.phone && (
                      <a href={`tel:${agency.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Phone className="h-4 w-4 text-secondary" /> +91 {agency.phone}
                      </a>
                    )}
                    {agency.email && (
                      <a href={`mailto:${agency.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="h-4 w-4 text-secondary" /> {agency.email}
                      </a>
                    )}
                    {agency.instagram && (
                      <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Instagram className="h-4 w-4 text-orange" /> Follow on Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal type="package" itemName={pkg.name} onClose={() => setShowBooking(false)} />
      )}
    </Layout>
  );
}
