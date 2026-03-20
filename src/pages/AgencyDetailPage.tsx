import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail, Instagram, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAgencyById, useAgencyPackages } from "@/hooks/useAgencies";

export default function AgencyDetailPage() {
  const { id } = useParams();
  const { data: agency, isLoading } = useAgencyById(id || "");
  const { data: agencyPackages } = useAgencyPackages(id || "");

  if (isLoading) {
    return <Layout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div></Layout>;
  }

  if (!agency) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Agency not found</h1>
          <Link to="/agencies"><Button className="mt-4">Back to Agencies</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/agencies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Agencies
        </Link>

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card mb-8 border border-border/50">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {agency.logo_url ? (
              <img src={agency.logo_url} alt={agency.agency_name} className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0">
                {agency.agency_name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{agency.agency_name}</h1>
                {agency.is_verified && (
                  <span className="flex items-center gap-1 bg-accent/10 text-accent px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="h-4 w-4" /> {agency.address || "India"} • Owned by {agency.owner_name}
              </p>
              <p className="text-muted-foreground">{agency.description}</p>
              {(agency.phone || agency.email || agency.instagram) && (
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  {agency.phone && (
                    <a href={`tel:${agency.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4 text-secondary" /> {agency.phone}
                    </a>
                  )}
                  {agency.email && (
                    <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4 text-secondary" /> {agency.email}
                    </a>
                  )}
                  {agency.instagram && (
                    <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Instagram className="h-4 w-4 text-orange" /> Follow on Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-6">Packages by {agency.agency_name}</h2>
        {(!agencyPackages || agencyPackages.length === 0) ? (
          <p className="text-muted-foreground">No packages available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyPackages.map((pkg) => (
              <Link key={pkg.id} to={`/packages/${pkg.id}`} className="group block">
                <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {pkg.images?.[0] ? (
                      <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-sky opacity-50" />
                    )}
                    <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="text-sm font-bold text-foreground">₹{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors">{pkg.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{pkg.duration}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
