import { useQuery } from "@tanstack/react-query";
import { buildApiUrl, getAuthHeaders } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function useMyBookings() {
  const { user, token } = useAuth();
  return useQuery({
    queryKey: ["bookings", "my", user?.id],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/me/bookings"), {
        headers: getAuthHeaders(token),
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      return res.json() as Promise<
        Array<{
          id: string;
          booking_id: string;
          travel_date: string;
          passengers: number;
          status: string;
          packages?: { title?: string } | null;
          vehicles?: { vehicle_name?: string } | null;
          agency_name?: string;
        }>
      >;
    },
    enabled: !!user && !!token,
  });
}
