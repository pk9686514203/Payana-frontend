import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api";

export function useApprovedAgencies() {
  return useQuery({
    queryKey: ["agencies", "approved"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/agencies"));
      if (!res.ok) throw new Error("Failed to load agencies");
      return res.json() as Promise<
        Array<{
          id: string;
          agency_name: string;
          phone?: string;
          email?: string;
          address?: string;
          description?: string;
          logo_url?: string;
          is_verified?: boolean;
          status?: string;
          instagram?: string;
        }>
      >;
    },
  });
}

export function useAgencyById(id: string) {
  return useQuery({
    queryKey: ["agency", id],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(`/api/agencies/${id}`));
      if (!res.ok) throw new Error("Agency not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useAgencyPackages(agentId: string) {
  return useQuery({
    queryKey: ["agency-packages", agentId],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(`/api/agencies/${agentId}/packages`));
      if (!res.ok) throw new Error("Failed to load packages");
      return res.json();
    },
    enabled: !!agentId,
  });
}
