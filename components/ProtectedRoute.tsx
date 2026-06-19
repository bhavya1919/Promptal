"use client";

import React, { useEffect } from "react";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, Home } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { role, user, loading } = useUserRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white shadow-xl border border-slate-100 max-w-sm w-full">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-25 animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative animate-duration-1000" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 animate-pulse">Verifying access...</h3>
                    <p className="text-sm text-slate-500 text-center">Please wait while we check your credentials.</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    if (!role || !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
                    <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-2xl">
                        <ShieldAlert className="w-12 h-12" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                        <p className="text-slate-500">
                            You do not have permission to access this page.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link 
                            href="/" 
                            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/10 focus:ring-4 focus:ring-emerald-500/20 cursor-pointer"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
