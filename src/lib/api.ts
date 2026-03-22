// ✅ Always define fallback (important)
const DEFAULT_PRODUCTION_API = "https://payana-website-1.onrender.com";

// ✅ Read env safely
const ENV_API = import.meta.env.VITE_API_URL;

// ✅ Final API URL
const API_URL = (ENV_API && ENV_API.trim() !== "")
  ? ENV_API.replace(/\/$/, "")
  : DEFAULT_PRODUCTION_API;

// ✅ Debug (VERY IMPORTANT — check console)
console.log("🚀 API URL:", API_URL);

// ✅ Build full API URL
export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

// ✅ Generic fetch
export async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ✅ Auth headers
export function getAuthHeaders(token?: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ✅ Asset URL resolver
export function resolveApiAssetUrl(path?: string | null) {
  if (!path) return undefined;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return buildApiUrl(path);
}