import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api";

export function useApprovedVehicles() {
  return useQuery({
    queryKey: ["vehicles", "approved"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/vehicles"));
      if (!res.ok) throw new Error("Failed to load vehicles");
      return res.json() as Promise<
        Array<{
          id: string;
          vehicle_name: string;
          vehicle_type: string;
          location: string;
          seats: number;
          price_per_km: number;
          vehicle_owners?: {
            owner_name?: string;
            is_verified?: boolean;
            phone?: string;
            email?: string;
          };
        }>
      >;
    },
  });
}

export function useVehicleById(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(`/api/vehicles/${id}`));
      if (!res.ok) throw new Error("Vehicle not found");
      return res.json();
    },
    enabled: !!id,
  });
}
