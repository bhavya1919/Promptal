"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { CalendarDays } from "lucide-react";

interface Application {
    id: string;
    candidate_name: string;
    recruiter_status: string;
}

import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

export default function InterviewsPage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <InterviewsPageContent />
        </ProtectedRoute>
    );
}

function InterviewsPageContent() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [interviewStates, setInterviewStates] = useState<Record<string, { date: string; time: string; link: string }>>({});

    useEffect(() => {
        fetchShortlistedCandidates();
    }, []);

    const fetchShortlistedCandidates = async () => {
        const { data: apps } = await supabase
            .from("applications")
            .select("*")
            .eq("recruiter_status", "Shortlisted");
        const results = [];

        for (const app of apps || []) {
            const { data: candidate } = await supabase
                .from("candidates")
                .select("candidate_name")
                .eq("id", app.candidate_id)
                .single();

            results.push({
                id: app.id,
                candidate_name:
                    candidate?.candidate_name || "Unknown",
                recruiter_status: app.recruiter_status,
            });
        }

        setApplications(results);
    };

    const scheduleInterview = async (applicationId: string) => {
        const appState = interviewStates[applicationId] || { date: "", time: "", link: "" };
        const dateVal = appState.date;
        const timeVal = appState.time;
        const linkVal = appState.link;

        if (!dateVal || !timeVal || !linkVal) {
            toast.error("Please fill in the Date, Time, and Google Meet Link for this candidate.");
            return;
        }

        const { error } = await supabase
            .from("interviews")
            .insert([
                {
                    application_id: applicationId,
                    interview_date: dateVal,
                    interview_time: timeVal,
                    meeting_link: linkVal,
                    status: "Scheduled",
                },
            ]);
        if (error) {
            toast.error(error.message);
            return;
        }

        await supabase
            .from("applications")
            .update({
                recruiter_status: "Interview Scheduled",
            })
            .eq("id", applicationId);

        toast.success("Interview Scheduled!");

        // Remove only this application's input state
        const updatedStates = { ...interviewStates };
        delete updatedStates[applicationId];
        setInterviewStates(updatedStates);

        fetchShortlistedCandidates();
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Interview Scheduling"
                    subtitle="Arrange and manage interviews for shortlisted candidates"
                />

                <SectionCard title="Shortlisted Candidates" subtitle="Enter scheduling info and generate interview meetings" noPadding>
                    {applications.length === 0 ? (
                        <EmptyState
                            title="No interviews to schedule"
                            description="There are currently no shortlisted candidates waiting for interview scheduling."
                            icon={CalendarDays}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50/75 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Meet Link</th>
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-bold text-slate-900">
                                                {app.candidate_name}
                                            </td>

                                            <td className="p-4">
                                                <StatusBadge status={app.recruiter_status} />
                                            </td>

                                            <td className="p-4">
                                                <input
                                                    type="date"
                                                    value={interviewStates[app.id]?.date || ""}
                                                    onChange={(e) =>
                                                        setInterviewStates({
                                                            ...interviewStates,
                                                            [app.id]: {
                                                                ...(interviewStates[app.id] || { date: "", time: "", link: "" }),
                                                                date: e.target.value,
                                                            },
                                                        })
                                                    }
                                                    aria-label={`Interview date for ${app.candidate_name}`}
                                                    className="border border-slate-200 p-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs"
                                                />
                                            </td>

                                            <td className="p-4">
                                                <input
                                                    type="time"
                                                    value={interviewStates[app.id]?.time || ""}
                                                    onChange={(e) =>
                                                        setInterviewStates({
                                                            ...interviewStates,
                                                            [app.id]: {
                                                                ...(interviewStates[app.id] || { date: "", time: "", link: "" }),
                                                                time: e.target.value,
                                                            },
                                                        })
                                                    }
                                                    aria-label={`Interview time for ${app.candidate_name}`}
                                                    className="border border-slate-200 p-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs"
                                                />
                                            </td>

                                            <td className="p-4">
                                                <input
                                                    type="text"
                                                    placeholder="Google Meet Link"
                                                    value={interviewStates[app.id]?.link || ""}
                                                    onChange={(e) =>
                                                        setInterviewStates({
                                                            ...interviewStates,
                                                            [app.id]: {
                                                                ...(interviewStates[app.id] || { date: "", time: "", link: "" }),
                                                                link: e.target.value,
                                                            },
                                                        })
                                                    }
                                                    aria-label={`Meeting link for ${app.candidate_name}`}
                                                    className="border border-slate-200 p-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs w-full max-w-[180px]"
                                                />
                                            </td>

                                            <td className="p-4">
                                                <button
                                                    onClick={() => scheduleInterview(app.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-xl transition-all shadow-sm hover:shadow shadow-emerald-600/10 cursor-pointer"
                                                >
                                                    Schedule
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>
            </div>
        </DashboardLayout>
    );
}
