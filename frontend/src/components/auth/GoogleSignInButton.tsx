import { GoogleLogin } from '@react-oauth/google';
import { useMemo } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (token: string) => void;
  onError: (message: string) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = useMemo(
    () => Boolean(clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID' && clientId.trim()),
    [clientId]
  );

  if (!isConfigured) {
    return null;
  }

  return (
    <div className="space-y-3">
      <GoogleLogin
        width="100%"
        theme="outline"
        shape="rectangular"
        text="signin_with"
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          } else {
            onError('Google returned an empty credential. Please try again.');
          }
        }}
        onError={() => onError('Google sign-in failed. Please try again.')}
      />
    </div>
  );
}
