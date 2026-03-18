import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useApprovedAgencies() {
  return useQuery({
    queryKey: ["agencies", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("status", "approved")
        .order("is_verified", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAgencyById(id: string) {
  return useQuery({
    queryKey: ["agency", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useAgencyPackages(agentId: string) {
  return useQuery({
    queryKey: ["agency-packages", agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("agent_id", agentId)
        .eq("status", "approved");
      if (error) throw error;
      return data;
    },
    enabled: !!agentId,
  });
}
