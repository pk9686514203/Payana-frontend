import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (isSignUp && !fullName) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      const { error, user } = await signIn(email, password);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      toast.success("Logged in successfully!");
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Sign up to start booking trips" : "Login to your account"}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    minLength={6}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                {isSignUp ? "Create Account" : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-secondary font-medium hover:underline"
              >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
