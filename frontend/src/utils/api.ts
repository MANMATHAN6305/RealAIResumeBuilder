// API Client for Express Backend
// Default to port 3001 to match README and backend/index.js logs. Allow override via VITE_API_URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
function getAuthToken(): string | null {
  try {
    return localStorage.getItem('authToken');
  } catch (err) {
    // localStorage could throw in some sandboxed environments
    console.error('Failed to access localStorage for auth token:', err);
    return null;
  }
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem('authToken', token);
  } catch (err) {
    console.error('Failed to store auth token:', err);
  }
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  try {
    localStorage.removeItem('authToken');
  } catch (err) {
    console.error('Failed to remove auth token:', err);
  }
}

// Make API request with authentication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const message = `API request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`;
      const err: any = new Error(message);
      err.status = res.status;
      throw err;
    }

    // Attempt to parse JSON; allow empty body
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    } else {
      // If not JSON, return as text (caller may expect JSON, but we guard)
      const text = await res.text();
      return text as unknown as T;
    }
  } catch (error: any) {
    // Surface better error for debugging (console + rethrow)
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
}

export default apiRequest;
