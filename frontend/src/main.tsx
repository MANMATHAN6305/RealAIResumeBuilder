import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = createRoot(document.getElementById('root')!);

// Gracefully handle missing Google OAuth client ID.
// If not configured, render the app without GoogleOAuthProvider.
if (googleClientId && googleClientId.trim() && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID') {
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
