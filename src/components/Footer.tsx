import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Payana Bookings</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Your trusted travel marketplace for tour packages, vehicle rentals, and travel agency connections across India.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
                { name: "Partner with Us", path: "#" },
                { name: "Terms & Conditions", path: "#" },
                { name: "Privacy Policy", path: "#" },
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
                <span>123 MG Road, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@payanabookings.com</span>
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
