import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
