"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
    Sparkles,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
// Reusing server actions logic (simulated in frontend for this specific "Mission" modality)
// In a real app, this would be `useAction` hook.

export default function ExecuteMissionModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(0)
    const [executing, setExecuting] = useState(false)

    const steps = [
        "Analyzing historical ROAS vectors...",
        "Identifying creative fatigue patterns...",
        "Calculating budget reallocation matrix...",
        "Synchronizing changes with Ad Platforms...",
        "Mission Complete."
    ]

    const runMission = async () => {
        setExecuting(true)
        for (let i = 0; i < steps.length; i++) {
            setStep(i)
            await new Promise(r => setTimeout(r, 1200)) // Simulate robust backend processing
        }
        toast.success("Optimization Mission Successfully Executed")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E2E8F0] overflow-hidden relative">
                {/* Enterprise "Terminal" Aesthetic for this specific modal */}
                <div className="bg-[#0F172A] p-6 text-white text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
                        <Sparkles className="w-6 h-6 text-[#00DDFF]" />
                    </div>
                    <h3 className="text-[18px] font-bold tracking-tight">Autonomous Optimization</h3>
                    <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mt-1">Growzzy OS • Level 4 Access</p>
                </div>

                <div className="p-8 text-center space-y-6">
                    {!executing ? (
                        <>
                            <div className="space-y-4 text-left">
                                <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                                    <div className="flex justify-between text-[13px] font-bold text-[#1F2937]">
                                        <span>Target</span>
                                        <span>Result</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] text-[#64748B]">
                                        <span>Meta Ads Budget</span>
                                        <span className="text-emerald-600 font-bold">+$450/day</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] text-[#64748B]">
                                        <span>Google Search Bid</span>
                                        <span className="text-amber-600 font-bold">-15% CPA Cap</span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#64748B] text-center leading-relaxed">
                                    System will autonomously adjust campaign parameters to maximize projected yield based on last 72h performance.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 h-11 bg-white border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#64748B] hover:text-[#1F2937]">
                                    Cancel
                                </button>
                                <button onClick={runMission} className="flex-1 h-11 bg-[#1F57F5] rounded-xl font-bold text-[13px] text-white hover:bg-[#1A4AD1] shadow-lg shadow-[#1F57F5]/20 animate-pulse">
                                    Confirm Execution
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 space-y-4">
                            <Loader2 className="w-8 h-8 text-[#1F57F5] animate-spin mx-auto" />
                            <p className="text-[13px] font-bold text-[#1F2937] animate-pulse">{steps[step]}</p>
                            <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#1F57F5] transition-all duration-500 ease-out"
                                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
