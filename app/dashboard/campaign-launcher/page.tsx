"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AudienceStep } from "./_components/AudienceStep";
import { CreativeStep } from "./_components/CreativeStep";
import { ReviewStep } from "./_components/ReviewStep";

/* -------------------------------------------------------------------------- */
/*                             State Management                               */
/* -------------------------------------------------------------------------- */

type Goal = "Sales" | "Leads" | "Traffic" | "App Installs";

type Strategy = "Full-Funnel" | "Conversion Booster" | "Audience Expansion";

interface CampaignSetup {
  goal?: Goal;
  strategy?: Strategy;
  dailyBudget?: number;
  audiences: string[]; // ids or names
  creatives: string[]; // ids
}

interface CampaignLauncherContextValue {
  data: CampaignSetup;
  update: (partial: Partial<CampaignSetup>) => void;
}

const CampaignLauncherContext = createContext<CampaignLauncherContextValue | null>(
  null
);

function useCampaignLauncher() {
  const ctx = useContext(CampaignLauncherContext);
  if (!ctx) throw new Error("useCampaignLauncher must be used within provider");
  return ctx;
}

function CampaignLauncherProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CampaignSetup>({
    audiences: [],
    creatives: [],
  });

  const update = (partial: Partial<CampaignSetup>) =>
    setData((p) => ({ ...p, ...partial }));

  return (
    <CampaignLauncherContext.Provider value={{ data, update }}>
      {children}
    </CampaignLauncherContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Steps                                    */
/* -------------------------------------------------------------------------- */

const steps = [
  "Goal Selection",
  "AI Strategy Templates",
  "Budget Allocation",
  "Audience Recommendations",
  "Creative Selection",
  "Review & Launch"
] as const;

type StepKey = typeof steps[number];

import { Zap, Target, Users, Sparkles, BarChart3, ChevronRight, ArrowLeft, Wand2, Globe, Rocket, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";

function Sidebar({ currentStep }: { currentStep: number }) {
  const stepIcons = [Target, Zap, DollarSign, Users, Sparkles, Rocket];

  return (
    <aside className="w-80 border-r border-neutral-100 bg-white p-8 flex flex-col h-full sticky top-0 hidden lg:flex">
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-neutral-100">
        <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
          <Wand2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-neutral-900 leading-tight">Launch Wizard</h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Campaign Architect v2.0</p>
        </div>
      </div>

      <nav className="flex-1">
        <ol className="space-y-2">
          {steps.map((label, idx) => {
            const Icon = stepIcons[idx] || Target;
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <li key={label} className="relative">
                {idx < steps.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-6 ${isCompleted ? "bg-neutral-900" : "bg-neutral-100"}`} />
                )}
                <div className={cn(
                  "flex items-center gap-4 p-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-neutral-50 shadow-sm border border-neutral-100" : "opacity-60"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isCompleted ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      isActive ? "bg-neutral-900 text-white shadow-lg" : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                  )}>
                    {isCompleted ? <ShieldCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className={cn("text-xs font-black uppercase tracking-wider", isActive ? "text-neutral-900" : "text-neutral-400")}>{label}</h4>
                    {isActive && <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Focus: Precision</p>}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="mt-auto p-5 bg-neutral-50 rounded-[2rem] border border-neutral-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">AI Safety Score</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
        </div>
        <p className="text-[10px] text-neutral-400 mt-2 font-medium">92% Launch Confidence</p>
      </div>
    </aside>
  );
}

function GoalStep() {
  const { data, update } = useCampaignLauncher();
  const goals: { id: Goal; desc: string; icon: any }[] = [
    { id: "Sales", desc: "Drive high-intent purchases", icon: DollarSign },
    { id: "Leads", desc: "Capture prospect information", icon: Users },
    { id: "Traffic", desc: "Flood your site with visitors", icon: Globe },
    { id: "App Installs", desc: "Maximize app mobile growth", icon: Smartphone },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => (
          <button
            key={g.id}
            className={cn(
              "group relative flex items-start gap-4 p-8 rounded-[2rem] border-2 text-left transition-all duration-300",
              data.goal === g.id
                ? "border-neutral-900 bg-neutral-900 text-white shadow-2xl shadow-neutral-200"
                : "border-neutral-100 bg-white hover:border-neutral-300"
            )}
            onClick={() => update({ goal: g.id })}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              data.goal === g.id ? "bg-white/10 text-white" : "bg-neutral-50 text-neutral-900 group-hover:scale-110"
            )}>
              <g.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black tracking-tight">{g.id}</h3>
              <p className={cn(
                "text-xs font-medium mt-1 leading-relaxed",
                data.goal === g.id ? "text-neutral-400" : "text-neutral-500"
              )}>{g.desc}</p>
            </div>
            {data.goal === g.id && (
              <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-xs text-amber-800 font-bold leading-relaxed">
          AI Suggestion: For your current industry profile (SaaS), a "Leads" objective typically yields 40% higher ROI.
        </p>
      </div>
    </div>
  );
}

function BudgetStep() {
  const { data, update } = useCampaignLauncher();
  return (
    <div className="max-w-xl mx-auto space-y-12 py-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Automatic Intelligence</div>
        <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Optimal Daily spend</h3>
        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
          Our algorithm recommends a budget of <span className="text-neutral-900 font-black">$450.00</span> to saturate your prime audience within 48 hours.
        </p>
      </div>

      <div className="space-y-6 relative">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-4xl font-black text-neutral-100 select-none">$</div>
        <input
          type="number"
          min={50}
          value={data.dailyBudget ?? ""}
          onChange={(e) => update({ dailyBudget: parseFloat(e.target.value) })}
          placeholder="0.00"
          className="w-full text-7xl font-black text-center tracking-tighter bg-transparent outline-none focus:ring-0 placeholder:text-neutral-50 border-none"
          autoFocus
        />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[250, 500, 1000, 2500].map(val => (
          <button
            key={val}
            onClick={() => update({ dailyBudget: val })}
            className="py-4 rounded-2xl border border-neutral-100 text-sm font-black text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all bg-white"
          >
            ${val.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

function CampaignLauncherContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const { data } = useCampaignLauncher();

  const nextDisabled = (() => {
    switch (currentStep) {
      case 0: return !data.goal;
      case 1: return !data.strategy;
      case 2: return !data.dailyBudget || data.dailyBudget <= 0;
      case 3: return data.audiences.length === 0;
      case 4: return data.creatives.length === 0;
      default: return false;
    }
  })();

  const handleLaunch = () => {
    toast.success("Initiating multi-channel deployment...");
    setTimeout(() => {
      toast.success("Campaign groups synchronized on Meta & Google!");
      router.push("/dashboard/campaigns");
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#fafafa]">
        <Sidebar currentStep={currentStep} />

        <div className="flex-1 flex flex-col relative min-w-0">
          <main className="flex-1 p-8 lg:p-16 overflow-y-auto pb-40">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Step 0{currentStep + 1}</div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight">{steps[currentStep]}</h1>
                <div className="h-1.5 w-12 bg-neutral-900 rounded-full" />
              </div>

              <StepContent step={currentStep} />
            </div>
          </main>

          <div className="absolute bottom-0 inset-x-0 p-8 lg:p-10 pointer-events-none">
            <div className="max-w-4xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] shadow-2xl pointer-events-auto">
              <button
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-all"
                onClick={() => isFirst ? router.back() : setCurrentStep((s) => Math.max(s - 1, 0))}
              >
                <ArrowLeft className="w-4 h-4" />
                {isFirst ? "Cancel" : "Previous"}
              </button>

              <div className="flex items-center gap-4">
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => !nextDisabled && setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
                    disabled={nextDisabled}
                    className={cn(
                      "flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                      nextDisabled
                        ? "bg-neutral-100 text-neutral-300"
                        : "bg-neutral-900 text-white shadow-xl shadow-neutral-200 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    CONTINUE
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleLaunch}
                    className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-neutral-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-neutral-200 hover:scale-[1.05] active:scale-[0.95] transition-all"
                  >
                    DEPLOY CAMPAIGN
                    <Rocket className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CampaignLauncherPage() {
  return (
    <CampaignLauncherProvider>
      <CampaignLauncherContent />
    </CampaignLauncherProvider>
  );
}

export default function CampaignLauncherPage() {

  return (
    <CampaignLauncherProvider>
      <CampaignLauncherContent />
    </CampaignLauncherProvider>
  );
}
