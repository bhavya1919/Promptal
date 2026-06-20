import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
}

export default function EmptyState({
    title,
    description,
    icon: Icon,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 dark:text-green-400 mb-4 shadow-sm">
                <Icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">
                {title}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white font-medium text-sm py-2.5 px-5 rounded-xl transition-all shadow-sm hover:shadow shadow-emerald-600/10 focus:ring-4 focus:ring-emerald-500/20 cursor-pointer"
                >
                    {action.icon && <action.icon className="w-4 h-4" />}
                    {action.label}
                </button>
            )}
        </div>
    );
}
