import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithOtp, verifyOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, "");
    if (!cleaned || cleaned.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const fullPhone = cleaned.startsWith("+") ? cleaned : `+91${cleaned}`;
    setLoading(true);
    const { error } = await signInWithOtp(fullPhone);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to send OTP");
      return;
    }
    toast.success("OTP sent to your phone!");
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    const cleaned = phone.replace(/\s/g, "");
    const fullPhone = cleaned.startsWith("+") ? cleaned : `+91${cleaned}`;
    setLoading(true);
    const { error } = await verifyOtp(fullPhone, otp);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid OTP");
      return;
    }
    toast.success("Logged in successfully!");
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {step === "phone" ? "Login / Sign Up" : "Verify OTP"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "phone"
                ? "Enter your phone number to continue"
                : `We sent a code to +91 ${phone}`}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-muted rounded-xl border border-input text-sm font-medium text-muted-foreground">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      maxLength={15}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  Send OTP
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify & Login
                </Button>
                <button
                  onClick={() => { setStep("phone"); setOtp(""); }}
                  className="w-full text-sm text-secondary font-medium hover:underline"
                >
                  Change phone number
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
