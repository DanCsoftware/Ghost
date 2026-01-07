import { Ghost } from "lucide-react";

const demoData = {
  totalApplications: 47,
  callbackRate: 10.6,
  ghosted: 22,
  breakdown: [
    { label: "Callbacks", count: 5, color: "bg-ghost-success" },
    { label: "Interviewing", count: 8, color: "bg-ghost-warning" },
    { label: "Rejected", count: 12, color: "bg-ghost-danger" },
    { label: "Ghosted", count: 22, color: "bg-ghost-accent" },
  ],
  topCompanies: ["Google", "Meta", "Stripe"],
  topGap: "You apply for Senior roles but your resume shows 2 YOE",
  topFix: "System Design, AWS, Target Mid-level roles",
};

const GhostReveal = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-2">
          <Ghost className="w-8 h-8 text-ghost-accent mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-muted-foreground text-xs uppercase tracking-widest">
            Last 3 months • Demo Mode
          </p>
        </div>

        {/* Hero Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-ghost-card border border-ghost-border rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-foreground">{demoData.totalApplications}</p>
            <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wide">Applications</p>
          </div>
          <div className="bg-ghost-card border border-ghost-border rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-ghost-accent">{demoData.callbackRate}%</p>
            <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wide">Callback Rate</p>
          </div>
          <div className="bg-ghost-card border border-ghost-border rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-foreground">👻 {demoData.ghosted}</p>
            <p className="text-muted-foreground text-xs mt-1 uppercase tracking-wide">Ghosted</p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {demoData.breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-ghost-card border border-ghost-border rounded-full px-4 py-2"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-white font-medium">{item.count}</span>
              <span className="text-white/70 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Companies + Gap + Fix in compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Top Companies */}
          <div className="bg-ghost-card border border-ghost-border rounded-xl p-4">
            <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Most Applied</p>
            <div className="flex flex-wrap gap-1.5">
              {demoData.topCompanies.map((company, i) => (
                <span key={company} className="text-white font-medium">
                  {company}{i < demoData.topCompanies.length - 1 && <span className="text-white/50">,</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div className="bg-ghost-card border border-ghost-danger/40 rounded-xl p-4">
            <p className="text-xs text-ghost-danger uppercase tracking-widest mb-2">Why Ghosted</p>
            <p className="text-white/90 text-sm leading-snug">{demoData.topGap}</p>
          </div>

          {/* Fix */}
          <div className="bg-ghost-card border border-ghost-accent/40 rounded-xl p-4">
            <p className="text-xs text-ghost-accent uppercase tracking-widest mb-2">Ghost Recommends</p>
            <p className="text-white/90 text-sm leading-snug">{demoData.topFix}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs pt-4">
          Your real data stays private
        </p>
      </div>
    </div>
  );
};

export default GhostReveal;
