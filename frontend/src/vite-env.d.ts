/// <reference types="vite/client" />

// Google OAuth types
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
        renderButton: (element: HTMLElement | null, config: any) => void;
      };
    };
  };
}
// Google Sign-In types
interface Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement | null, config: any) => void;
        prompt: (callback?: (notification: any) => void) => void;
      };
    };
  };
}