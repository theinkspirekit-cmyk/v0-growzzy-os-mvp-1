
"use client"

import { useState } from "react"
import { Facebook, Chrome, Linkedin, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Note: We'll use simple icons or import brand logos if available, but Lucide has minimal set.

interface OnboardingModalProps {
    onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [connecting, setConnecting] = useState<string | null>(null)
    const [step, setStep] = useState<'select' | 'success'>('select')

    const handleConnect = async (platform: string) => {
        setConnecting(platform)
        try {
            // Simulate API call
            const res = await fetch('/api/platforms/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platformName: platform })
            })

            if (!res.ok) throw new Error('Failed to connect')

            toast.success(`Successfully connected to ${platform}`)
            setStep('success')
        } catch (err) {
            toast.error("Connection failed. Please try again.")
        } finally {
            setConnecting(null)
        }
    }

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Protocol Activated</h2>
                    <p className="text-gray-500">Your data streams are now syncing in real-time. The dashboard will populate shortly.</p>
                    <button
                        onClick={onComplete}
                        className="w-full bg-[#1F57F5] text-white h-12 rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        Enter Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row h-[500px]">

                {/* Left Side - Visual */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-[#1F57F5] to-[#2BAFF2] p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                            <span className="font-bold">1/2</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connect Your Data Sources</h2>
                        <p className="text-blue-100 text-sm leading-relaxed">To power the neural engine, we need access to your active campaign data.</p>
                    </div>

                    {/* Abstract Visuals */}
                    <div className="absolute top-1/2 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl " />
                </div>

                {/* Right Side - Actions */}
                <div className="flex-1 p-8 bg-gray-50 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Select a platform to sync</h3>

                    <div className="space-y-3 flex-1">
                        {/* Meta */}
                        <button
                            onClick={() => handleConnect("Meta Ads")}
                            disabled={!!connecting}
                            className="w-full group bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md p-4 rounded-xl flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1877F2]/10 rounded-lg flex items-center justify-center text-[#1877F2]">
                                    <Facebook className="w-5 h-5 fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm">Meta Ads</p>
                                    <p className="text-xs text-gray-500">Facebook & Instagram</p>
                                </div>
                            </div>
                            {connecting === 'Meta Ads' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500" />}
                        </button>

                        {/* Google */}
                        <button
                            onClick={() => handleConnect("Google Ads")}
                            disabled={!!connecting}
                            className="w-full group bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md p-4 rounded-xl flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                    <Chrome className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm">Google Ads</p>
                                    <p className="text-xs text-gray-500">Search, Display, Youtube</p>
                                </div>
                            </div>
                            {connecting === 'Google Ads' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500" />}
                        </button>

                        {/* LinkedIn */}
                        <button
                            onClick={() => handleConnect("LinkedIn Ads")}
                            disabled={!!connecting}
                            className="w-full group bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md p-4 rounded-xl flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#0A66C2]">
                                    <Linkedin className="w-5 h-5 fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm">LinkedIn Ads</p>
                                    <p className="text-xs text-gray-500">B2B Campaigns</p>
                                </div>
                            </div>
                            {connecting === 'LinkedIn Ads' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-500" />}
                        </button>
                    </div>

                    <p className="text-[11px] text-center text-gray-400 mt-4">Safe & Secure OAuth 2.0 connection. Read-only permissions initially.</p>
                </div>
            </div>
        </div>
    )
}
