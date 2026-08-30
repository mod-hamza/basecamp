"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function StudyPage() {
  return (
    <div className="bg-background text-on-surface h-screen w-screen overflow-hidden flex font-body-md selection:bg-primary-container selection:text-on-primary-container">
      <nav className="md:hidden fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-6 z-50">
        <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
          Basecamp
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-full">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-full">settings</span>
        </div>
      </nav>

      <Sidebar activePage="study" />

      <main className="flex-1 md:ml-sidebar-width h-full flex flex-col md:flex-row pt-16 md:pt-0 bg-background overflow-hidden relative">
        <section className="w-full md:w-80 border-r border-white/5 bg-surface-container-lowest h-full flex flex-col z-10 flex-shrink-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Courses</h2>
            <button className="text-primary hover:text-primary-fixed-dim transition-colors p-1 rounded-full hover:bg-primary/10">
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-variant rounded-lg transition-colors text-left group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant transition-transform group-hover:text-on-surface rotate-90">chevron_right</span>
                <span className="font-body-sm text-body-sm font-semibold">CS101: Intro to AI</span>
              </button>
              <div className="pl-8 space-y-1 pb-2">
                <a className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant hover:text-on-surface rounded-md hover:bg-surface-variant transition-colors group cursor-pointer" href="#">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-body-sm text-body-sm">Week 1: Foundations</span>
                </a>
                <a className="flex items-center justify-between px-3 py-1.5 bg-surface-variant text-on-surface rounded-md transition-colors cursor-pointer border border-white/5" href="#">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="font-body-sm text-body-sm">Week 2: Neural Nets</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                </a>
                <a className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant/50 hover:text-on-surface-variant rounded-md hover:bg-surface-variant transition-colors group cursor-pointer" href="#">
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                  <span className="font-body-sm text-body-sm">Week 3: Deep Learning</span>
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-variant rounded-lg transition-colors text-left group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant transition-transform group-hover:text-on-surface">chevron_right</span>
                <span className="font-body-sm text-body-sm font-semibold">ECON202: Macro</span>
              </button>
            </div>

            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-variant rounded-lg transition-colors text-left group">
                <span className="material-symbols-outlined text-sm text-on-surface-variant transition-transform group-hover:text-on-surface">chevron_right</span>
                <span className="font-body-sm text-body-sm font-semibold">MATH305: Linear Alg</span>
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-white/5">
            <button className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg flex items-center justify-center gap-2 font-label-md text-label-md transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Course
            </button>
          </div>
        </section>

        <section className="flex-1 h-full flex flex-col relative z-0">
          <header className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/50 backdrop-blur-sm z-20">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Week 2: Neural Networks</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">CS101 • Prof. Alan Turing</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-full transition-colors font-label-md text-label-md group">
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">mic</span>
                Record New
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant hover:bg-surface-container-highest text-on-surface rounded-full transition-colors font-label-md text-label-md border border-white/5 group">
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-y-0.5 transition-transform">upload</span>
                Upload
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full transition-colors font-label-md text-label-md shadow-[0_0_15px_rgba(59,130,246,0.2)] group">
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">science</span>
                Quiz Me
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col relative">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="px-6 pt-4 border-b border-white/5 flex gap-6 relative z-10">
              <button className="pb-3 border-b-2 border-primary text-primary font-label-md text-label-md uppercase tracking-wider">Notes</button>
              <button className="pb-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md uppercase tracking-wider">Transcript</button>
              <button className="pb-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md uppercase tracking-wider flex items-center gap-2">
                Practice
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px]">3</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:px-12 xl:px-24 max-w-[1000px] mx-auto w-full relative z-10 space-y-8 pb-32">
              <article className="glass-panel rounded-xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Lecture Summary</h3>
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-variant">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>

                <div className="prose prose-invert max-w-none font-body-md text-on-surface/90 space-y-4">
                  <p>Introduction to the basic building blocks of modern deep learning, focusing on the perceptron model and backpropagation.</p>
                  <h4 className="font-headline-sm text-[18px] text-on-surface mt-6 mb-3">Core Components</h4>
                  <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
                    <li><strong>Weights &amp; Biases:</strong> The learnable parameters of the network.</li>
                    <li><strong>Activation Functions:</strong> Introduce non-linearity (e.g., ReLU, Sigmoid).</li>
                    <li><strong>Loss Function:</strong> Measures how far the prediction is from the truth.</li>
                  </ul>

                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
                    <div>
                      <h5 className="font-body-md font-semibold text-primary mb-1">Key Concept: Backpropagation</h5>
                      <p className="text-sm text-on-surface-variant">The process of calculating gradients of the loss function with respect to weights using the chain rule, enabling the network to learn.</p>
                      <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 bg-surface-container rounded text-xs text-on-surface border border-white/5">Chain Rule</span>
                        <span className="px-2 py-1 bg-surface-container rounded text-xs text-on-surface border border-white/5">Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <div className="space-y-4">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Quick Check
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded uppercase tracking-wide">Easy</span>
                        <span className="text-on-surface-variant text-sm">Q1</span>
                      </div>
                      <p className="font-body-md text-on-surface mb-4">What is the primary purpose of an activation function in a neural network?</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-surface-variant cursor-pointer transition-colors">
                          <input className="form-radio text-primary bg-surface-container border-outline focus:ring-primary focus:ring-offset-surface" name="q1" type="radio" />
                          <span className="font-body-sm text-on-surface-variant">To initialize weights</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5 cursor-pointer transition-colors">
                          <input defaultChecked className="form-radio text-primary bg-surface-container border-outline focus:ring-primary focus:ring-offset-surface" name="q1" type="radio" />
                          <span className="font-body-sm text-on-surface">To introduce non-linearity</span>
                        </label>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 text-center text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Check Answer</button>
                  </div>

                  <div className="glass-panel p-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between opacity-80">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded uppercase tracking-wide">Medium</span>
                        <span className="text-on-surface-variant text-sm">Q2</span>
                      </div>
                      <p className="font-body-md text-on-surface mb-4">Which optimizer is generally considered most adaptive for sparse data?</p>
                    </div>
                    <button className="w-full mt-4 py-2 text-center text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">Start Question</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-lg flex flex-col items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300" id="recording-overlay">
          <div className="absolute top-8 right-8">
            <button className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors" id="btn-close-record">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="text-center space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
              <span className="text-rose-400 font-label-md text-label-md uppercase tracking-wider">Recording Active</span>
            </div>

            <div className="font-display-lg text-[64px] font-bold text-on-surface tabular-nums tracking-tight">04:23</div>
            <p className="text-on-surface-variant font-body-md">Listening to &ldquo;Week 2: Neural Networks&rdquo; lecture...</p>

            <div className="flex items-center justify-center gap-1 h-24 w-64 my-8">
              <div className="w-2 bg-primary/40 rounded-full h-8 animate-[bounce_1s_infinite_0ms]"></div>
              <div className="w-2 bg-primary/60 rounded-full h-16 animate-[bounce_1.2s_infinite_100ms]"></div>
              <div className="w-2 bg-primary/80 rounded-full h-24 animate-[bounce_0.8s_infinite_200ms]"></div>
              <div className="w-2 bg-primary rounded-full h-12 animate-[bounce_1.1s_infinite_300ms]"></div>
              <div className="w-2 bg-primary/90 rounded-full h-20 animate-[bounce_0.9s_infinite_400ms]"></div>
              <div className="w-2 bg-primary/70 rounded-full h-14 animate-[bounce_1.3s_infinite_500ms]"></div>
              <div className="w-2 bg-primary/50 rounded-full h-10 animate-[bounce_1s_infinite_600ms]"></div>
              <div className="w-2 bg-primary/30 rounded-full h-6 animate-[bounce_1.2s_infinite_700ms]"></div>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <button className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[28px]">pause</span>
              </button>
              <button className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
              </button>
              <button className="w-14 h-14 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[24px]">bookmark</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-surface/90 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-4 z-50 pb-safe">
        <Link className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-primary transition-colors" href="/agent">
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-primary transition-colors" href="/finance">
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 p-2 text-primary" href="/study">
          <div className="w-12 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
        </Link>
        <Link className="flex flex-col items-center gap-1 p-2 text-on-surface-variant hover:text-primary transition-colors" href="/calendar">
          <span className="material-symbols-outlined text-[24px]">calendar_today</span>
        </Link>
      </nav>
    </div>
  );
}
