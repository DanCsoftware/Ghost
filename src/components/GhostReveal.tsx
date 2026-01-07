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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#0a0f14]">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-2">
          <Ghost className="w-8 h-8 text-ghost-accent mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Last 3 months • Demo Mode
          </p>
        </div>

        {/* Hero Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#151c24] border border-[#2a3441] rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-white">{demoData.totalApplications}</p>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Applications</p>
          </div>
          <div className="bg-[#151c24] border border-[#2a3441] rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-ghost-accent">{demoData.callbackRate}%</p>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Callback Rate</p>
          </div>
          <div className="bg-[#151c24] border border-[#2a3441] rounded-xl p-4">
            <p className="text-4xl md:text-5xl font-bold text-white">👻 {demoData.ghosted}</p>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Ghosted</p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {demoData.breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-[#151c24] border border-[#2a3441] rounded-full px-4 py-2"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-white font-medium">{item.count}</span>
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Companies + Gap + Fix in compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Top Companies */}
          <div className="bg-[#151c24] border border-[#2a3441] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Most Applied</p>
            <div className="flex flex-wrap gap-1.5">
              {demoData.topCompanies.map((company, i) => (
                <span key={company} className="text-white font-medium">
                  {company}{i < demoData.topCompanies.length - 1 && <span className="text-gray-500">,</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div className="bg-[#151c24] border border-red-500/30 rounded-xl p-4">
            <p className="text-xs text-red-400 uppercase tracking-widest mb-2">Why Ghosted</p>
            <p className="text-gray-200 text-sm leading-snug">{demoData.topGap}</p>
          </div>

          {/* Fix */}
          <div className="bg-[#151c24] border border-ghost-accent/30 rounded-xl p-4">
            <p className="text-xs text-ghost-accent uppercase tracking-widest mb-2">Ghost Recommends</p>
            <p className="text-gray-200 text-sm leading-snug">{demoData.topFix}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs pt-4">
          Your real data stays private
        </p>
      </div>
    </div>
  );
};

export default GhostReveal;
