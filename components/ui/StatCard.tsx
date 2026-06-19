import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    loading?: boolean;
    color?: "emerald" | "blue" | "orange" | "purple" | "rose" | "indigo";
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    loading = false,
    color = "emerald",
}: StatCardProps) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                {description && <div className="h-3 bg-slate-200 rounded w-32"></div>}
            </div>
        );
    }

    const colorConfig = {
        emerald: {
            bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            glow: "shadow-emerald-100",
            iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        },
        blue: {
            bg: "bg-blue-50 text-blue-600 border-blue-100",
            glow: "shadow-blue-100",
            iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
        },
        orange: {
            bg: "bg-orange-50 text-orange-600 border-orange-100",
            glow: "shadow-orange-100",
            iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
        },
        purple: {
            bg: "bg-purple-50 text-purple-600 border-purple-100",
            glow: "shadow-purple-100",
            iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
        },
        rose: {
            bg: "bg-rose-50 text-rose-600 border-rose-100",
            glow: "shadow-rose-100",
            iconBg: "bg-gradient-to-br from-rose-400 to-rose-600",
        },
        indigo: {
            bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
            glow: "shadow-indigo-100",
            iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
        },
    }[color];

    return (
        <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 tracking-wide">{title}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${colorConfig.iconBg} ${colorConfig.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            
            <div className="space-y-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
                    {value}
                </span>
                
                <div className="flex items-center gap-2">
                    {trend && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                            {trend.isPositive ? "+" : ""}{trend.value}
                        </span>
                    )}
                    {description && (
                        <span className="text-xs text-slate-400 font-medium">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
