import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingModalProps {
  type: "package" | "vehicle";
  itemName: string;
  onClose: () => void;
}

export default function BookingModal({ type, itemName, onClose }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    passengers: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.passengers) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Will connect to backend later
    setSubmitted(true);
    toast.success("Booking request sent successfully!");
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-hero max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {submitted ? "Booking Confirmed!" : `Book ${type === "package" ? "Package" : "Vehicle"}`}
          </h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Request Sent!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Booking request for <strong>{itemName}</strong> sent successfully. The agency will contact you soon.
              </p>
            </div>
            <Button onClick={onClose} className="w-full bg-gradient-hero text-primary-foreground rounded-xl">
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
              { label: "Travel Date *", field: "date", type: "date", placeholder: "" },
              { label: "Passengers *", field: "passengers", type: "number", placeholder: "Number of passengers" },
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
