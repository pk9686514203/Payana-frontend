import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Car, Loader2, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/lib/api";
import {
  getSignupRoleFromParam,
  isValidPhoneNumber,
  mapSignupRoleToBackendRole,
  isStrongEnoughPassword,
  isValidEmail,
  signupRoles,
  type SignupRole,
} from "@/lib/auth";
import { toast } from "sonner";

type SignupFormState = {
  address: string;
  driverName: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  pricePerKm: string;
  vehicleName: string;
  vehicleType: string;
};

const initialFormState: SignupFormState = {
  address: "",
  driverName: "",
  email: "",
  name: "",
  password: "",
  phone: "",
  pricePerKm: "",
  vehicleName: "",
  vehicleType: "SUV",
};

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<SignupRole>("customer");
  const [form, setForm] = useState<SignupFormState>(initialFormState);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(getSignupRoleFromParam(searchParams.get("role")));
  }, [searchParams]);

  const nameLabel = role === "agency" ? "Agency Name" : role === "vehicle_owner" ? "Owner Name" : "Full Name";
  const namePlaceholder =
    role === "agency" ? "Your Travel Agency" : role === "vehicle_owner" ? "Owner name" : "Enter your full name";
  const nameIcon = role === "agency" ? Building2 : User;

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary ${
      errors[field] ? "border-destructive" : "border-input"
    }`;

  const updateField = (field: keyof SignupFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
    });

  const handleRoleChange = (nextRole: SignupRole) => {
    setRole(nextRole);
    setImage(null);
    setErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      return {};
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name =
        role === "agency"
          ? "Please enter agency name"
          : role === "vehicle_owner"
            ? "Please enter owner name"
            : "Please enter your name";
    }

    if (role === "agency") {
      if (!form.address.trim()) nextErrors.address = "Please enter address";
    }

    if (role === "vehicle_owner") {
      if (!form.vehicleName.trim()) nextErrors.vehicleName = "Please enter vehicle name";
      if (!form.vehicleType.trim()) nextErrors.vehicleType = "Please select vehicle type";
      if (!form.pricePerKm.trim()) nextErrors.pricePerKm = "Please enter price per km";
      if (!form.driverName.trim()) nextErrors.driverName = "Please enter driver name";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter email";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter phone number";
    } else if (!isValidPhoneNumber(form.phone)) {
      nextErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Please enter password";
    } else if (!isStrongEnoughPassword(form.password)) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);

    try {
      let imageBase64 = "";

      if (role === "vehicle_owner" && image) {
        imageBase64 = await toBase64(image);
      }

      const payload = {
        address: role === "agency" ? form.address.trim() : "",
        driverName: role === "vehicle_owner" ? form.driverName.trim() : "",
        email: form.email.trim().toLowerCase(),
        image: imageBase64,
        name: form.name.trim(),
        password: form.password,
        phone: form.phone.trim(),
        pricePerKm: role === "vehicle_owner" ? form.pricePerKm.trim() : "",
        role: mapSignupRoleToBackendRole(role),
        vehicleName: role === "vehicle_owner" ? form.vehicleName.trim() : "",
        vehicleType: role === "vehicle_owner" ? form.vehicleType.trim() : "",
      };

      const response = await fetch(buildApiUrl("/api/auth/signup"), {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = responseData.message || "Signup failed";
        setErrors((prev) => ({
          ...prev,
          email: message.toLowerCase().includes("exists") ? "Account already exists. Please login instead." : prev.email,
          form: message,
        }));
        return;
      }

      toast.success("Account created successfully!");
      navigate(`/login?registered=1`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign up to start booking trips</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">Choose Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {signupRoles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleChange(item.id)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium text-left transition-colors ${
                      role === item.id ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="block">{item.label}</span>
                    <span className={`mt-1 block text-xs ${role === item.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errors.form ? (
              <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                icon={nameIcon}
                label={nameLabel}
                field="name"
                form={form}
                error={errors.name}
                updateField={updateField}
                placeholder={namePlaceholder}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField icon={Mail} label="Email" field="email" form={form} error={errors.email} updateField={updateField} placeholder="you@example.com" type="email" />
                <TextField icon={Phone} label="Phone" field="phone" form={form} error={errors.phone} updateField={updateField} placeholder="9876543210" />
              </div>

              <TextField icon={Lock} label="Password" field="password" form={form} error={errors.password} updateField={updateField} placeholder="At least 6 characters" type="password" />

              {role === "agency" && (
                <TextField icon={MapPin} label="Address" field="address" form={form} error={errors.address} updateField={updateField} placeholder="Bengaluru, Karnataka" />
              )}

              {role === "vehicle_owner" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField icon={Car} label="Vehicle Name" field="vehicleName" form={form} error={errors.vehicleName} updateField={updateField} placeholder="Toyota Innova" />
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Vehicle Type</label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          value={form.vehicleType}
                          onChange={(e) => updateField("vehicleType", e.target.value)}
                          className={`${inputClass("vehicleType")} pl-10`}
                        >
                          {["SUV", "Sedan", "Tempo Traveller", "Mini Bus", "Tourist Bus"].map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.vehicleType ? <p className="mt-1 text-xs text-destructive">{errors.vehicleType}</p> : null}
                    </div>
                    <TextField icon={Car} label="Price Per KM" field="pricePerKm" form={form} error={errors.pricePerKm} updateField={updateField} placeholder="18" type="number" />
                    <TextField icon={User} label="Driver Name" field="driverName" form={form} error={errors.driverName} updateField={updateField} placeholder="Assigned driver" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Vehicle Image Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    {image ? <p className="mt-1 text-xs text-muted-foreground">{image.name}</p> : null}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl py-5 font-semibold"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-secondary font-medium hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

function TextField({
  icon: Icon,
  label,
  field,
  form,
  error,
  updateField,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  field: keyof SignupFormState;
  form: SignupFormState;
  error?: string;
  updateField: (field: keyof SignupFormState, value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          placeholder={placeholder}
          value={String(form[field] ?? "")}
          onChange={(e) => updateField(field, e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary ${
            error ? "border-destructive" : "border-input"
          }`}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
