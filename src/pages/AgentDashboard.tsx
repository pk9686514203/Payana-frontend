import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildApiUrl, getAuthHeaders } from "@/lib/api";

type AgentDashboardData = {
  agent: {
    id: string;
    agency_name: string;
    status: string;
    phone?: string;
    email?: string;
  };
  packages: Array<{
    id: string;
    title: string;
    price: number;
    duration: string;
    status: string;
  }>;
  bookings: Array<{
    id: string;
    customer_name: string;
    customer_phone: string;
    travel_date: string;
    passengers: number;
    packages?: { title?: string };
  }>;
};

export default function AgentDashboard() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"packages" | "bookings" | "add">("packages");

  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/me/agent-dashboard"), {
        headers: getAuthHeaders(token),
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json() as Promise<AgentDashboardData>;
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
            No agency profile found. Register as a travel agency to manage packages and bookings.
          </p>
          <Link to="/signup?role=agency">
            <Button className="bg-gradient-warm text-primary-foreground rounded-xl">Register as Agency</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { agent, packages, bookings } = data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-warm">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{agent.agency_name}</h1>
            <p className="text-sm text-muted-foreground">Agent Dashboard • Status: {agent.status}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "packages" as const, label: "My Packages", icon: Building2 },
            { id: "bookings" as const, label: "Bookings", icon: ClipboardList },
            { id: "add" as const, label: "Add Package", icon: Plus },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "packages" && (
          <div className="space-y-3">
            {packages?.length === 0 && <p className="text-center text-muted-foreground py-8">No packages yet. Add one!</p>}
            {packages?.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-foreground">{pkg.title}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{pkg.price} • {pkg.duration} • Status: {pkg.status}
                  </p>
                </div>
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
                  {b.packages?.title} • {new Date(b.travel_date).toLocaleDateString()} • {b.passengers} pax
                </p>
                <p className="text-xs text-muted-foreground">📞 {b.customer_phone}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "add" && (
          <AddPackageForm
            onDone={() => {
              setTab("packages");
              qc.invalidateQueries({ queryKey: ["agent-dashboard"] });
            }}
          />
        )}
      </div>
    </Layout>
  );
}

function AddPackageForm({ onDone }: { onDone: () => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", duration: "", locations: "", includes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.duration) {
      toast.error("Fill required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/api/me/packages"), {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          duration: form.duration,
          locations: form.locations,
          includes: form.includes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      toast.success("Package submitted for approval!");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4 max-w-lg"
    >
      <h3 className="font-bold text-foreground">Add New Package</h3>
      {[
        { label: "Title *", field: "title", placeholder: "Kerala Adventure Trip" },
        { label: "Price (₹) *", field: "price", placeholder: "6499", type: "number" },
        { label: "Duration *", field: "duration", placeholder: "3 Days / 2 Nights" },
        { label: "Locations (comma-separated)", field: "locations", placeholder: "Munnar, Alleppey" },
        { label: "Includes (comma-separated)", field: "includes", placeholder: "Transport, Food, Stay" },
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
        <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit for Approval
      </Button>
    </form>
  );
}
