"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

interface ApplicationData {
    id: string;
    candidate_name: string;
    skills: string;
    job_title: string;
    requirements: string;
    recruiter_status: string;
    ai_score: number;
}

import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";
import StatusBadge from "@/components/StatusBadge";

export default function ApplicationsPage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <ApplicationsPageContent />
        </ProtectedRoute>
    );
}

function ApplicationsPageContent() {
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const calculateScore = (
        requirements: string,
        skills: string
    ) => {
        const reqSkills = requirements
            .toLowerCase()
            .split(",")
            .map((s) => s.trim());
        const candidateSkills = skills
            .toLowerCase()
            .split(",")
            .map((s) => s.trim());

        const matched = reqSkills.filter((skill) =>
            candidateSkills.includes(skill)
        );

        return Math.round(
            (matched.length / reqSkills.length) * 100
        );

    };

    const fetchApplications = async () => {
        const { data: applicationsData, error } =
            await supabase.from("applications").select("*");

        if (error) {
            console.error(error);
            return;
        }

        const results: ApplicationData[] = [];

        for (const app of applicationsData || []) {
            const { data: candidate } = await supabase
                .from("candidates")
                .select("*")
                .eq("id", app.candidate_id)
                .single();

            const { data: job } = await supabase
                .from("jobs")
                .select("*")
                .eq("id", app.job_id)
                .single();

            const score = calculateScore(
                job?.requirements || "",
                candidate?.skills || ""
            );

            await supabase
                .from("applications")
                .update({
                    ai_score: score,
                })
                .eq("id", app.id);

            results.push({
                id: app.id,
                candidate_name:
                    candidate?.candidate_name || "Unknown",
                skills: candidate?.skills || "",
                job_title: job?.title || "",
                requirements: job?.requirements || "",
                recruiter_status:
                    app.recruiter_status || "Applied",
                ai_score: score,
            });
        }

        setApplications(results);
        setLoading(false);

    };

    const shortlistCandidate = async (
        applicationId: string
    ) => {
        const { error } = await supabase
            .from("applications")
            .update({
                recruiter_status: "Shortlisted",
            })
            .eq("id", applicationId);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Candidate Shortlisted");

        fetchApplications();

    };

    return (<DashboardLayout><div className="p-8"> <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
            Applications Management
        </h1>

        {loading ? (
            <p>Loading...</p>
        ) : (
            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-4">
                                Candidate
                            </th>
                            <th className="text-left p-4">
                                Skills
                            </th>
                            <th className="text-left p-4">
                                Job
                            </th>
                            <th className="text-left p-4">
                                AI Score
                            </th>
                            <th className="text-left p-4">
                                Status
                            </th>
                            <th className="text-left p-4">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app) => (
                            <tr
                                key={app.id}
                                className="border-b"
                            >
                                <td className="p-4">
                                    {app.candidate_name}
                                </td>

                                <td className="p-4">
                                    {app.skills}
                                </td>

                                <td className="p-4">
                                    {app.job_title}
                                </td>

                                <td className="p-4">
                                    <span className="font-bold text-emerald-600">
                                        {app.ai_score}%
                                    </span>
                                </td>

                                <td className="p-4">
                                    <StatusBadge status={app.recruiter_status} />
                                </td>

                                <td className="p-4">
                                    {app.recruiter_status === "Shortlisted" ? (
                                        <span className="text-emerald-600 font-semibold text-sm">
                                            Shortlisted
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                shortlistCandidate(app.id)
                                            }
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                        >
                                            Shortlist
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        )}

    </div>
    </div>
    </DashboardLayout>
    );
}
