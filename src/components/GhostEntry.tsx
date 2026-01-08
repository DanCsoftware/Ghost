import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GhostEntryProps {
  onReveal: (email: string) => void;
  onGmailConnect: () => void;
}

const GhostEntry = ({ onReveal, onGmailConnect }: GhostEntryProps) => {
  const [email, setEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onReveal(email);
    }
  };

  const handleGmailConnect = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-auth');
      
      if (error) {
        console.error('Error initiating Gmail auth:', error);
        setIsConnecting(false);
        return;
      }

      if (data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to connect Gmail:', err);
      setIsConnecting(false);
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
            className="w-full h-12 text-base font-medium border-ghost-border hover:bg-ghost-card hover:border-ghost-accent transition-all duration-300 disabled:opacity-30"
          >
            Try Demo Mode
          </Button>
        </form>

        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          Connect Gmail for real insights • Demo mode uses sample data
        </p>
      </div>
    </div>
  );
};

export default GhostEntry;
