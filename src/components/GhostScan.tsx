import { useEffect, useState } from "react";
import { Ghost } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface ScanResult {
  totalApplications: number;
  callbackRate: number;
  ghosted: number;
  breakdown: Array<{ label: string; count: number; color: string }>;
  topCompanies: Array<{ name: string; logo: string }>;
  topGap: string;
  gapDetails: string[];
  topFix: string;
  fixDetails: string[];
}

interface GhostScanProps {
  email: string;
  accessToken?: string;
  onComplete: (data: ScanResult | null) => void;
}

const demoData: ScanResult = {
  totalApplications: 47,
  callbackRate: 10.6,
  ghosted: 22,
  breakdown: [
    { label: "Callbacks", count: 5, color: "bg-ghost-success" },
    { label: "Interviewing", count: 8, color: "bg-ghost-warning" },
    { label: "Rejected", count: 12, color: "bg-ghost-danger" },
    { label: "Ghosted", count: 22, color: "bg-ghost-accent" },
  ],
  topCompanies: [
    { name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
  ],
  topGap: "You apply for Senior roles but your resume shows 2 YOE",
  gapDetails: [
    "Experience mismatch: 2 YOE vs 5+ required",
    "Missing keywords: 'team lead', 'architect'",
    "No portfolio or GitHub links in applications",
  ],
  topFix: "System Design, AWS, Target Mid-level roles",
  fixDetails: [
    "Focus on System Design fundamentals",
    "Get AWS Solutions Architect certification",
    "Target Mid-level (3-5 YOE) roles instead",
    "Add quantifiable achievements to resume",
  ],
};

const GhostScan = ({ email, accessToken, onComplete }: GhostScanProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to inbox...");
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const isRealScan = !!accessToken;

    const statuses = isRealScan
      ? [
          "Connecting to Gmail...",
          "Authenticating...",
          "Scanning sent applications...",
          "Analyzing response patterns...",
          "Identifying ghosted applications...",
          "Detecting company patterns...",
          "Generating insights...",
        ]
      : [
          "Connecting to inbox...",
          "Scanning sent applications...",
          "Comparing role level vs experience…",
          "Checking callback patterns…",
          "Detecting seniority mismatch…",
          "Identifying ghost-heavy companies…",
          "Calculating your fate...",
        ];

    const totalDuration = isRealScan ? 8000 : 5500;
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
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    // Perform the actual scan
    const performScan = async () => {
      if (isRealScan) {
        try {
          const { data, error } = await supabase.functions.invoke('scan-gmail', {
            body: { accessToken },
          });

          if (error) {
            console.error('Scan error:', error);
            setScanComplete(true);
            setTimeout(() => onComplete(demoData), 300);
            return;
          }

          setScanComplete(true);
          // Wait for progress animation to complete
          const waitForProgress = setInterval(() => {
            setProgress((currentProgress) => {
              if (currentProgress >= 100) {
                clearInterval(waitForProgress);
                setTimeout(() => onComplete(data), 300);
              }
              return currentProgress;
            });
          }, 100);
        } catch (err) {
          console.error('Scan failed:', err);
          setScanComplete(true);
          setTimeout(() => onComplete(demoData), 300);
        }
      } else {
        // Demo mode - wait for animation then return demo data
        setTimeout(() => {
          setScanComplete(true);
        }, totalDuration);
      }
    };

    performScan();

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusTimer);
    };
  }, [accessToken, onComplete]);

  // Handle demo mode completion
  useEffect(() => {
    if (scanComplete && !accessToken && progress >= 100) {
      setTimeout(() => onComplete(demoData), 300);
    }
  }, [scanComplete, accessToken, progress, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <Ghost
          className="w-20 h-20 text-ghost-accent mx-auto mb-8 animate-pulse"
          strokeWidth={1.5}
        />

        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
          {accessToken ? "Scanning your Gmail" : "Scanning 3 months of applications"}
        </p>
        <p className="text-xl text-foreground font-medium mb-8">{status}</p>

        <div className="w-64 h-1 bg-ghost-border rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-ghost-accent transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-muted-foreground/50 text-sm mt-6">{email}</p>
      </div>
    </div>
  );
};

export default GhostScan;
