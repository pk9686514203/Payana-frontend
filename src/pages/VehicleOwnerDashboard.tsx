import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Plus, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildApiUrl, getAuthHeaders } from "@/lib/api";

type OwnerDashboardData = {
  owner: { id: string; owner_name: string; status: string };
  vehicles: Array<{
    id: string;
    vehicle_name: string;
    vehicle_type: string;
    seats: number;
    price_per_km: number;
    location: string;
    status: string;
  }>;
  bookings: Array<{
    id: string;
    customer_name: string;
    customer_phone: string;
    travel_date: string;
    passengers: number;
    vehicles?: { vehicle_name?: string };
  }>;
};

export default function VehicleOwnerDashboard() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"vehicles" | "bookings" | "add">("vehicles");

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicle-owner-dashboard"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/me/vehicle-owner-dashboard"), {
        headers: getAuthHeaders(token),
      });
      if (res.status === 403 || res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json() as Promise<OwnerDashboardData>;
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-muted-foreground">
            No vehicle owner profile found. Sign up as a vehicle owner to list vehicles and receive bookings.
          </p>
          <Link to="/signup?role=vehicle-owner">
            <Button className="bg-gradient-warm text-primary-foreground rounded-xl">Register as Vehicle Owner</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { owner, vehicles, bookings } = data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-sky">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{owner.owner_name}</h1>
            <p className="text-sm text-muted-foreground">Vehicle Owner Dashboard • Status: {owner.status}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "vehicles" as const, label: "My Vehicles", icon: Car },
            { id: "bookings" as const, label: "Bookings", icon: ClipboardList },
            { id: "add" as const, label: "Add Vehicle", icon: Plus },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "vehicles" && (
          <div className="space-y-3">
            {vehicles?.length === 0 && <p className="text-center text-muted-foreground py-8">No vehicles yet</p>}
            {vehicles?.map((v) => (
              <div key={v.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
                <p className="font-semibold text-foreground">{v.vehicle_name}</p>
                <p className="text-sm text-muted-foreground">
                  {v.vehicle_type} • {v.seats} seats • ₹{v.price_per_km}/km • {v.status}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "bookings" && (
          <div className="space-y-3">
            {bookings?.length === 0 && <p className="text-center text-muted-foreground py-8">No bookings yet</p>}
            {bookings?.map((b) => (
              <div key={b.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
                <p className="font-semibold text-foreground">{b.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {b.vehicles?.vehicle_name} • {new Date(b.travel_date).toLocaleDateString()} • {b.passengers} pax
                </p>
                <p className="text-xs text-muted-foreground">📞 {b.customer_phone}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "add" && (
          <AddVehicleForm
            onDone={() => {
              setTab("vehicles");
              qc.invalidateQueries({ queryKey: ["vehicle-owner-dashboard"] });
            }}
          />
        )}
      </div>
    </Layout>
  );
}

function AddVehicleForm({ onDone }: { onDone: () => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    vehicle_name: "",
    vehicle_type: "SUV",
    seats: "",
    price_per_km: "",
    location: "",
    contact_phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_name || !form.seats || !form.price_per_km || !form.location) {
      toast.error("Fill required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/api/me/vehicles"), {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          vehicle_name: form.vehicle_name,
          vehicle_type: form.vehicle_type,
          seats: Number(form.seats),
          price_per_km: Number(form.price_per_km),
          location: form.location,
          contact_phone: form.contact_phone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      toast.success("Vehicle submitted for approval!");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4 max-w-lg">
      <h3 className="font-bold text-foreground">Add New Vehicle</h3>
      {[
        { label: "Vehicle Name *", field: "vehicle_name", placeholder: "Toyota Innova" },
        { label: "Seats *", field: "seats", placeholder: "7", type: "number" },
        { label: "Price per KM (₹) *", field: "price_per_km", placeholder: "16", type: "number" },
        { label: "Location *", field: "location", placeholder: "Bengaluru" },
        { label: "Contact Phone", field: "contact_phone", placeholder: "+91 98765 43210" },
      ].map(({ label, field, placeholder, type }) => (
        <div key={field}>
          <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
          <input
            type={type || "text"}
            placeholder={placeholder}
            value={form[field as keyof typeof form]}
            onChange={(e) => update(field, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Vehicle Type *</label>
        <select
          value={form.vehicle_type}
          onChange={(e) => update("vehicle_type", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          {["SUV", "Sedan", "Tempo Traveller", "Mini Bus", "Tourist Bus", "Hatchback"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit for Approval
      </Button>
    </form>
  );
}
