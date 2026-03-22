import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle, Clock, ArrowLeft, Phone, Mail, Instagram, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BookingModal from "@/components/BookingModal";
import { usePackageById } from "@/hooks/usePackages";
import { useAuth } from "@/contexts/AuthContext";

type SelectedPackage = {
  _id: string;
  agents?: {
    agency_name?: string;
    email?: string;
    instagram?: string;
    is_verified?: boolean;
    logo_url?: string;
    phone?: string;
  };
  description?: string;
  duration: string;
  id?: string;
  images?: string[];
  includes?: string[];
  itinerary?: string[];
  locations?: string[];
  price: number;
  title: string;
};

export default function PackageDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { data: pkg, isLoading } = usePackageById(id || "");
  const [persons, setPersons] = useState(1);
  const [bookingDate, setBookingDate] = useState<Date | string>(new Date());
  const [isBooking, setIsBooking] = useState(false);

  const packageData = pkg ? { ...pkg, _id: pkg.id } : null;
  const selectedPackage = (location.state as { package?: SelectedPackage } | null)?.package || packageData;
  const itinerary = Array.isArray(selectedPackage?.itinerary) ? (selectedPackage.itinerary as string[]) : [];
  const bookingDateValue = bookingDate instanceof Date ? bookingDate.toISOString().split("T")[0] : bookingDate;
  const totalPrice = selectedPackage ? selectedPackage.price * persons : 0;

  const handleBooking = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      if (!selectedPackage) {
        alert("Package not found");
        return;
      }

      setIsBooking(true);

      const res = await fetch("https://payana-website-1.onrender.com/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          packageId: selectedPackage._id,
          date: bookingDate,
          persons: persons,
          totalPrice: selectedPackage.price * persons
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Booking request failed");
      }

      if (data.success) {
        alert("Booking Confirmed");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading && !selectedPackage) {
    return <Layout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div></Layout>;
  }

  if (!selectedPackage) {
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
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 md:h-[28rem] bg-muted rounded-2xl overflow-hidden shadow-card">
              {selectedPackage.images?.[0] || selectedPackage.title.toLowerCase().includes("kerala") || selectedPackage.title.toLowerCase().includes("ooty") ? (
                <img src={selectedPackage.title.toLowerCase().includes("kerala") ? "/kerala-package.png" : selectedPackage.title.toLowerCase().includes("ooty") ? "/ooty-package.png" : selectedPackage.images?.[0] || "/kerala-package.png"} alt={selectedPackage.title} onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-sky opacity-50 flex items-center justify-center"><MapPin className="h-16 w-16 text-primary-foreground/50" /></div>
              )}
              {selectedPackage.agents?.is_verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                  <CheckCircle className="h-4 w-4" /> Verified Agency
                </div>
              )}
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedPackage.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {selectedPackage.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedPackage.locations?.join(" -> ")}</span>
              </div>
            </motion.div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">About This Tour</h2>
              <p className="text-muted-foreground leading-relaxed">{selectedPackage.description}</p>
            </div>

            {selectedPackage.includes && selectedPackage.includes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">What's Included</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedPackage.includes.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {itinerary.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Itinerary</h2>
                <div className="space-y-3">
                  {itinerary.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">{i + 1}</div>
                        {i < itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <p className="text-sm text-muted-foreground pt-1.5 leading-relaxed">{String(item)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-5 border border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-4xl font-bold text-gradient-warm">{"\u20B9"}{selectedPackage.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>

              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                <div>
                  <label htmlFor="package-persons" className="text-sm font-medium text-foreground mb-1 block">
                    Persons
                  </label>
                  <input
                    id="package-persons"
                    type="number"
                    min="1"
                    value={persons}
                    onChange={(e) => setPersons(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="package-booking-date" className="text-sm font-medium text-foreground mb-1 block">
                    Travel Date
                  </label>
                  <input
                    id="package-booking-date"
                    type="date"
                    value={bookingDateValue}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total price</span>
                  <span className="font-semibold text-foreground">{"\u20B9"}{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={openBooking} className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-6 text-base font-semibold shadow-sm min-h-12">
                Book Now
              </Button>

              <div className="border-t border-border pt-5">
                <h3 className="font-semibold text-sm text-foreground mb-3">Organized by</h3>
                <div className="flex items-center gap-3 mb-4">
                  {selectedPackage.agents?.logo_url || selectedPackage.agents?.agency_name?.toLowerCase().includes("soaringx") ? (
                    <img src={selectedPackage.agents?.logo_url || "/soaringx-logo.png"} alt={selectedPackage.agents?.agency_name || "SoaringX"} onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {selectedPackage.agents?.agency_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-foreground">{selectedPackage.agents?.agency_name}</p>
                    {selectedPackage.agents?.is_verified && (
                      <p className="text-xs text-accent flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Verified</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedPackage.agents?.phone && (
                    <a href={`tel:${selectedPackage.agents.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4 text-secondary" /> {selectedPackage.agents.phone}
                    </a>
                  )}
                  {selectedPackage.agents?.email && (
                    <a href={`mailto:${selectedPackage.agents.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4 text-secondary" /> {selectedPackage.agents.email}
                    </a>
                  )}
                  {selectedPackage.agents?.instagram && (
                    <a href={selectedPackage.agents.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Instagram className="h-4 w-4 text-orange" /> Follow on Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && selectedPackage && (
        <BookingModal
          type="package"
          itemName={selectedPackage.title}
          itemId={String(selectedPackage._id || selectedPackage.id)}
          agencyName={selectedPackage.agents?.agency_name}
          agencyPhone={selectedPackage.agents?.phone}
          agencyEmail={selectedPackage.agents?.email}
          agencyInstagram={selectedPackage.agents?.instagram}
          priceHint={selectedPackage.price}
          onClose={() => setShowBooking(false)}
        />
      )}
    </Layout>
  );
}
