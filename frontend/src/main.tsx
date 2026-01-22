import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Safer root retrieval: avoid non-null assertion to prevent runtime throw if 'root' is missing.
let rootElement = document.getElementById('root');
if (!rootElement) {
  // If index.html is missing the root div for some reason, create it to avoid a blank crash.
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

const root = createRoot(rootElement);

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
