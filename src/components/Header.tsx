import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, Instagram, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/payana-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Packages", path: "/packages" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Agencies", path: "/agencies" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, signOut, hasRole } = useAuth();

  const getDashboardLink = () => {
    if (hasRole("admin")) return "/admin";
    if (hasRole("agent")) return "/agent-dashboard";
    if (hasRole("vehicle_owner")) return "/vehicle-owner-dashboard";
    return "/my-bookings";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <div className="bg-gradient-warm text-primary-foreground text-center text-sm py-2 px-4 font-medium">
        🚀 Our mobile app is launching soon! Stay tuned for the best travel deals on the go.
      </div>

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Payana Bookings" className="h-11 w-11 object-contain rounded-lg" />
            <span className="font-display font-bold text-xl hidden sm:inline">
              <span className="text-gradient-hero">Payana</span>{" "}
              <span className="text-gradient-warm">Bookings</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path ? "bg-gradient-hero text-primary-foreground shadow-sm" : "text-foreground hover:bg-muted"}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <a href="https://www.instagram.com/payanabookings?igsh=ZXN1dmM5MzY3c2Zh" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-orange hover:bg-muted transition-colors" aria-label="Follow us on Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            {user ? (
              <>
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-sm gap-2">
                  <User className="h-4 w-4" /> Login / Sign Up
                </Button>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? "bg-gradient-hero text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                {link.name}
              </Link>
            ))}
            <a href="https://www.instagram.com/payanabookings?igsh=ZXN1dmM5MzY3c2Zh" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
              <Instagram className="h-4 w-4 text-orange" /> Follow on Instagram
            </a>
            <div className="flex gap-2 pt-2 border-t border-border">
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button className="flex-1" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Logout</Button>
                </>
              ) : (
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-warm text-primary-foreground">Login / Sign Up</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
