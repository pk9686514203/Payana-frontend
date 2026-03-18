import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useApprovedPackages() {
  return useQuery({
    queryKey: ["packages", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*, agents!inner(agency_name, logo_url, is_verified, phone, email, instagram)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePackageById(id: string) {
  return useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*, agents!inner(agency_name, logo_url, is_verified, phone, email, instagram, description)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
