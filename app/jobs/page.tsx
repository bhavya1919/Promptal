"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    salary_range: string;
    job_type: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setJobs(data || []);
        setLoading(false);

    };

    const handleApply = async (jobId: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login as a candidate");
            return;
        }

        const { data: candidate, error: candidateError } = await supabase
            .from("candidates")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (candidateError || !candidate) {
            alert("Please complete your candidate profile first");
            return;
        }

        const { error } = await supabase.from("applications").insert([
            {
                job_id: jobId,
                candidate_id: candidate.id,
                status: "Applied",
                match_score: 0,
            },
        ]);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        alert("Application Submitted Successfully!");

    };

    return (<div className="min-h-screen bg-slate-100 p-8"> <div className="max-w-6xl mx-auto"> <h1 className="text-4xl font-bold mb-8">
        Available Jobs </h1>

        {loading ? (
            <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
            <p>No jobs available.</p>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <h2 className="text-2xl font-semibold mb-3">
                            {job.title}
                        </h2>

                        <p className="mb-3">
                            {job.description}
                        </p>

                        <p className="mb-2">
                            <strong>Requirements:</strong>{" "}
                            {job.requirements}
                        </p>

                        <p className="mb-2">
                            <strong>Location:</strong>{" "}
                            {job.location}
                        </p>

                        <p className="mb-2">
                            <strong>Salary:</strong>{" "}
                            {job.salary_range}
                        </p>

                        <p className="mb-4">
                            <strong>Type:</strong>{" "}
                            {job.job_type}
                        </p>

                        <button
                            onClick={() => handleApply(job.id)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
    </div>

    );
}
