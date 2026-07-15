const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  _retry?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

function onRefreshed(error: Error | null) {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
}

export async function apiClient<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, _retry = false } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && !_retry && typeof window !== "undefined") {
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          refreshSubscribers.push((err) => {
            if (err) return reject(err);
            resolve(apiClient<T>(endpoint, { ...options, _retry: true }));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
        if (refreshRes.ok) {
          isRefreshing = false;
          onRefreshed(null);
          return apiClient<T>(endpoint, { ...options, _retry: true });
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        isRefreshing = false;
        onRefreshed(err as Error);
        const pathname = window.location.pathname;
        if (pathname !== "/login" && pathname !== "/register") {
          window.location.href = "/login";
        }
        throw new ApiError("Session expired", 401);
      }
    }
    
    if (res.status === 401 && _retry && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/login" && pathname !== "/register") {
        window.location.href = "/login";
      }
    }

    throw new ApiError(data.error || "Something went wrong", res.status, data.errors);
  }

  return data as T;
}

export async function apiUpload<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error || "Upload failed", res.status);
  }

  return data;
}
