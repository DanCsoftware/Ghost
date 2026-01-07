import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost } from "lucide-react";

interface GhostEntryProps {
  onReveal: (email: string) => void;
}

const GhostEntry = ({ onReveal }: GhostEntryProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onReveal(email);
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

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-widest">
            Enter the email you apply with
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
          className="w-full h-14 text-lg font-semibold bg-ghost-accent hover:bg-ghost-accent/90 text-black transition-all duration-300 disabled:opacity-30"
        >
          REVEAL
        </Button>
        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          We don't save your email. We just read the pattern.
        </p>
      </form>
    </div>
  );
};

export default GhostEntry;
