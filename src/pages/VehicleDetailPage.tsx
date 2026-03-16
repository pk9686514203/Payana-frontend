import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Users, MapPin, Star, CheckCircle, Fuel, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BookingModal from "@/components/BookingModal";
import { mockVehicles } from "@/data/mockData";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const vehicle = mockVehicles.find((v) => v.id === id);
  const [showBooking, setShowBooking] = useState(false);

  if (!vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Vehicle not found</h1>
          <Link to="/vehicles"><Button className="mt-4">Back to Vehicles</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/vehicles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Vehicles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 md:h-96 bg-muted rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-hero opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/40">
                <Users className="h-16 w-16" />
              </div>
              {vehicle.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> Verified Owner
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{vehicle.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-orange text-orange" /> {vehicle.rating}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {vehicle.seats} seats</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vehicle.location}</span>
                <span className="bg-muted px-3 py-1 rounded-lg">{vehicle.type}</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Owner Details</h2>
              <div className="bg-muted rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                  {vehicle.owner.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{vehicle.owner}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-3xl font-bold text-foreground">₹{vehicle.pricePerKm}</p>
                <p className="text-xs text-muted-foreground">per kilometer</p>
              </div>
              <Button onClick={() => setShowBooking(true)} className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-6 text-base font-semibold">
                Book Vehicle
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Online payment coming soon (Razorpay integration).
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal type="vehicle" itemName={vehicle.name} onClose={() => setShowBooking(false)} />
      )}
    </Layout>
  );
}
