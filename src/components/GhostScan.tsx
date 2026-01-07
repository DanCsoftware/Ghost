import { useEffect, useState } from "react";
import { Ghost } from "lucide-react";

interface GhostScanProps {
  email: string;
  onComplete: () => void;
}

const GhostScan = ({ email, onComplete }: GhostScanProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to inbox...");

  useEffect(() => {
    const statuses = [
      "Connecting to inbox...",
      "Scanning sent applications...",
      "Comparing role level vs experience…",
      "Checking callback patterns…",
      "Detecting seniority mismatch…",
      "Identifying ghost-heavy companies…",
      "Calculating your fate..."
    ];

    const totalDuration = 5500; // 5.5 seconds total
    const statusInterval = totalDuration / statuses.length;
    
    let currentStatus = 0;
    const statusTimer = setInterval(() => {
      currentStatus++;
      if (currentStatus < statuses.length) {
        setStatus(statuses[currentStatus]);
      }
    }, statusInterval);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(statusTimer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);
    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <Ghost 
          className="w-20 h-20 text-ghost-accent mx-auto mb-8 animate-pulse" 
          strokeWidth={1.5} 
        />
        
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
          Scanning 3 months of applications
        </p>
        <p className="text-xl text-foreground font-medium mb-8">
          {status}
        </p>

        <div className="w-64 h-1 bg-ghost-border rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-ghost-accent transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-muted-foreground/50 text-sm mt-6">
          {email}
        </p>
      </div>
    </div>
  );
};

export default GhostScan;
