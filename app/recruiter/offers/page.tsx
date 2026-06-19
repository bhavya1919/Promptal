"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

interface InterviewCandidate {
    application_id: string;
    candidate_name: string;
    job_title: string;
}

import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function OffersPage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <OffersPageContent />
        </ProtectedRoute>
    );
}

function OffersPageContent() {
    const [candidates, setCandidates] = useState<InterviewCandidate[]>([]);

    useEffect(() => {
        fetchInterviewCandidates();
    }, []);

    const fetchInterviewCandidates = async () => {
        const { data: applications } = await supabase
            .from("applications")
            .select("*")
            .eq("recruiter_status", "Interview Scheduled");
        const results: InterviewCandidate[] = [];

        for (const app of applications || []) {
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

            results.push({
                application_id: app.id,
                candidate_name:
                    candidate?.candidate_name || "Unknown",
                job_title: job?.title || "Unknown",
            });
        }

        setCandidates(results);
    };

    const generateOffer = async (
        applicationId: string,
        candidateName: string,
        jobTitle: string
    ) => {
        const offerDate = new Date()
            .toISOString()
            .split("T")[0];

        const { error } = await supabase
            .from("offer_letters")
            .insert([
                {
                    application_id: applicationId,
                    candidate_name: candidateName,
                    job_title: jobTitle,
                    company_name: "Promtal Jobs",
                    offer_date: offerDate,
                    status: "Generated",
                },
            ]);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Offer Letter Generated!");

    };

    return (<DashboardLayout><div className="p-8"> <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
            Offer Letter Generation
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-100">
                    <tr>
                        <th className="p-4 text-left">
                            Candidate
                        </th>
                        <th className="p-4 text-left">
                            Job Title
                        </th>
                        <th className="p-4 text-left">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {candidates.map((candidate) => (
                        <tr
                            key={candidate.application_id}
                            className="border-b"
                        >
                            <td className="p-4">
                                {candidate.candidate_name}
                            </td>

                            <td className="p-4">
                                {candidate.job_title}
                            </td>

                            <td className="p-4">
                                <button
                                    onClick={() =>
                                        generateOffer(
                                            candidate.application_id,
                                            candidate.candidate_name,
                                            candidate.job_title
                                        )
                                    }
                                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                                >
                                    Generate Offer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>

    </div>
    </div>
    </DashboardLayout>
    );
}
