"use client";

import Sidebar from "@/components/Sidebar";

const scheduleEvents = [
  { time: "09:00", suffix: "AM", label: "Class", labelColor: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20", title: "Advanced Linear Algebra", detail: "Room 402, Science Building", accent: "bg-[#3b82f6]", duration: "1.5 hrs" },
  { time: "11:30", suffix: "AM", label: "Exam Prep", labelColor: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20", title: "Study Block: Midterm", detail: "Review Chapters 4-6", accent: "bg-[#f97316]", duration: "2 hrs", ai: true },
  { time: "14:00", suffix: "PM", label: "Personal", labelColor: "bg-surface-variant text-on-surface-variant border-white/10", title: "Gym Session", detail: "", accent: "bg-outline", duration: "1 hr", dimmed: true },
];

export default function CalendarPage() {
  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md bg-background text-on-surface">
      <nav aria-label="Top Navigation" className="md:hidden fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-md z-50 flex justify-between items-center px-6 shadow-sm border-b border-white/10">
        <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">Basecamp</div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button aria-label="Notifications" className="hover:bg-white/5 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button aria-label="Settings" className="hover:bg-white/5 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </nav>

      <Sidebar activePage="calendar" />

      <main className="flex-1 md:ml-[280px] h-full overflow-y-auto mt-16 md:mt-0 p-container-margin md:p-8 bg-background scroll-smooth">
        <div className="max-w-[1000px] mx-auto space-y-stack-lg">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Schedule</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage your academic and personal time.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-surface-container px-4 py-2 rounded-lg border border-white/5">
                <span className="font-label-md text-label-md text-on-surface">Proactive Suggestions</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-surface-variant appearance-none cursor-pointer z-10 transition-all duration-300 right-0 border-primary" id="suggestion-toggle" name="toggle" type="checkbox" />
                  <label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container cursor-pointer transition-colors duration-300" htmlFor="suggestion-toggle" />
                </div>
              </div>

              <button className="px-4 py-2 rounded-lg font-label-md text-label-md border border-white/20 text-on-surface hover:bg-white/5 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Sync Google Calendar
              </button>

              <button className="px-5 py-2 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary-container hover:bg-primary transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(77,142,255,0.15)]">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Event
              </button>
            </div>
          </header>

          <div className="glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6" id="suggestion-banner">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-primary/20 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Upcoming Assessment</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">You have a quiz on Friday. Want me to set an alarm and study block for Thursday night?</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none px-4 py-2 rounded-lg font-label-md text-label-md border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors">
                Dismiss
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 rounded-lg font-label-md text-label-md bg-primary-container/20 text-primary border border-primary/30 hover:bg-primary-container/30 transition-colors">
                Yes, set it
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Today</h3>

              {scheduleEvents.map((event) => (
                <div
                  key={event.time}
                  className={`bg-surface-container rounded-xl p-5 border border-white/5 hover:border-white/20 transition-colors group relative flex gap-4 ${event.dimmed ? "opacity-70" : ""}`}
                >
                  <div className="flex flex-col items-center w-16 flex-shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface">{event.time}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{event.suffix}</span>
                  </div>
                  <div className="w-1 bg-surface-variant rounded-full relative">
                    <div className={`absolute top-0 left-0 w-full ${event.accent} rounded-full ${event.dimmed ? "h-1/3" : event.label === "Exam Prep" ? "h-full" : "h-1/2"}`} />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2 items-center">
                        <span className={`px-2 py-1 rounded ${event.labelColor} font-label-sm text-label-sm border`}>
                          {event.label}
                        </span>
                        {event.ai && (
                          <span className="material-symbols-outlined text-primary text-[16px] bg-primary/10 rounded p-0.5" title="Suggested by AI Agent">smart_toy</span>
                        )}
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {event.duration}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{event.title}</h4>
                    {event.detail && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">{event.label === "Class" ? "location_on" : "menu_book"}</span>
                        {event.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-xl p-6">
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Weekly Overview</h4>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <span key={day + index} className="font-label-sm text-label-sm text-on-surface-variant">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center font-body-sm text-body-sm">
                  <span className="py-1 text-on-surface-variant/50">28</span>
                  <span className="py-1 text-on-surface-variant/50">29</span>
                  <span className="py-1 text-on-surface-variant/50">30</span>
                  <span className="py-1 bg-primary-container text-on-primary-container rounded-full font-bold">1</span>
                  <span className="py-1 text-on-surface">2</span>
                  <span className="py-1 text-on-surface relative">3<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#f97316] rounded-full"></span></span>
                  <span className="py-1 text-on-surface">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
