import { useState } from "react";
import { Car, Plus, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function VehicleOwnerDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"vehicles" | "bookings" | "add">("vehicles");

  const { data: owner } = useQuery({
    queryKey: ["my-vehicle-owner", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicle_owners").select("*").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["my-vehicles", owner?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("owner_id", owner!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!owner,
  });

  const { data: bookings } = useQuery({
    queryKey: ["vehicle-bookings", owner?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, vehicles!inner(vehicle_name, owner_id)")
        .eq("vehicles.owner_id", owner!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!owner,
  });

  if (!owner) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">No vehicle owner profile found.</p>
          <RegisterOwnerForm userId={user?.id || ""} />
        </div>
      </Layout>
    );
  }

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

        <div className="flex gap-2 mb-6">
          {[
            { id: "vehicles" as const, label: "My Vehicles", icon: Car },
            { id: "bookings" as const, label: "Bookings", icon: ClipboardList },
            { id: "add" as const, label: "Add Vehicle", icon: Plus },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
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
                <p className="text-sm text-muted-foreground">{v.vehicle_type} • {v.seats} seats • ₹{v.price_per_km}/km • {v.status}</p>
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
                <p className="text-sm text-muted-foreground">{b.vehicles?.vehicle_name} • {new Date(b.travel_date).toLocaleDateString()} • {b.passengers} pax</p>
                <p className="text-xs text-muted-foreground">📞 {b.customer_phone}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "add" && <AddVehicleForm ownerId={owner.id} onDone={() => { setTab("vehicles"); qc.invalidateQueries({ queryKey: ["my-vehicles"] }); }} />}
      </div>
    </Layout>
  );
}

function AddVehicleForm({ ownerId, onDone }: { ownerId: string; onDone: () => void }) {
  const [form, setForm] = useState({ vehicle_name: "", vehicle_type: "SUV", seats: "", price_per_km: "", location: "", contact_phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_name || !form.seats || !form.price_per_km || !form.location) { toast.error("Fill required fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("vehicles").insert({
      owner_id: ownerId,
      vehicle_name: form.vehicle_name,
      vehicle_type: form.vehicle_type,
      seats: Number(form.seats),
      price_per_km: Number(form.price_per_km),
      location: form.location,
      contact_phone: form.contact_phone,
      status: "pending",
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Vehicle submitted for approval!");
    onDone();
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
          <input type={type || "text"} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Vehicle Type *</label>
        <select value={form.vehicle_type} onChange={(e) => update("vehicle_type", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
          {["SUV", "Sedan", "Tempo Traveller", "Mini Bus", "Tourist Bus", "Hatchback"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit for Approval
      </Button>
    </form>
  );
}

function RegisterOwnerForm({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ owner_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.owner_name || !form.phone) { toast.error("Fill required fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("vehicle_owners").insert({ ...form, user_id: userId, status: "pending" });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    await supabase.from("user_roles").insert({ user_id: userId, role: "vehicle_owner" as const });
    toast.success("Registered! Awaiting admin approval.");
    qc.invalidateQueries({ queryKey: ["my-vehicle-owner"] });
  };

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4 max-w-lg mx-auto mt-8">
      <h3 className="font-bold text-foreground text-lg">Register as Vehicle Owner</h3>
      {[
        { label: "Owner Name *", field: "owner_name", placeholder: "Your name" },
        { label: "Phone *", field: "phone", placeholder: "+91 98765 43210" },
        { label: "Email", field: "email", placeholder: "you@email.com" },
      ].map(({ label, field, placeholder }) => (
        <div key={field}>
          <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
          <input type="text" placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      ))}
      <Button type="submit" disabled={loading} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Register
      </Button>
    </form>
  );
}
