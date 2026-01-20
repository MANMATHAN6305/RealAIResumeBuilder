import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="174647380901-001mtm0kvji4olus0b1kj7b652n3cu4p.apps.googleusercontent.com">
      <App/>
    </GoogleOAuthProvider>
  </StrictMode>
);
