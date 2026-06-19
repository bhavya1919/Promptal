import React from "react";

export function SkeletonCard() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
            <div className="flex justify-between items-start">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-32"></div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="animate-pulse flex items-center space-x-4 py-4 px-6 border-b border-slate-100 last:border-0">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6 ml-auto"></div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-32"></div>
                <div className="h-5 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonRow key={i} />
                ))}
            </div>
        </div>
    );
}
