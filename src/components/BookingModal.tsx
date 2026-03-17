import { useState } from "react";
import { X, CheckCircle, Phone, Mail, Instagram, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import SmartSearchInput from "./SmartSearchInput";
import { pickupCities } from "@/data/mockData";

interface BookingModalProps {
  type: "package" | "vehicle";
  itemName: string;
  onClose: () => void;
}

function generateBookingId() {
  const prefix = "PB";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export default function BookingModal({ type, itemName, onClose }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    date: "",
    passengers: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.passengers) {
      toast.error("Please fill in all required fields");
      return;
    }
    const id = generateBookingId();
    setBookingId(id);
    setSubmitted(true);
    toast.success("Booking request sent successfully!");
    console.log("📧 BOOKING NOTIFICATION:", { bookingId: id, ...form, item: itemName, type });
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const qrData = JSON.stringify({
    bookingId,
    item: itemName,
    name: form.name,
    phone: form.phone,
    date: form.date,
    passengers: form.passengers,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-hero max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {submitted ? "🎉 Booking Confirmed!" : `Book ${type === "package" ? "Package" : "Vehicle"}`}
          </h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Booking Request Sent!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your booking for <strong>{itemName}</strong> has been confirmed.
              </p>
            </div>

            {/* Booking ID */}
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-foreground font-mono">{bookingId}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(bookingId); toast.success("Booking ID copied!"); }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-card border border-border rounded-xl p-4">
                <QRCodeSVG value={qrData} size={160} level="M" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Scan QR code for booking details</p>

            {/* Agency Contact */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Agency Contact Details</h4>
              <div className="space-y-2 text-sm">
                <a href="tel:9390071812" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4 text-secondary" /> +91 93900 71812
                </a>
                <a href="mailto:soaring.xofficial@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4 text-secondary" /> soaring.xofficial@gmail.com
                </a>
                <a href="https://www.instagram.com/soaringx.tour" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-4 w-4 text-orange" /> @soaringx.tour
                </a>
              </div>
            </div>

            <Button onClick={onClose} className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">Booking: <strong className="text-foreground">{itemName}</strong></p>
            {[
              { label: "Full Name *", field: "name", type: "text", placeholder: "Enter your name" },
              { label: "Phone Number *", field: "phone", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Email *", field: "email", type: "email", placeholder: "you@example.com" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Pickup Location *</label>
              <SmartSearchInput
                placeholder="Select pickup city"
                value={form.pickup}
                onChange={(v) => update("pickup", v)}
                suggestions={pickupCities}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Travel Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Passengers *</label>
              <input
                type="number"
                placeholder="Number of passengers"
                min="1"
                value={form.passengers}
                onChange={(e) => update("passengers", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
              <textarea
                rows={3}
                placeholder="Any special requirements..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold">
              Submit Booking Request
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Online payment coming soon (Razorpay integration).
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
