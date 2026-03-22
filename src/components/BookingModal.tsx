import { useState } from "react";
import { X, CheckCircle, Phone, Mail, Instagram, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import SmartSearchInput from "./SmartSearchInput";
import { useAuth } from "@/contexts/AuthContext";
import { buildApiUrl, getAuthHeaders } from "@/lib/api";
import { normalizeIndianPhone } from "@/lib/phone";

const pickupCities = ["Bengaluru", "Mysuru", "Chennai", "Hyderabad", "Hubli", "Mangalore", "Coimbatore", "Kochi"];

interface BookingModalProps {
  type: "package" | "vehicle";
  itemName: string;
  itemId: string;
  agencyName?: string;
  agencyPhone?: string;
  agencyEmail?: string;
  agencyInstagram?: string;
  priceHint?: number;
  onClose: () => void;
}

export default function BookingModal({
  type,
  itemName,
  itemId,
  agencyName,
  agencyPhone,
  agencyEmail,
  agencyInstagram,
  priceHint,
  onClose,
}: BookingModalProps) {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    passengers: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const sendOtp = async () => {
    const phone = normalizeIndianPhone(form.phone);
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(buildApiUrl("/api/otp/send"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setPhoneVerificationToken(null);
      toast.success("OTP sent to your phone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const phone = normalizeIndianPhone(form.phone);
    if (phone.length !== 10 || !otpCode.trim()) {
      toast.error("Enter phone and OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch(buildApiUrl("/api/otp/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setPhoneVerificationToken(data.phoneVerificationToken);
      toast.success("Phone verified");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date || !form.passengers) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!user || !token) {
      toast.error("Please login to book");
      return;
    }
    if (!phoneVerificationToken) {
      toast.error("Please verify your phone with OTP before booking");
      return;
    }

    const phoneNorm = normalizeIndianPhone(form.phone);
    const persons = Number(form.passengers);
    const price =
      priceHint != null && !Number.isNaN(Number(priceHint))
        ? Number(priceHint) * persons
        : 0;

    setLoading(true);
    try {
      const body = {
        bookingType: type,
        packageId: type === "package" ? itemId : undefined,
        vehicleId: type === "vehicle" ? itemId : undefined,
        name: form.name.trim(),
        phone: phoneNorm,
        email: form.email.trim(),
        pickup: form.pickup.trim(),
        drop: form.drop.trim(),
        date: form.date,
        time: form.time.trim(),
        vehicle: itemName,
        persons,
        price,
        message: form.message.trim(),
        agencyName: agencyName || "",
        phoneVerificationToken,
      };

      const res = await fetch(buildApiUrl("/api/bookings"), {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Booking failed");

      setBookingId(data.bookingId || data.data?.bookingRef || "");
      setQrDataUrl(data.qrDataUrl || null);
      setSubmitted(true);
      toast.success("Booking confirmed!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const qrData = JSON.stringify({
    bookingId,
    item: itemName,
    name: form.name,
    phone: form.phone,
    date: form.date,
    passengers: form.passengers,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm p-0 sm:p-4 touch-manipulation">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl shadow-hero max-w-md w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain min-h-0">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground pr-2">
            {submitted ? "Booking Confirmed!" : `Book ${type === "package" ? "Package" : "Vehicle"}`}
          </h2>
          <button type="button" onClick={onClose} className="p-2 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 space-y-5 pb-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Booking Request Sent!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your booking for <strong>{itemName}</strong> has been confirmed.
              </p>
              {agencyName ? (
                <p className="text-xs text-muted-foreground mt-1">Agency: <strong className="text-foreground">{agencyName}</strong></p>
              ) : null}
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-foreground font-mono break-all">{bookingId}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(bookingId);
                    toast.success("Copied!");
                  }}
                  className="p-2 min-h-10 min-w-10 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-card border border-border rounded-xl p-4">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Booking QR" className="w-40 h-40 sm:w-44 sm:h-44 object-contain" />
                ) : (
                  <QRCodeSVG value={qrData} size={160} level="M" />
                )}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Scan QR code for booking details</p>
            {(agencyPhone || agencyEmail || agencyInstagram) && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Contact Details</h4>
                <div className="space-y-2 text-sm">
                  {agencyPhone && (
                    <a href={`tel:${agencyPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-1">
                      <Phone className="h-4 w-4 text-secondary shrink-0" /> {agencyPhone}
                    </a>
                  )}
                  {agencyEmail && (
                    <a href={`mailto:${agencyEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-1">
                      <Mail className="h-4 w-4 text-secondary shrink-0" /> {agencyEmail}
                    </a>
                  )}
                  {agencyInstagram && (
                    <a
                      href={agencyInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-1"
                    >
                      <Instagram className="h-4 w-4 text-orange shrink-0" /> Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-gradient-warm text-primary-foreground rounded-xl py-5 font-semibold min-h-12"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 pb-8">
            <p className="text-sm text-muted-foreground">
              Booking: <strong className="text-foreground">{itemName}</strong>
            </p>
            {!user && <p className="text-sm text-destructive font-medium">Please login first to make a booking</p>}
            {[
              { label: "Full Name *", field: "name", type: "text", placeholder: "Enter your name" },
              { label: "Phone Number *", field: "phone", type: "tel", placeholder: "9876543210" },
              { label: "Email *", field: "email", type: "email", placeholder: "you@example.com" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary min-h-11"
                />
              </div>
            ))}

            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Phone verification (required)</p>
              <p className="text-xs text-muted-foreground">We will send a one-time code to confirm your number before you book.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={sendingOtp || !user}
                  onClick={sendOtp}
                  className="rounded-xl min-h-11"
                >
                  {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-sm min-h-11"
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={verifyingOtp || !user}
                  onClick={verifyOtp}
                  className="rounded-xl min-h-11 shrink-0"
                >
                  {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
              {phoneVerificationToken ? (
                <p className="text-xs font-medium text-accent flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Phone verified — you can confirm booking
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Pickup Location</label>
              <SmartSearchInput
                placeholder="Select pickup city"
                value={form.pickup}
                onChange={(v) => update("pickup", v)}
                suggestions={pickupCities}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Drop Location</label>
              <SmartSearchInput
                placeholder="Select drop city"
                value={form.drop}
                onChange={(v) => update("drop", v)}
                suggestions={pickupCities}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Travel Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary min-h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary min-h-11"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Passengers *</label>
              <input
                type="number"
                placeholder="Number of passengers"
                min="1"
                value={form.passengers}
                onChange={(e) => update("passengers", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary min-h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
              <textarea
                rows={3}
                placeholder="Any special requirements..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none min-h-[88px]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !user || !phoneVerificationToken}
              className="w-full bg-gradient-warm text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold min-h-12"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null} Confirm Booking
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
