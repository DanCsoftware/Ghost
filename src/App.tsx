import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GhostEntry from './components/GhostEntry';
import GhostScan from './components/GhostScan';
import { Toaster } from 'sonner';

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const GMAIL_CLIENT_ID = import.meta.env.VITE_GMAIL_CLIENT_ID;

  if (!GMAIL_CLIENT_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
          <p className="text-muted-foreground">Gmail Client ID not found in .env file</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure VITE_GMAIL_CLIENT_ID is set in your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GMAIL_CLIENT_ID}>
      <div className="min-h-screen bg-background">
        {!accessToken ? (
          <GhostEntry onAuthSuccess={setAccessToken} />
        ) : (
          <GhostScan accessToken={accessToken} />
        )}
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;