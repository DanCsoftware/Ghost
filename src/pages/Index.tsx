import { useState, useEffect } from "react";
import GhostEntry from "@/components/GhostEntry";
import GhostScan from "@/components/GhostScan";
import GhostReveal from "@/components/GhostReveal";
import type { ScanResult } from "@/components/GhostScan";

type Screen = "entry" | "scan" | "reveal";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("entry");
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [scanData, setScanData] = useState<ScanResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Check for OAuth callback token in URL fragment
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        setEmail("Gmail Connected");
        setIsDemo(false);
        setScreen("scan");
        // Clean up URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    // Check for error in query params
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      console.error('OAuth error:', error);
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleReveal = (userEmail: string) => {
    setEmail(userEmail);
    setAccessToken(undefined);
    setIsDemo(true);
    setScreen("scan");
  };

  const handleGmailConnect = () => {
    // This is handled by the GhostEntry component directly
  };

  const handleScanComplete = (data: ScanResult | null) => {
    if (data) {
      setScanData(data);
      setScreen("reveal");
    }
  };

  const handleReset = () => {
    setEmail("");
    setAccessToken(undefined);
    setScanData(null);
    setIsDemo(false);
    setScreen("entry");
  };

  return (
    <div className="bg-background text-foreground">
      {screen === "entry" && (
        <GhostEntry onReveal={handleReveal} onGmailConnect={handleGmailConnect} />
      )}
      {screen === "scan" && (
        <GhostScan 
          email={email} 
          accessToken={accessToken}
          onComplete={handleScanComplete} 
        />
      )}
      {screen === "reveal" && scanData && (
        <GhostReveal onReset={handleReset} data={scanData} isDemo={isDemo} />
      )}
    </div>
  );
};

export default Index;
