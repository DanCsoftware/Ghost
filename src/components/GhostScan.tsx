import { useEffect, useState } from "react";
import { Ghost, RefreshCw, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage, JobApplication } from "@/lib/storage";
import { analyzeApplications, GeminiAnalysis } from "@/lib/gemini";
import { toast } from "sonner";

interface GhostScanProps {
  accessToken: string;
  onBack?: () => void;
}

const GhostScan = ({ accessToken, onBack }: GhostScanProps) => {
  const [isScanning, setIsScanning] = useState(true); // Start in scanning mode
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to Gmail...");
  const [userEmail, setUserEmail] = useState<string>(""); // Add this
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Fetch user's email first
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/profile',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await response.json();
        setUserEmail(data.emailAddress || '');
        console.log('📧 User email:', data.emailAddress);
      } catch (error) {
        console.error('Failed to fetch user email:', error);
      }
    };

    fetchUserEmail();

    // Check if we have existing data
    const existingApps = storage.getApplications();
    if (existingApps.length > 0) {
      // We have data, skip initial scan
      setIsScanning(false); // Stop scanning mode
      setApplications(existingApps);
      analyzeData(existingApps);
      setShowResults(true);
      setIsInitialLoad(false);
    } else {
      // No data, do initial scan (already in scanning mode)
      scanGmail();
    }
  }, [accessToken]);

  const analyzeData = async (apps: JobApplication[]) => {
    const result = await analyzeApplications(apps);
    setAnalysis(result);
  };

  const getCompanyDomain = (company: string): string => {
    // Common company domain mappings
    const domainMap: Record<string, string> = {
      'mail': 'mail.com',
      'sony': 'sony.com',
      'fox': 'fox.com',
      'discord': 'discord.com',
      'google': 'google.com',
      'microsoft': 'microsoft.com',
      'amazon': 'amazon.com',
      'meta': 'meta.com',
      'netflix': 'netflix.com',
      'apple': 'apple.com',
    };
    
    const lowerCompany = company.toLowerCase();
    return domainMap[lowerCompany] || `${lowerCompany}.com`;
  };

  const scanGmail = async () => {
    setIsScanning(true);
    setProgress(0);
    setShowResults(false);

    const statuses = [
      "Connecting to Gmail...",
      "Scanning inbox for applications...",
      "Analyzing response patterns...",
      "Detecting ghosted companies...",
      "Generating AI insights...",
    ];

    let currentStatusIndex = 0;
    const statusInterval = setInterval(() => {
      currentStatusIndex++;
      if (currentStatusIndex < statuses.length) {
        setStatus(statuses[currentStatusIndex]);
      }
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 3));
    }, 150);

    try {
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(application OR applied OR "thank you for applying" OR "we received your application") after:2024/10/01&maxResults=50',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch emails');

      const data = await response.json();
      
      if (!data.messages || data.messages.length === 0) {
        toast.info('No job application emails found');
        clearInterval(statusInterval);
        clearInterval(progressInterval);
        setIsScanning(false);
        setIsInitialLoad(false);
        return;
      }

      const newApplications: JobApplication[] = [];
      
      for (const message of data.messages.slice(0, 20)) {
        const emailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const emailData = await emailResponse.json();
        const headers = emailData.payload.headers;
        
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value || '';

        const emailDomain = from.match(/@([^>]+)/)?.[1] || '';
        const company = emailDomain.split('.')[0] || 'Unknown';
        
        const position = subject.includes('Engineer') ? 'Engineer' :
                        subject.includes('Manager') ? 'Manager' :
                        subject.includes('Designer') ? 'Designer' :
                        subject.includes('Product') ? 'Product' : 'Position';

        const application: JobApplication = {
          id: message.id,
          company: company.charAt(0).toUpperCase() + company.slice(1),
          position,
          appliedDate: new Date(date).toISOString(),
          lastChecked: new Date().toISOString(),
          status: 'pending',
          emailId: message.id,
        };

        const existing = applications.find(a => a.emailId === application.emailId);
        if (!existing) {
          storage.addApplication(application);
          newApplications.push(application);
        }
      }

      const allApps = storage.getApplications();
      setApplications(allApps);
      
      setProgress(100);
      
      setTimeout(async () => {
        clearInterval(statusInterval);
        clearInterval(progressInterval);
        
        await analyzeData(allApps);
        
        setIsScanning(false);
        setShowResults(true);
        setIsInitialLoad(false);
        
        if (newApplications.length > 0) {
          toast.success(`Found ${newApplications.length} applications`);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan Gmail');
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      setIsScanning(false);
      setIsInitialLoad(false);
    }
  };

  const ghostedApps = storage.getGhostedApplications();
  const callbackRate = applications.length > 0 
    ? ((applications.filter(a => a.status === 'responded').length / applications.length) * 100).toFixed(1)
    : '0.0';

  const breakdown = [
    { label: "Callbacks", count: applications.filter(a => a.status === 'responded').length, color: "bg-ghost-success" },
    { label: "Interviewing", count: 0, color: "bg-ghost-warning" },
    { label: "Rejected", count: 0, color: "bg-ghost-danger" },
    { label: "Ghosted", count: ghostedApps.length, color: "bg-ghost-accent" },
  ];

  // Scanning UI
  if (isScanning) {
    return (
      <div className="min-h-screen bg-ghost-bg flex flex-col items-center justify-center px-6">
        <Ghost className="w-24 h-24 text-ghost-accent mb-8 animate-pulse" strokeWidth={1.5} />
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-3">
          Scanning 3 Months of Applications
        </p>
        <p className="text-xl text-white font-medium mb-8">{status}</p>
        <div className="w-80 h-1 bg-ghost-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ghost-accent to-ghost-success transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm mt-4">{userEmail || 'Loading...'}</p>
      </div>
    );
  }

  // Results UI
  if (showResults && analysis) {
    return (
      <div className="min-h-screen bg-ghost-bg text-white p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ghost className="w-8 h-8 text-ghost-accent" strokeWidth={1.5} />
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Last 3 Months
              </p>
            </div>
            <Button
              onClick={() => {
                // Clear data and go back to entry
                storage.clearAll();
                window.location.reload();
              }}
              variant="outline"
              size="sm"
              className="bg-ghost-card border-ghost-border text-white hover:bg-ghost-border hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan Another Inbox
            </Button>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-ghost-card rounded-xl p-6 border border-ghost-border">
              <p className="text-4xl font-bold">{applications.length}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-2">Applications</p>
            </div>
            
            <div className="bg-ghost-card rounded-xl p-6 border border-ghost-border">
              <p className="text-4xl font-bold text-ghost-accent">{callbackRate}%</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-2">Callback Rate</p>
            </div>
            
            <div className="bg-ghost-card rounded-xl p-6 border border-ghost-border">
              <p className="text-4xl font-bold flex items-center gap-2">
                <span className="text-2xl">👻</span>
                <span className="text-ghost-danger">{ghostedApps.length}</span>
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-2">Ghosted</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex gap-3 flex-wrap">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-ghost-card px-4 py-2 rounded-full border border-ghost-border"
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm">
                  <span className="font-semibold">{item.count}</span> {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Most Applied */}
            <div className="bg-ghost-card rounded-xl p-6 border border-ghost-border">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                Most Applied
              </p>
              <div className="flex gap-3">
                {analysis.topCompanies.slice(0, 4).map((company, i) => {
                  const domain = getCompanyDomain(company);
                  return (
                    <div key={i} className="relative group">
                      <img
                        src={`https://logo.clearbit.com/${domain}`}
                        alt={company}
                        className="w-12 h-12 rounded-lg object-contain bg-white p-2"
                        onError={(e) => {
                          // Replace with initials on error
                          const img = e.target as HTMLImageElement;
                          const parent = img.parentElement;
                          if (parent) {
                            img.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-12 h-12 rounded-lg bg-gradient-to-br from-ghost-accent/20 to-ghost-accent/5 border border-ghost-accent/30 flex items-center justify-center text-sm font-bold text-ghost-accent';
                            fallback.textContent = company.slice(0, 2).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <span className="text-xs text-gray-400 bg-ghost-card px-2 py-1 rounded border border-ghost-border">
                          {company}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Ghosted - Enhanced */}
            <div className="bg-gradient-to-br from-ghost-danger/10 to-ghost-card rounded-xl p-6 border border-ghost-danger/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-ghost-danger" />
                <p className="text-xs uppercase tracking-[0.2em] text-ghost-danger font-semibold">
                  Why Ghosted
                </p>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{analysis.whyGhosted}</p>
            </div>

            {/* Ghost Recommends - Enhanced */}
            <div className="bg-gradient-to-br from-ghost-accent/10 to-ghost-card rounded-xl p-6 border border-ghost-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-ghost-accent" />
                <p className="text-xs uppercase tracking-[0.2em] text-ghost-accent font-semibold">
                  Ghost Recommends
                </p>
              </div>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-200 flex items-start gap-2">
                    <span className="text-ghost-accent mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-xs text-gray-500">
              Your real data stays private · Never stored on servers
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GhostScan;