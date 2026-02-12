"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Zap, Target, Users, Sparkles, BarChart3, ChevronRight, ArrowLeft, Wand2, Globe, Rocket, ShieldCheck, DollarSign, Smartphone, Loader2,
  Facebook, Linkedin
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { AudienceStep } from "./_components/AudienceStep";
import { CreativeStep } from "./_components/CreativeStep";
import { ReviewStep } from "./_components/ReviewStep";
import { useCampaignLauncher, CampaignLauncherProvider, type Goal, type Strategy, type CampaignSetup } from "./_context/CampaignLauncherContext";

const steps = [
  "Platform Matrix",
  "Strategic Goals",
  "Blueprint Selection",
  "Capital Allocation",
  "Audience Index",
  "Creative Synthesis",
  "Review & Deploy"
] as const;

function PlatformStep() {
  const { data, update } = useCampaignLauncher();
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/platforms")
      .then(res => res.json())
      .then(d => {
        setPlatforms(d.platforms || []);
        setLoading(false);
      });
  }, []);

  const PLATFORM_ICONS: any = {
    google: Globe,
    meta: Facebook,
    linkedin: Linkedin,
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-neutral-200" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {platforms.map((p) => {
        const Icon = PLATFORM_ICONS[p.name.toLowerCase()] || Globe;
        return (
          <button
            key={p.id}
            className={cn(
              "p-8 rounded-[2rem] border-2 text-left transition-all duration-300",
              data.platformId === p.id ? "bg-black text-white border-black" : "bg-white border-neutral-100"
            )}
            onClick={() => update({ platformId: p.id } as any)}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", data.platformId === p.id ? "bg-white/10" : "bg-neutral-50")}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black">{p.accountName || p.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Node ID: {p.id.slice(-6)}</p>
          </button>
        )
      })}
      {platforms.length === 0 && (
        <div className="col-span-3 p-12 text-center bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">No production nodes connected. Please bridge a platform in Settings.</p>
        </div>
      )}
    </div>
  );
}

function GoalStep() {
  const { data, update } = useCampaignLauncher();
  const goals: { id: Goal; desc: string; icon: any }[] = [
    { id: "Sales", desc: "Drive high-intent purchases", icon: DollarSign },
    { id: "Leads", desc: "Capture prospect information", icon: Users },
    { id: "Traffic", desc: "Flood your site with visitors", icon: Globe },
    { id: "App Installs", desc: "Maximize mobile growth", icon: Smartphone },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {goals.map((g) => (
        <button
          key={g.id}
          className={cn("p-8 rounded-[2rem] border-2 text-left transition-all", data.goal === g.id ? "bg-black text-white border-black" : "bg-white border-neutral-100 hover:border-neutral-300")}
          onClick={() => update({ goal: g.id })}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all", data.goal === g.id ? "bg-white/10" : "bg-neutral-50")}>
            <g.icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black">{g.id}</h3>
          <p className="text-xs text-neutral-400 mt-1">{g.desc}</p>
        </button>
      ))}
    </div>
  );
}

function StrategyStep() {
  const { data, update } = useCampaignLauncher();
  const strategies: Strategy[] = ["Full-Funnel", "Conversion Booster", "Audience Expansion"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {strategies.map((s) => (
        <button
          key={s}
          className={cn("p-8 rounded-[2rem] border-2 text-left transition-all", data.strategy === s ? "bg-black text-white border-black" : "bg-white border-neutral-100 hover:border-neutral-300")}
          onClick={() => update({ strategy: s })}
        >
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", data.strategy === s ? "bg-white/10" : "bg-neutral-50")}>
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black tracking-tight mb-2">{s}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">AI TEMPLATE</p>
        </button>
      ))}
    </div>
  );
}

