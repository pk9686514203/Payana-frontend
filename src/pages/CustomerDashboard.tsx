import { ClipboardList, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useMyBookings } from "@/hooks/useBookings";

export default function CustomerDashboard() {
  const { data: bookings, isLoading } = useMyBookings();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-warm">
            <ClipboardList className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
            <p className="text-sm text-muted-foreground">Track all your trip bookings</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        )}

        {!isLoading && (!bookings || bookings.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No bookings yet. Start exploring packages!</p>
          </div>
        )}

        <div className="space-y-3">
          {bookings?.map((b) => (
            <div key={b.id} className="bg-card rounded-xl p-5 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">
                  {b.packages?.title || b.vehicles?.vehicle_name || "Booking"}
                </p>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  b.status === "confirmed" ? "bg-accent/10 text-accent" :
                  b.status === "pending" ? "bg-orange/10 text-orange" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                📅 {new Date(b.travel_date).toLocaleDateString()} • 👥 {b.passengers} passengers
              </p>
              <p className="text-xs text-muted-foreground mt-1">Booking ID: {b.booking_id}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
