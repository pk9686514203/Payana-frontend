import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { popularLocations } from "@/data/mockData";

export default function TripRequestPage() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", from: "", to: "", days: "", passengers: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.from || !form.to || !form.days || !form.passengers) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Trip request submitted! Agencies will send you quotes soon.");
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Trip Request Submitted!</h1>
            <p className="text-muted-foreground">
              Your request for <strong>{form.from} → {form.to}</strong> ({form.days} days, {form.passengers} passengers) has been sent to multiple verified agencies. You'll receive quotes soon!
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">
              Submit Another Request
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Submit Trip Request</h1>
          <p className="text-primary-foreground/70">Get quotes from multiple agencies — choose the best deal!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6">Tell us about your trip</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">From *</label>
                  <input type="text" placeholder="e.g. Bangalore" list="locations" value={form.from} onChange={(e) => update("from", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">To *</label>
                  <input type="text" placeholder="e.g. Coorg" list="locations" value={form.to} onChange={(e) => update("to", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
              </div>
              <datalist id="locations">
                {popularLocations.map((loc) => <option key={loc} value={loc} />)}
              </datalist>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Number of Days *</label>
                  <input type="number" min="1" placeholder="e.g. 3" value={form.days} onChange={(e) => update("days", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Passengers *</label>
                  <input type="number" min="1" placeholder="e.g. 6" value={form.passengers} onChange={(e) => update("passengers", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Additional Details</label>
                <textarea rows={3} placeholder="Any special requirements, preferred travel dates, budget range..." value={form.message} onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" />
              </div>
              <Button type="submit" className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold text-base">
                <Send className="h-4 w-4 mr-2" />
                Submit Trip Request
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your request will be sent to multiple verified agencies who will respond with quotes.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
