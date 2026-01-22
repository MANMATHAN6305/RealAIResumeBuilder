// API Client for Express Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}

// Make API request with authentication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    console.log('Request body:', options.body);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error: any) {
    console.error('API request error:', error);
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:3001');
    }
    throw error;
  }
}

export default apiRequest;

