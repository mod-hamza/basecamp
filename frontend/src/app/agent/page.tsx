"use client";

import Sidebar from "@/components/Sidebar";

const chatSidebar = [
  { title: "Economics Summary", time: "Just now", preview: "Can you help me summarize my last...", active: true },
  { title: "Math 101 Midterm Prep", time: "2h ago", preview: "Reviewing integration formulas...", active: false },
  { title: "Monthly Budget Review", time: "Yesterday", preview: "How much is left in entertainment?", active: false },
];

const messages = [
  { sender: "user", text: "Can you help me summarize my last Economics lecture?" },
  { sender: "system", label: "Study Agent" },
  { sender: "assistant", text: "Of course! I've processed the transcript from 'Macroeconomics: Week 4'. Would you like the key takeaways or the detailed notes?" },
  { sender: "assistant", variant: "sub", text: "Should I also generate practice questions for this topic?" },
  { sender: "user", text: "Yes, and check my budget for this month." },
  { sender: "system", label: "Finance Agent" },
  { sender: "assistant", icon: "account_balance_wallet", color: "text-tertiary", text: "Switching to Finance. You have $120 remaining in your Food & Dining budget for October." },
];

export default function AgentPage() {
  return (
    <div className="bg-background text-on-surface antialiased h-screen w-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      <nav className="md:hidden fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-6 z-50">
        <div className="font-headline-md text-headline-md font-bold text-primary">Basecamp</div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 transition-transform">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 transition-transform">settings</span>
        </div>
      </nav>

      <Sidebar activePage="agent" />

      <main className="flex-1 flex ml-0 md:ml-sidebar-width h-full pt-16 md:pt-0 overflow-hidden relative z-10">
        <div className="hidden lg:flex flex-col w-[300px] border-r border-white/5 bg-surface-dim h-full">
          <div className="p-4 border-b border-white/5">
            <button className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] text-white py-2.5 px-4 rounded-lg font-label-md text-label-md hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {chatSidebar.map((item) => (
              <div
                key={item.title}
                className={`p-3 rounded-lg ${
                  item.active ? "bg-white/5 border border-white/10" : "hover:bg-white/5 border border-transparent"
                } cursor-pointer flex flex-col gap-1 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-label-md text-label-md ${item.active ? "text-primary" : "text-on-surface"}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{item.preview}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-background relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 relative z-10 custom-scrollbar pb-32">
            <div className="max-w-[800px] mx-auto w-full flex flex-col gap-6">
              {messages.map((message, index) => {
                if (message.sender === "user") {
                  return (
                    <div key={`${message.sender}-${index}`} className="flex justify-end w-full">
                      <div className="bg-[#3b82f6] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[75%] shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
                        <p className="font-body-md text-body-md">{message.text}</p>
                      </div>
                    </div>
                  );
                }

                if (message.sender === "system") {
                  return (
                    <div key={`${message.sender}-${index}`} className="flex justify-center w-full">
                      <span className="font-label-md text-label-md text-on-surface-variant italic opacity-70 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">subdirectory_arrow_right</span>
                        {message.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${message.sender}-${index}`}
                    className={`flex justify-start w-full ${message.variant === "sub" ? "pl-11" : "gap-3"}`}
                  >
                    {!message.variant && (
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shrink-0 shadow-sm mt-1">
                        <span
                          className={`material-symbols-outlined text-[16px] ${message.color ?? "text-primary"}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {message.icon ?? "smart_toy"}
                        </span>
                      </div>
                    )}

                    <div
                      className={`border border-white/5 text-on-surface px-5 py-4 rounded-2xl ${
                        message.variant === "sub" ? "rounded-tl-sm max-w-[85%] md:max-w-[75%] bg-surface-container-high" : "rounded-tl-sm max-w-[85%] md:max-w-[75%] bg-surface-variant shadow-sm relative overflow-hidden"
                      }`}
                    >
                      {!message.variant && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                      <p className="font-body-md text-body-md">{message.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-12 z-20">
            <div className="max-w-[800px] mx-auto w-full">
              <div className="relative flex items-end bg-surface-container-high rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors focus-within:border-[#3b82f6]/50 focus-within:bg-surface-variant p-2 backdrop-blur-xl">
                <button className="p-3 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-white/5 flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
                <textarea
                  className="w-full bg-transparent border-none text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:ring-0 resize-none py-3 px-2 max-h-[150px] overflow-y-auto custom-scrollbar"
                  placeholder="Ask Basecamp..."
                  rows={1}
                  onInput={(event) => {
                    const element = event.currentTarget;
                    element.style.height = "auto";
                    element.style.height = `${element.scrollHeight}px`;
                  }}
                />
                <button className="p-3 bg-[#3b82f6] text-white rounded-xl hover:bg-blue-600 transition-colors flex-shrink-0 mb-0.5 ml-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant/50">AI can make mistakes. Verify important information.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
