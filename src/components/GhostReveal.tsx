import { Ghost, TrendingUp, TrendingDown, Building2, AlertTriangle, Lightbulb } from "lucide-react";

const demoData = {
  totalApplications: 47,
  breakdown: [
    { label: "Callbacks", count: 5, color: "bg-green-500", icon: "🟢" },
    { label: "Interviewing", count: 8, color: "bg-yellow-500", icon: "🟡" },
    { label: "Rejected", count: 12, color: "bg-red-500", icon: "🔴" },
    { label: "Ghosted", count: 22, color: "bg-ghost-accent", icon: "👻" },
  ],
  callbackRate: 10.6,
  avgRate: 8,
  topCompanies: [
    { name: "Google", count: 4 },
    { name: "Meta", count: 3 },
    { name: "Stripe", count: 3 },
  ],
  gaps: [
    "You apply for Senior roles but your resume shows 2 YOE",
    "Missing: Python, AWS in 68% of rejected applications",
    "Application timing: 73% sent on Mondays (highest competition)",
  ],
  recommendations: [
    { skill: "System Design", reason: "Required in 80% of senior roles you applied for" },
    { skill: "AWS Certification", reason: "Mentioned in 12 rejections" },
    { skill: "Target Mid-level roles", reason: "Better match for your experience" },
  ],
};

const GhostReveal = () => {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-16">
        {/* Hero Stat */}
        <section className="text-center animate-fade-in">
          <Ghost className="w-12 h-12 text-ghost-accent mx-auto mb-6" strokeWidth={1.5} />
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
            Last 3 months
          </p>
          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-ghost-accent">
            {demoData.totalApplications}
          </h1>
          <p className="text-2xl text-foreground mt-2">applications sent</p>
        </section>

        {/* Breakdown */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            The Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {demoData.breakdown.map((item) => (
              <div
                key={item.label}
                className="bg-ghost-card border border-ghost-border rounded-xl p-6 text-center"
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="text-4xl font-bold text-foreground">{item.count}</p>
                <p className="text-muted-foreground text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conversion Rate */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            Callback Rate
          </h2>
          <div className="bg-ghost-card border border-ghost-border rounded-xl p-8">
            <div className="flex items-end gap-4">
              <span className="text-6xl font-bold text-foreground">
                {demoData.callbackRate}%
              </span>
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Above average</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Industry average is {demoData.avgRate}%
            </p>
          </div>
        </section>

        {/* Top Companies */}
        <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            <Building2 className="w-4 h-4 inline mr-2" />
            Most Applied
          </h2>
          <div className="space-y-3">
            {demoData.topCompanies.map((company, index) => (
              <div
                key={company.name}
                className="flex items-center justify-between bg-ghost-card border border-ghost-border rounded-xl px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-lg text-foreground">{company.name}</span>
                </div>
                <span className="text-ghost-accent font-semibold">
                  {company.count} apps
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Gap Analysis */}
        <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Why You're Getting Ghosted
          </h2>
          <div className="space-y-3">
            {demoData.gaps.map((gap, index) => (
              <div
                key={index}
                className="bg-ghost-card border border-red-500/30 rounded-xl px-6 py-4"
              >
                <p className="text-foreground">{gap}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Ghost Recommends
          </h2>
          <div className="space-y-3">
            {demoData.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-ghost-card border border-ghost-accent/30 rounded-xl px-6 py-4"
              >
                <p className="text-ghost-accent font-semibold text-lg">{rec.skill}</p>
                <p className="text-muted-foreground text-sm mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="text-center pt-8 border-t border-ghost-border animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Ghost className="w-8 h-8 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-muted-foreground text-sm">
            Demo Mode • Your real data stays private
          </p>
        </section>
      </div>
    </div>
  );
};

export default GhostReveal;
