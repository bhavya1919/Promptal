"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FileText, Briefcase } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function CandidateApplicationsPage() {
    return (
        <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateApplicationsContent />
        </ProtectedRoute>
    );
}

function CandidateApplicationsContent() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data: candidate } = await supabase
            .from("candidates")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (candidate) {
            const { data: apps } = await supabase
                .from("applications")
                .select(`
                    id,
                    job_id,
                    created_at,
                    recruiter_status,
                    ai_score,
                    jobs (
                        title
                    )
                `)
                .eq("candidate_id", candidate.id);

            if (apps) {
                const mappedApps = apps.map((app: any) => ({
                    ...app,
                    job_title: app.jobs?.title || "Unknown Job"
                }));
                setApplications(mappedApps);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-slate-200 rounded-xl mb-10"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-emerald-600" />
                        My Applications
                    </h2>
                    {applications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-12 text-center border border-slate-100 flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Briefcase className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No Applications Yet</h3>
                            <p className="text-slate-500">Explore our jobs board to find your next great opportunity.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="text-left p-4 text-sm font-semibold text-slate-600">Job Title</th>
                                            <th className="text-left p-4 text-sm font-semibold text-slate-600">Date Applied</th>
                                            <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 font-medium text-slate-800">{app.job_title}</td>
                                                <td className="p-4 text-slate-600">
                                                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <StatusBadge status={app.recruiter_status || "Applied"} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
