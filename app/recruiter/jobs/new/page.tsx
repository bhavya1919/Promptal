"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, Send, Briefcase, MapPin, DollarSign, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <NewJobPageContent />
        </ProtectedRoute>
    );
}

function NewJobPageContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [location, setLocation] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [jobType, setJobType] = useState("Full Time");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !requirements.trim() || !location.trim() || !salaryRange.trim()) {
            toast.error("Please fill in all the fields.");
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase
                .from("jobs")
                .insert([
                    {
                        title: title.trim(),
                        description: description.trim(),
                        requirements: requirements.trim(), // Comma-separated
                        location: location.trim(),
                        salary_range: salaryRange.trim(),
                        job_type: jobType,
                    }
                ]);

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Job Posted Successfully!");
            router.push("/recruiter/dashboard");
        } catch (err) {
            console.error("Error posting job:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Back Link */}
                <div className="flex items-center gap-2">
                    <Link 
                        href="/recruiter/dashboard"
                        className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 text-sm font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <PageHeader 
                    title="Post a New Job Opening"
                    subtitle="Create a new requisition to recruit top candidates via our AI-matching engine"
                />

                <SectionCard title="Job Specifications" subtitle="Provide the role details and criteria">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="job-title" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Job Title
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="job-title"
                                        type="text"
                                        required
                                        placeholder="e.g., Senior Full-Stack Engineer"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="space-y-1.5">
                                <label htmlFor="job-type" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Job Type
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <select
                                        id="job-type"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all appearance-none bg-white dark:bg-slate-800 cursor-pointer"
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-1.5">
                                <label htmlFor="location" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="location"
                                        type="text"
                                        required
                                        placeholder="e.g., Remote / San Francisco, CA"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div className="space-y-1.5">
                                <label htmlFor="salary" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Salary Range
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="salary"
                                        type="text"
                                        required
                                        placeholder="e.g., $120,000 - $150,000"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={salaryRange}
                                        onChange={(e) => setSalaryRange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Required Skills (Comma-separated) */}
                            <div className="space-y-1.5">
                                <label htmlFor="requirements" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Required Skills (comma-separated)
                                </label>
                                <div className="relative">
                                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="requirements"
                                        type="text"
                                        required
                                        placeholder="e.g., React, TypeScript, Node.js"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="description" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Role Description
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-4 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <textarea
                                        id="description"
                                        required
                                        rows={6}
                                        placeholder="Outline the responsibilities, project scope, and team expectations..."
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link 
                                href="/recruiter/dashboard"
                                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-50 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] hover:shadow-lg shadow-emerald-600/10 focus:ring-4 focus:ring-emerald-500/20 flex items-center gap-2 disabled:opacity-75 text-sm cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Publishing Job...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Publish Requisition
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>
        </DashboardLayout>
    );
}
