import React from "react";

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border";
    
    // Normalize status styling mapping
    const config: Record<string, string> = {
        "Applied": "bg-blue-50 text-blue-700 border-blue-150",
        "Shortlisted": "bg-emerald-50 text-emerald-700 border-emerald-150",
        "Interview Scheduled": "bg-orange-50 text-orange-700 border-orange-150",
        "Generated": "bg-purple-50 text-purple-700 border-purple-150",
        "Selected": "bg-emerald-50 text-emerald-700 border-emerald-150",
        "Rejected": "bg-red-50 text-red-700 border-red-150",
    };

    const statusStyle = config[status] || "bg-slate-50 text-slate-700 border-slate-150";

    return (
        <span className={`${baseClasses} ${statusStyle}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
            {status}
        </span>
    );
}
