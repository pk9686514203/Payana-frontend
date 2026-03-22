import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-royal text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/payana-logo.png" alt="Payana Bookings" onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} className="h-12 w-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold">Payana Bookings</h3>
                <p className="text-xs text-primary-foreground/60">Complete Travel Packages & Tourist Bus Bookings</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Your trusted travel marketplace for tour packages, vehicle rentals, and travel agency connections across India.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/payanabookings?igsh=ZXN1dmM5MzY3c2Zh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { name: "Home", path: "/" },
                { name: "Tour Packages", path: "/packages" },
                { name: "Vehicle Rentals", path: "/vehicles" },
                { name: "Travel Agencies", path: "/agencies" },
                { name: "Submit Trip Request", path: "/trip-request" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { name: "Register as Agency", path: "/signup?role=agency" },
                { name: "List Your Vehicle", path: "/signup?role=vehicle-owner" },
                { name: "Partner with Us", path: "/signup?role=agency" },
                { name: "Terms & Conditions", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy" },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:9390071812" className="hover:text-primary-foreground">+91 93900 71812</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:soaring.xofficial@gmail.com" className="hover:text-primary-foreground">soaring.xofficial@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 shrink-0" />
                <a href="https://www.instagram.com/payanabookings?igsh=ZXN1dmM5MzY3c2Zh" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground">@payanabookings</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Payana Bookings. All rights reserved.</p>
          <p className="mt-1">Online payment coming soon (Razorpay integration).</p>
        </div>
      </div>
    </footer>
  );
}
