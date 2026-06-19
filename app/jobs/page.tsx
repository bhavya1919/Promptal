"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Briefcase, DollarSign, Clock, Building2, Send } from "lucide-react";

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    salary_range: string;
    job_type: string;
}

import { toast } from "react-hot-toast";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        // Apply filters
        let result = jobs;

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(job => 
                job.title.toLowerCase().includes(lowerSearch) || 
                job.description.toLowerCase().includes(lowerSearch) ||
                job.requirements.toLowerCase().includes(lowerSearch)
            );
        }

        if (locationFilter) {
            const lowerLoc = locationFilter.toLowerCase();
            result = result.filter(job => job.location.toLowerCase().includes(lowerLoc));
        }

        if (typeFilter) {
            result = result.filter(job => job.job_type === typeFilter);
        }

        setFilteredJobs(result);
    }, [searchTerm, locationFilter, typeFilter, jobs]);

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
        setFilteredJobs(data || []);
        setLoading(false);
    };

    const handleApply = async (jobId: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Please login as a candidate");
            return;
        }

        const { data: candidate, error: candidateError } = await supabase
            .from("candidates")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (candidateError || !candidate) {
            toast.error("Please complete your candidate profile first");
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
            toast.error(error.message);
            return;
        }

        toast.success("Application Submitted Successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Find your next <span className="text-emerald-600">dream role</span>
                    </h1>
                    <p className="text-lg text-slate-500">
                        Discover thousands of job opportunities with top companies.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                        <label htmlFor="search-jobs" className="sr-only">Search Jobs</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                id="search-jobs"
                                type="text"
                                placeholder="Job title, keywords, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="md:w-64 space-y-1">
                        <label htmlFor="location-filter" className="sr-only">Filter by Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                id="location-filter"
                                type="text"
                                placeholder="Location filter..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="md:w-48 space-y-1">
                        <label htmlFor="type-filter" className="sr-only">Filter by Job Type</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                id="type-filter"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Types</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Job Listings */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">No jobs found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col h-full"
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                {job.title}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                                                <Building2 className="w-4 h-4" />
                                                <span>Promtal Partner</span>
                                            </div>
                                        </div>
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold rounded-full border border-emerald-100 whitespace-nowrap">
                                            {job.job_type}
                                        </span>
                                    </div>

                                    <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                            {job.salary_range}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Recently posted
                                    </span>
                                    <button
                                        onClick={() => handleApply(job.id)}
                                        className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all flex items-center gap-2 text-sm"
                                    >
                                        Apply Now
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
