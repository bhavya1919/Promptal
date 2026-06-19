import React from "react";

interface SectionCardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function SectionCard({
    title,
    subtitle,
    children,
    actions,
    className = "",
    noPadding = false,
}: SectionCardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
            {(title || subtitle || actions) && (
                <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        {title && (
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs text-slate-500 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-2 shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className={noPadding ? "" : "p-6"}>
                {children}
            </div>
        </div>
    );
}
