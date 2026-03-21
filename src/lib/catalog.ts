import { resolveApiAssetUrl } from "@/lib/api";

export type BackendAgency = {
  _id: string;
  description?: string;
  email?: string;
  instagram?: string | null;
  location?: string;
  logo?: string | null;
  name: string;
  owner?: {
    name?: string;
  };
  phone?: string;
  verified?: boolean;
};

export type BackendPackage = {
  _id: string;
  agency?: BackendAgency;
  description?: string;
  duration: string;
  image?: string | null;
  includes?: string[];
  itinerary?: string[];
  locations?: string[];
  name: string;
  price: number;
  verified?: boolean;
};

export function mapAgency(agency: BackendAgency) {
  return {
    address: agency.location || "India",
    agency_name: agency.name,
    description: agency.description || "",
    email: agency.email,
    id: agency._id,
    instagram: agency.instagram || null,
    is_verified: Boolean(agency.verified),
    logo_url: resolveApiAssetUrl(agency.logo),
    owner_name: agency.owner?.name || "Agency Owner",
    phone: agency.phone || "",
  };
}

export function mapPackage(pkg: BackendPackage) {
  const imageUrl = resolveApiAssetUrl(pkg.image);

  return {
    agents: pkg.agency
      ? {
          agency_name: pkg.agency.name || "Verified Agency",
          description: pkg.agency.description,
          email: pkg.agency.email,
          instagram: pkg.agency.instagram || undefined,
          is_verified: Boolean(pkg.agency.verified || pkg.verified),
          logo_url: resolveApiAssetUrl(pkg.agency.logo),
          phone: pkg.agency.phone,
        }
      : {
          agency_name: "Verified Agency",
          description: undefined,
          email: undefined,
          instagram: undefined,
          is_verified: Boolean(pkg.verified),
          logo_url: undefined,
          phone: undefined,
        },
    description: pkg.description || "",
    duration: pkg.duration,
    id: pkg._id,
    images: imageUrl ? [imageUrl] : [],
    includes: pkg.includes || [],
    itinerary: pkg.itinerary || [],
    locations: pkg.locations || [],
    price: pkg.price,
    title: pkg.name,
  };
}
