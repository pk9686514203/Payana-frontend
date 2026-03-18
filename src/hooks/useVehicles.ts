import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useApprovedVehicles() {
  return useQuery({
    queryKey: ["vehicles", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*, vehicle_owners!inner(owner_name, is_verified, phone)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useVehicleById(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*, vehicle_owners!inner(owner_name, is_verified, phone, email)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
