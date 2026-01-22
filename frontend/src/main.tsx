import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter } from 'react-router-dom';

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

// If Google Client ID exists → wrap with GoogleOAuthProvider
if (googleClientId && googleClientId.trim() && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID') {
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <HashRouter>
          <App />
        </HashRouter>
      </GoogleOAuthProvider>
    </StrictMode>
  );
} 
// Else → render app without Google OAuth
else {
  root.render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>
  );
}
