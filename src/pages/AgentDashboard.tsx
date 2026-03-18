import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, ClipboardList, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AgentDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"packages" | "bookings" | "add">("packages");

  const { data: agent } = useQuery({
    queryKey: ["my-agent", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("agents").select("*").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ["my-packages", agent?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("agent_id", agent!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!agent,
  });

  const { data: bookings } = useQuery({
    queryKey: ["agent-bookings", agent?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, packages!inner(title, agent_id)")
        .eq("packages.agent_id", agent!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!agent,
  });

  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">No agency profile found. Please register as an agent first.</p>
          <RegisterAgentForm userId={user?.id || ""} />
        </div>
      </Layout>
    );
  }

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

        <div className="flex gap-2 mb-6">
          {[
            { id: "packages" as const, label: "My Packages", icon: Building2 },
            { id: "bookings" as const, label: "Bookings", icon: ClipboardList },
            { id: "add" as const, label: "Add Package", icon: Plus },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "packages" && (
          <div className="space-y-3">
            {packagesLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />}
            {packages?.length === 0 && <p className="text-center text-muted-foreground py-8">No packages yet. Add one!</p>}
            {packages?.map((pkg) => (
              <div key={pkg.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">{pkg.title}</p>
                  <p className="text-sm text-muted-foreground">₹{pkg.price} • {pkg.duration} • Status: {pkg.status}</p>
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
                <p className="text-sm text-muted-foreground">{b.packages?.title} • {new Date(b.travel_date).toLocaleDateString()} • {b.passengers} pax</p>
                <p className="text-xs text-muted-foreground">📞 {b.customer_phone}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "add" && <AddPackageForm agentId={agent.id} onDone={() => { setTab("packages"); qc.invalidateQueries({ queryKey: ["my-packages"] }); }} />}
      </div>
    </Layout>
  );
}

function AddPackageForm({ agentId, onDone }: { agentId: string; onDone: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", price: "", duration: "", locations: "", includes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.duration) { toast.error("Fill required fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("packages").insert({
      agent_id: agentId,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      locations: form.locations.split(",").map((s) => s.trim()).filter(Boolean),
      includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
      status: "pending",
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Package submitted for approval!");
    onDone();
  };

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4 max-w-lg">
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
          <input type={type || "text"} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit for Approval
      </Button>
    </form>
  );
}

function RegisterAgentForm({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ agency_name: "", owner_name: "", phone: "", email: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agency_name || !form.owner_name || !form.phone) { toast.error("Fill required fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("agents").insert({ ...form, user_id: userId, status: "pending" });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    // Add agent role
    await supabase.from("user_roles").insert({ user_id: userId, role: "agent" as const });
    toast.success("Agency registered! Awaiting admin approval.");
    qc.invalidateQueries({ queryKey: ["my-agent"] });
  };

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4 max-w-lg mx-auto mt-8">
      <h3 className="font-bold text-foreground text-lg">Register Your Agency</h3>
      {[
        { label: "Agency Name *", field: "agency_name", placeholder: "Your Travel Agency" },
        { label: "Owner Name *", field: "owner_name", placeholder: "Your name" },
        { label: "Phone *", field: "phone", placeholder: "+91 98765 43210" },
        { label: "Email", field: "email", placeholder: "agency@email.com" },
      ].map(({ label, field, placeholder }) => (
        <div key={field}>
          <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
          <input type="text" placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Register Agency
      </Button>
    </form>
  );
}
