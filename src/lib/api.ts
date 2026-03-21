const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

function getApiBaseUrl() {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
  }

  return API_URL;
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function resolveApiAssetUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return buildApiUrl(path);
}
