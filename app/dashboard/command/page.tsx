"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Command, Grid, Users, LayoutDashboard, Database, Activity } from "lucide-react"

export default function CommandHubPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center text-center space-y-8 bg-[#F8FAFC]">
                <div className="w-24 h-24 bg-white rounded-xl shadow-lg border border-[#E2E8F0] flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                    <Command className="w-10 h-10 text-[#1F57F5] z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1F57F5] animate-pulse" />
                </div>

                <div className="space-y-4 max-w-lg">
                    <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">Command Hub Initialization</h1>
                    <p className="text-[#64748B] text-base leading-relaxed">
                        The central nervous system for Growzzy OS is synchronizing with your connected platforms.
                        This module will provide a unified command interface for global actions.
                    </p>
                </div>

                <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Global Search", desc: "Index across all entities", icon: Database },
                        { label: "Bulk Actions", desc: "Multi-platform orchestration", icon: LayoutDashboard },
                        { label: "System Health", desc: "Real-time API monitoring", icon: Activity },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col items-start gap-3 hover:border-[#1F57F5]/30 transition-colors group">
                            <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center group-hover:bg-[#EFF6FF] transition-colors">
                                <feature.icon className="w-5 h-5 text-[#64748B] group-hover:text-[#1F57F5]" />
                            </div>
                            <div className="text-left space-y-1">
                                <h3 className="text-sm font-bold text-[#1F2937]">{feature.label}</h3>
                                <p className="text-xs text-[#94A3B8]">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    )
}
