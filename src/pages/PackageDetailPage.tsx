import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, CheckCircle, Clock, Users, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BookingModal from "@/components/BookingModal";
import { mockPackages } from "@/data/mockData";

export default function PackageDetailPage() {
  const { id } = useParams();
  const pkg = mockPackages.find((p) => p.id === id);
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
            {/* Gallery placeholder */}
            <div className="relative h-64 md:h-96 bg-muted rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-sky opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/50">
                <MapPin className="h-16 w-16" />
              </div>
              {pkg.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
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

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Itinerary</h2>
              <div className="space-y-3">
                {pkg.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold">{i + 1}</div>
                      {i < pkg.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold text-foreground">₹{pkg.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
              <Button onClick={() => setShowBooking(true)} className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-6 text-base font-semibold">
                Book Now
              </Button>
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-sm text-foreground mb-2">Organized by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {pkg.agency.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{pkg.agency}</p>
                    {pkg.verified && (
                      <p className="text-xs text-accent flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Verified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          type="package"
          itemName={pkg.name}
          onClose={() => setShowBooking(false)}
        />
      )}
    </Layout>
  );
}
