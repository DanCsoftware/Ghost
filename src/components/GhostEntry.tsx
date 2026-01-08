import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, Mail, AlertCircle, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GhostEntryProps {
  onReveal: (email: string) => void;
  onGmailConnect: () => void;
}

interface OAuthDebugInfo {
  redirectUri?: string;
  clientIdPrefix?: string;
  state?: string;
}

const GhostEntry = ({ onReveal, onGmailConnect }: GhostEntryProps) => {
  const [email, setEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<OAuthDebugInfo | null>(null);
  const [copied, setCopied] = useState(false);

  // Check for OAuth error in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      const fullError = errorDescription ? `${error}: ${errorDescription}` : error;
      setOauthError(fullError);
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onReveal(email);
    }
  };

  const handleGmailConnect = async () => {
    setIsConnecting(true);
    setOauthError(null);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-auth');
      
      if (error) {
        console.error('Error initiating Gmail auth:', error);
        setOauthError(error.message || 'Failed to initiate Gmail auth');
        setIsConnecting(false);
        return;
      }

      // Store debug info for display
      if (data?.debug) {
        setDebugInfo(data.debug);
        console.log('OAuth Debug Info:', data.debug);
      }

      if (data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to connect Gmail:', err);
      setOauthError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnecting(false);
    }
  };

  const copyDebugInfo = () => {
    if (debugInfo) {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="mb-12 animate-fade-in">
        <Ghost className="w-16 h-16 text-ghost-accent mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-center">
          GHOST
        </h1>
        <p className="text-muted-foreground text-center mt-3 text-lg">
          See where your applications went to die
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        {/* Gmail Connect Button */}
        <Button
          onClick={handleGmailConnect}
          disabled={isConnecting}
          className="w-full h-14 text-lg font-semibold bg-ghost-accent hover:bg-ghost-accent/90 text-black transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5" />
          {isConnecting ? "Connecting..." : "Connect Gmail"}
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-ghost-border" />
          <span className="text-muted-foreground text-sm">or try demo</span>
          <div className="flex-1 h-px bg-ghost-border" />
        </div>

        {/* Demo Mode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-widest">
              Enter any email for demo
            </label>
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-lg bg-ghost-card border-ghost-border text-foreground placeholder:text-muted-foreground/50 focus:border-ghost-accent focus:ring-ghost-accent"
            />
          </div>
          <Button
            type="submit"
            disabled={!email.trim()}
            variant="outline"
            className="w-full h-12 text-base font-medium border-ghost-border hover:bg-ghost-accent/10 hover:border-ghost-accent hover:text-ghost-accent transition-all duration-300 disabled:opacity-30"
          >
            Try Demo Mode
          </Button>
        </form>

        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          Connect Gmail for real insights • Demo mode uses sample data
        </p>

        {/* OAuth Error Display */}
        {oauthError && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">OAuth Error</p>
                <p className="text-xs text-muted-foreground break-words">{oauthError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info Panel (shown when there's an error) */}
        {oauthError && debugInfo && (
          <div className="mt-3 p-3 bg-ghost-card border border-ghost-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Debug Info</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyDebugInfo}
                className="h-6 px-2 text-xs"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <p><span className="text-foreground/60">Redirect URI:</span> {debugInfo.redirectUri}</p>
              <p><span className="text-foreground/60">Client ID:</span> {debugInfo.clientIdPrefix}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GhostEntry;
