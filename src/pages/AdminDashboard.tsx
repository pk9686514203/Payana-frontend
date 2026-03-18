import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Package, Car, ClipboardList, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Tab = "bookings" | "agents" | "vehicles" | "packages" | "users";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("bookings");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "bookings", label: "Bookings", icon: ClipboardList },
    { id: "agents", label: "Agencies", icon: Users },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "packages", label: "Packages", icon: Package },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-hero">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage the entire platform</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground shadow-card" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && <AdminBookings />}
        {tab === "agents" && <AdminApprovals table="agents" label="Agency" nameField="agency_name" />}
        {tab === "vehicles" && <AdminApprovals table="vehicles" label="Vehicle" nameField="vehicle_name" />}
        {tab === "packages" && <AdminApprovals table="packages" label="Package" nameField="title" />}
      </div>
    </Layout>
  );
}

function AdminBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, packages(title), vehicles(vehicle_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-3">
      {(!bookings || bookings.length === 0) && <EmptyState text="No bookings yet" />}
      {bookings?.map((b) => (
        <div key={b.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{b.customer_name}</p>
              <p className="text-sm text-muted-foreground">
                {b.packages?.title || b.vehicles?.vehicle_name || "N/A"} • {new Date(b.travel_date).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">📞 {b.customer_phone} • {b.passengers} pax</p>
            </div>
            <StatusBadge status={b.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminApprovals({ table, label, nameField }: { table: "agents" | "vehicles" | "packages"; label: string; nameField: string }) {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "approved" && (table === "agents" || table === "vehicles")) {
        // Type workaround: only agents table has is_verified
      }
      const { error } = await supabase.from(table).update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      toast.success(`${label} status updated`);
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-3">
      {(!items || items.length === 0) && <EmptyState text={`No ${label.toLowerCase()}s found`} />}
      {items?.map((item: any) => (
        <div key={item.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-foreground">{item[nameField]}</p>
              <p className="text-xs text-muted-foreground">
                Status: <StatusBadge status={item.status} /> • Created: {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {item.status !== "approved" && (
                <Button size="sm" onClick={() => updateStatus.mutate({ id: item.id, status: "approved" })} className="bg-accent text-accent-foreground rounded-lg text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" /> Approve
                </Button>
              )}
              {item.status !== "rejected" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: item.id, status: "rejected" })} className="rounded-lg text-xs text-destructive border-destructive/30">
                  <XCircle className="h-3 w-3 mr-1" /> Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-orange/10 text-orange",
    approved: "bg-accent/10 text-accent",
    confirmed: "bg-accent/10 text-accent",
    rejected: "bg-destructive/10 text-destructive",
    cancelled: "bg-destructive/10 text-destructive",
    completed: "bg-secondary/10 text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-sm">{text}</p>
    </div>
  );
}
