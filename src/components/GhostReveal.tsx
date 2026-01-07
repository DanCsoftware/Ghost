import { Ghost, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";

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

interface GhostRevealProps {
  onReset: () => void;
}

const GhostReveal = ({ onReset }: GhostRevealProps) => {
  const [gapOpen, setGapOpen] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#0a0f14]">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-2">
          <Ghost className="w-8 h-8 text-ghost-accent mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Last 6 months • Demo Mode
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
          {/* Top Companies with Logos */}
          <div className="bg-[#151c24] border border-[#2a3441] rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Most Applied</p>
            <div className="flex gap-2">
              {demoData.topCompanies.map((company) => (
                <div key={company.name} className="group relative">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-8 h-8 rounded-full bg-white p-0.5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center">
                    {company.name[0]}
                  </span>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gap - Expandable */}
          <Collapsible open={gapOpen} onOpenChange={setGapOpen}>
            <div className="bg-[#151c24] border border-red-500/30 rounded-xl p-4">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-red-400 uppercase tracking-widest">Why Ghosted</p>
                  <ChevronDown className={`w-4 h-4 text-red-400 transition-transform ${gapOpen ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-gray-200 text-sm leading-snug">{demoData.topGap}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pt-3 border-t border-red-500/20">
                <ul className="space-y-1.5">
                  {demoData.gapDetails.map((detail, i) => (
                    <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Fix - Expandable */}
          <Collapsible open={fixOpen} onOpenChange={setFixOpen}>
            <div className="bg-[#151c24] border border-ghost-accent/30 rounded-xl p-4">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-ghost-accent uppercase tracking-widest">Ghost Recommends</p>
                  <ChevronDown className={`w-4 h-4 text-ghost-accent transition-transform ${fixOpen ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-gray-200 text-sm leading-snug">{demoData.topFix}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pt-3 border-t border-ghost-accent/20">
                <ul className="space-y-1.5">
                  {demoData.fixDetails.map((detail, i) => (
                    <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                      <span className="text-ghost-accent">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 space-y-3">
          <button
            onClick={onReset}
            className="text-ghost-accent hover:text-ghost-accent/80 text-sm font-medium transition-colors"
          >
            ← Scan Another Inbox
          </button>
          <p className="text-gray-500 text-xs">
            Your real data stays private
          </p>
        </div>
      </div>
    </div>
  );
};

export default GhostReveal;
