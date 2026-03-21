export type SignupRole = "customer" | "agency" | "vehicle_owner";
export type StoredUserRole = "admin" | "agent" | "customer" | "vehicle_owner";

export type StoredAuthUser = {
  email: string;
  id: string;
  name: string;
  phone?: string;
  role: StoredUserRole;
};

export const signupRoles: Array<{
  description: string;
  id: SignupRole;
  label: string;
}> = [
  {
    id: "customer",
    label: "Customer",
    description: "Book packages and vehicles with a personal travel account.",
  },
  {
    id: "agency",
    label: "Travel Agency",
    description: "Register your agency and start receiving tour enquiries.",
  },
  {
    id: "vehicle_owner",
    label: "Vehicle Owner",
    description: "List your vehicles and accept trip requests from travelers.",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export const AUTH_STORAGE_KEY = "payana_auth_user";
export const TOKEN_STORAGE_KEY = "payana_auth_token";

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export function isStrongEnoughPassword(password: string) {
  return password.trim().length >= 6;
}

export function isValidPhoneNumber(phone: string) {
  return PHONE_REGEX.test(phone.trim());
}

export function getSignupRoleFromParam(role: string | null): SignupRole {
  if (role === "agency" || role === "travel-agency") return "agency";
  if (role === "vehicle_owner" || role === "vehicle-owner") return "vehicle_owner";
  return "customer";
}

export function mapSignupRoleToBackendRole(role: SignupRole) {
  if (role === "agency") return "agent";
  if (role === "vehicle_owner") return "operator";
  return "user";
}

export async function filesToDataUrls(files: File[]) {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        })
    )
  );
}

export function mapBackendRole(role?: string): StoredUserRole {
  if (role === "admin") return "admin";
  if (role === "agent") return "agent";
  if (role === "operator") return "vehicle_owner";
  return "customer";
}

export function getStoredAuthUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getStoredAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredAuth(auth: { token: string; user: StoredAuthUser }) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth.user));
  localStorage.setItem(TOKEN_STORAGE_KEY, auth.token);
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
