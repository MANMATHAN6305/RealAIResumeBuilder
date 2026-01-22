import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const root = createRoot(document.getElementById('root')!);

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
