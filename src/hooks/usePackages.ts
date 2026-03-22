import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api";

export function useApprovedPackages() {
  return useQuery({
    queryKey: ["packages", "approved"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/packages"));
      if (!res.ok) throw new Error("Failed to load packages");
      return res.json() as Promise<
        Array<{
          id: string;
          title: string;
          price: number;
          duration: string;
          description?: string;
          images?: string[];
          locations?: string[];
          itinerary?: string[];
          includes?: string[];
          agents?: {
            agency_name?: string;
            logo_url?: string;
            is_verified?: boolean;
            phone?: string;
            email?: string;
            instagram?: string;
            description?: string;
          };
        }>
      >;
    },
  });
}

export function usePackageById(id: string) {
  return useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(`/api/packages/${id}`));
      if (!res.ok) throw new Error("Package not found");
      return res.json();
    },
    enabled: !!id,
  });
}
