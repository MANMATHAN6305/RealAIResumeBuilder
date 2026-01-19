import apiRequest, { setAuthToken, removeAuthToken } from './api';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface GoogleAuthResponse extends AuthResponse {
  requiresCompletion?: boolean;
  googleId?: string;
  existingFirstName?: string;
  existingLastName?: string;
  picture?: string;
  isNewUser?: boolean;
}

interface AuthError {
  error: string;
}

/**
 * Sign in with email and password using Express API
 */
export async function signIn(email: string, password: string): Promise<{ user: any; error: any }> {
  try {
    console.log('Calling login API for:', email);
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log('Login API response:', response);

    if (!response || !response.token || !response.user) {
      console.error('Invalid response from server:', response);
      return {
        user: null,
        error: { message: 'Invalid response from server' },
      };
    }

    // Store token
    setAuthToken(response.token);

    return {
      user: {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      user: null,
      error: { message: error?.message || 'Login failed. Please check your credentials.' },
    };
  }
}

/**
 * Sign up with email, password, and additional user info
 */
export async function signUp(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}): Promise<{ user: any; error: any }> {
  try {
    console.log('Calling register API for:', userData.email);
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    console.log('Register API response:', response);

    if (!response || !response.token || !response.user) {
      console.error('Invalid response from server:', response);
      return {
        user: null,
        error: { message: 'Invalid response from server' },
      };
    }

    // Store token
    setAuthToken(response.token);

    return {
      user: {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      user: null,
      error: { message: error?.message || 'Registration failed. Please try again.' },
    };
  }
}

/**
 * Sign in with Google OAuth token
 */
export async function signInWithGoogle(token: string): Promise<{ user?: any; error?: any; requiresCompletion?: boolean; googleId?: string; email?: string }> {
  try {
    console.log('Calling Google login API');
    const response = await apiRequest<GoogleAuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    console.log('Google login API response:', response);

    if (response.requiresCompletion) {
      // First-time user needs to complete profile
      return {
        requiresCompletion: true,
        googleId: response.googleId,
        email: response.email,
        error: null,
      };
    }

    if (!response || !response.token || !response.user) {
      console.error('Invalid response from server:', response);
      return {
        error: { message: 'Invalid response from server' },
      };
    }

    // Store token
    setAuthToken(response.token);

    return {
      user: {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return {
      error: { message: error?.message || 'Google sign-in failed. Please try again.' },
    };
  }
}

/**
 * Complete Google user profile
 */
export async function completeGoogleProfile(googleId: string, email: string, firstName: string, lastName: string, dateOfBirth: string): Promise<{ user: any; error: any }> {
  try {
    console.log('Calling complete Google profile API');
    const response = await apiRequest<AuthResponse>('/auth/google/complete', {
      method: 'POST',
      body: JSON.stringify({ googleId, email, firstName, lastName, dateOfBirth }),
    });

    console.log('Complete profile API response:', response);

    if (!response || !response.token || !response.user) {
      console.error('Invalid response from server:', response);
      return {
        user: null,
        error: { message: 'Invalid response from server' },
      };
    }

    // Store token
    setAuthToken(response.token);

    return {
      user: {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Complete profile error:', error);
    return {
      user: null,
      error: { message: error?.message || 'Failed to complete profile. Please try again.' },
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  removeAuthToken();
}

/**
 * Get current authenticated user (from token)
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    // Decode JWT token to get user info (client-side decoding)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId.toString(),
      email: payload.email,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      access_token: token,
      user: {
        id: payload.userId.toString(),
        email: payload.email,
      },
    };
  } catch {
    return null;
  }
}

