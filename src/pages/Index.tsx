import { useState } from "react";
import GhostEntry from "@/components/GhostEntry";
import GhostScan from "@/components/GhostScan";
import GhostReveal from "@/components/GhostReveal";

type Screen = "entry" | "scan" | "reveal";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("entry");
  const [email, setEmail] = useState("");

  const handleReveal = (userEmail: string) => {
    setEmail(userEmail);
    setScreen("scan");
  };

  const handleScanComplete = () => {
    setScreen("reveal");
  };

  return (
    <div className="bg-background text-foreground">
      {screen === "entry" && <GhostEntry onReveal={handleReveal} />}
      {screen === "scan" && <GhostScan email={email} onComplete={handleScanComplete} />}
      {screen === "reveal" && <GhostReveal />}
    </div>
  );
};

export default Index;
