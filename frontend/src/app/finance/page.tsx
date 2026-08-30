"use client";

import Sidebar from "@/components/Sidebar";

const budgetCards = [
  { title: "Current Balance", value: "$2,450.00", change: "+2.4%", note: "vs last month", icon: "account_balance", accent: "text-primary" },
  { title: "Monthly Spent", value: "$850", note: "/ $1,200 limit", helper: "70% used", extra: "$350 remaining", icon: "credit_card", accent: "text-tertiary-container" },
  { title: "Semester Savings", value: "$5,000", note: "/ $10,000", helper: "50% reached", extra: "45 days left", icon: "savings", accent: "text-secondary" },
];

const upcoming = [
  { name: "Rent", date: "Nov 1st", amount: "-$1,200", icon: "home", color: "bg-red-500/10 text-red-400" },
  { name: "Spotify", date: "Nov 5th", amount: "-$10.99", icon: "music_note", color: "bg-green-500/10 text-green-400" },
  { name: "Gym", date: "Nov 12th", amount: "-$45.00", icon: "fitness_center", color: "bg-blue-500/10 text-blue-400" },
];

export default function FinancePage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex font-body-md overflow-hidden">
      <header className="md:hidden flex justify-between items-center px-6 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-sm fixed top-0 h-16">
        <div className="font-headline-md text-headline-md font-bold text-primary">Basecamp</div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer active:scale-95 transition-transform text-on-surface-variant hover:text-primary">notifications</span>
          <span className="material-symbols-outlined cursor-pointer active:scale-95 transition-transform text-on-surface-variant hover:text-primary">settings</span>
          <img className="w-8 h-8 rounded-full border border-white/10 object-cover cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0sYRSFg-TM1YYHKuuzGuGQ1j7U4IabYMHWsqPrinQYpavA02Us6uELI44mEJEXYAgRubk3iLhg7g655J1p0sXfscCSeyphubaT4id0PdDXq9TXKaFsrns_47gvK8ONUGBWzOwjJ1ioSTmWEHoVaXsmhvwKikmn7QH_11BAWXADIXdLstLvDzeFkTtFV5LwQ11LFhHNJoj7vEaBxzqvUknXVyi_CvMd3kBwtgkOWiQ1gn5qpxIfdwdTg" alt="User avatar" />
        </div>
      </header>

      <Sidebar activePage="finance" />

      <main className="flex-1 w-full md:pl-sidebar-width pt-16 md:pt-0 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-container-margin max-w-7xl mx-auto space-y-stack-lg pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Finance Overview</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage your budget and track expenses.</p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-surface-container border border-white/10 text-on-surface hover:bg-white/5 transition-colors font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span> Export
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Add Funds
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {budgetCards.map((card) => (
              <div key={card.title} className="glass-card rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{card.title}</span>
                    <span className={`material-symbols-outlined ${card.accent}`}>{card.icon}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display-lg text-display-lg text-on-surface">{card.value}</h3>
                    {card.title === "Monthly Spent" && <span className="font-body-sm text-body-sm text-on-surface-variant">{card.note}</span>}
                    {card.title === "Semester Savings" && <span className="font-body-sm text-body-sm text-on-surface-variant">{card.note}</span>}
                  </div>
                </div>

                {card.title === "Current Balance" ? (
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">trending_up</span> {card.change}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{card.note}</span>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                      <span>{card.helper}</span>
                      <span>{card.extra}</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${card.title === "Monthly Spent" ? "bg-primary w-[70%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-secondary w-[50%]"}`}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 space-y-gutter">
              <div className="glass-panel rounded-xl p-6 relative">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">add_circle</span> Add Transaction
                  </h3>
                  <div className="flex bg-surface-container rounded-lg p-1">
                    <button className="px-4 py-1.5 rounded-md bg-surface-bright text-on-surface shadow-sm font-label-sm text-label-sm">AI Chat</button>
                    <button className="px-4 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">Manual Form</button>
                  </div>
                </div>

                <div className="transition-opacity duration-300">
                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5 mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                        I&apos;m ready. Just tell me what you bought. For example: <span className="text-on-surface italic">&ldquo;I spent $12 on lunch at Chipotle today&rdquo;</span> or <span className="text-on-surface italic">&ldquo;Got my $500 paycheck from the bookstore.&rdquo;</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <input className="w-full bg-surface-container border border-white/10 rounded-lg pl-4 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-sm text-body-sm outline-none" placeholder="Type your transaction details..." type="text" />
                    <button className="absolute right-2 top-2 p-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Analytics</h3>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors text-xs">Week</button>
                    <button className="px-2 py-1 rounded bg-surface-bright text-on-surface shadow-sm font-label-sm text-label-sm transition-colors text-xs border border-white/5">Month</button>
                  </div>
                </div>

                <div className="h-64 rounded-lg bg-surface-container-low border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)" }} />
                  <div className="w-full h-full flex items-end justify-around px-8 pb-8 pt-12 gap-2 relative z-10">
                    <div className="w-1/6 bg-primary/40 rounded-t-sm h-[40%] relative group cursor-pointer" />
                    <div className="w-1/6 bg-tertiary/40 rounded-t-sm h-[75%] relative group cursor-pointer" />
                    <div className="w-1/6 bg-primary/20 rounded-t-sm h-[20%] relative group cursor-pointer" />
                    <div className="w-1/6 bg-secondary/40 rounded-t-sm h-[55%] relative group cursor-pointer" />
                    <div className="w-1/6 bg-primary/40 rounded-t-sm h-[30%] relative group cursor-pointer" />
                  </div>
                  <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 80 Q 20 70 40 40 T 70 50 T 100 30" fill="none" stroke="#adc6ff" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <span className="bg-surface/80 backdrop-blur px-3 py-1 rounded-full text-xs text-on-surface-variant border border-white/5 font-label-sm">Chart Data Visualization Area</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-gutter">
              <div className="glass-card rounded-xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming</h3>
                  <button className="text-primary hover:text-primary-container transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {upcoming.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                          <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        </div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface font-medium">{item.name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{item.date}</p>
                        </div>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 border-t-2 border-t-primary relative overflow-hidden flex flex-col">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">AI Insights</h3>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-body-sm text-body-sm text-on-surface-variant">
                  <p className="bg-surface-container/50 p-3 rounded-lg border border-white/5">
                    You are spending <span className="text-on-surface font-medium">15% more</span> on Food &amp; Dining this week compared to last week. Consider eating in for the next 2 days to stay on track with your $5k savings goal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