function BudgetStep() {
  const { data, update } = useCampaignLauncher();
  return (
    <div className="max-w-xl mx-auto space-y-12 py-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Optimal Allocation</h3>
        <p className="text-xs text-neutral-500 font-medium tracking-widest uppercase">SYTEM ENFORCED LIMIT: $50+</p>
      </div>
      <div className="space-y-6 relative">
        <input
          type="number"
          min={50}
          value={data.dailyBudget ?? ""}
          onChange={(e) => update({ dailyBudget: parseFloat(e.target.value) })}
          placeholder="0.00"
          className="w-full text-7xl font-black text-center tracking-tighter bg-transparent outline-none focus:ring-0 placeholder:text-neutral-50 border-none"
        />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[250, 500, 1000, 2500].map(val => (
          <button
            key={val}
            onClick={() => update({ dailyBudget: val })}
            className={cn("py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all", data.dailyBudget === val ? "bg-black text-white border-black" : "bg-white border-neutral-100 hover:border-black")}
          >
            ${val}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0: return <PlatformStep />;
    case 1: return <GoalStep />;
    case 2: return <StrategyStep />;
    case 3: return <BudgetStep />;
    case 4: return <AudienceStep />;
    case 5: return <CreativeStep />;
    case 6: return <ReviewStep />;
    default: return null;
  }
}

function CampaignLauncherContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();
  const { data, reset } = useCampaignLauncher();

  const handleLaunch = async () => {
    setIsLaunching(true);
    toast.info("Transmitting operational blueprints...");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: (data as any).platformId || "demo-platform",
          name: `STRATEGIC_${data.goal?.toUpperCase()}_${new Date().getMonth() + 1}${new Date().getDate()}`,
          objective: data.goal,
          dailyBudget: data.dailyBudget,
          status: 'active',
          targeting: { audiences: data.audiences },
          creatives: data.creatives
        })
      });

      const resData = await res.json();
      if (resData.success) {
        toast.success("Cognitive Campaign Deployed Successfully");
        reset();
        router.push("/dashboard/campaigns");
      } else {
        toast.error(resData.error || "Deployment Failure");
      }
    } catch (err) {
      toast.error("Bridge connection refused");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-72px)] overflow-hidden bg-white gemini-surface p-8 lg:p-12 font-satoshi">
        <div className="max-w-6xl mx-auto w-full flex flex-col space-y-12">
          <div className="flex items-end justify-between border-b border-[#F1F5F9] pb-10">
            <div className="space-y-1 text-left">
              <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">{steps[currentStep]}</h1>
              <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Campaign Architect v2.2 // NODE_STEP_{currentStep + 1}</p>
            </div>
            <div className="flex items-center gap-3">
              {steps.map((_, i) => (
                <div key={i} className={cn("w-10 h-1 rounded-full transition-all duration-300", i <= currentStep ? "bg-[#1F57F5]" : "bg-[#F1F5F9]")} />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-32">
            <StepContent step={currentStep} />
          </div>

          {/* Unified Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 h-32 bg-white/90 backdrop-blur-xl border-t border-[#F1F5F9] flex items-center px-12 z-50">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
              <button
                onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : router.back()}
                className="px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-[#64748B] hover:text-[#05090E] transition-all"
              >
                {currentStep === 0 ? 'Abort Mission' : 'Reverse Matrix'}
              </button>

              <div className="flex items-center gap-4">
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(s => s + 1)}
                    className="h-14 px-12 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1A4AD1] transition-all flex items-center gap-3 shadow-xl shadow-[#1F57F5]/20 active:scale-[0.98]"
                  >
                    Advance Layer <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={isLaunching}
                    onClick={handleLaunch}
                    className="h-14 px-12 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1A4AD1] transition-all flex items-center gap-3 shadow-xl shadow-[#1F57F5]/20 active:scale-[0.98]"
                  >
                    {isLaunching ? <Loader2 className="animate-spin" /> : <Rocket className="w-5 h-5 text-[#00DDFF]" />}
                    Execute Deployment
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
