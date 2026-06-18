"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, Briefcase, FileText, Users, MapPin, Globe, DollarSign, ListPlus, Send } from "lucide-react";

export default function RecruiterDashboard() {
    // Company States
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");

    // Job States
    const [title, setTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [jobType, setJobType] = useState("");

    // Save Company
    const handleSaveCompany = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login first");
            return;
        }

        const { error } = await supabase.from("companies").insert([
            {
                recruiter_id: user.id,
                company_name: companyName,
                description,
                location,
                website,
            },
        ]);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        alert("Company Profile Saved!");

        setCompanyName("");
        setDescription("");
        setLocation("");
        setWebsite("");
    };

    // Post Job
    const handlePostJob = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login first");
            return;
        }

        const { error } = await supabase.from("jobs").insert([
            {
                recruiter_id: user.id,
                title,
                description: jobDescription,
                requirements,
                location: jobLocation,
                salary_range: salaryRange,
                job_type: jobType,
            },
        ]);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        alert("Job Posted Successfully!");

        setTitle("");
        setJobDescription("");
        setRequirements("");
        setJobLocation("");
        setSalaryRange("");
        setJobType("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your company profile and job postings</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Jobs Posted</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Applications</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Candidates Viewed</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Company Profile Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Company Profile
                            </h2>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Acme Corp"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    placeholder="Tell candidates about your company..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="City, Country"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveCompany}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 font-medium transition-all flex justify-center items-center gap-2 mt-4"
                            >
                                <Building2 className="w-4 h-4" />
                                Save Company Profile
                            </button>
                        </div>
                    </div>

                    {/* Post Job Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <ListPlus className="w-5 h-5 text-emerald-600" />
                                Post a New Job
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Job Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-slate-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Job Description</label>
                                <textarea
                                    placeholder="Describe the responsibilities and role..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Requirements</label>
                                <textarea
                                    placeholder="Required skills, experience (e.g. React, Next.js, 5+ years)"
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[80px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Remote, NYC, etc."
                                            value={jobLocation}
                                            onChange={(e) => setJobLocation(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Salary Range</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="$80k - $120k"
                                            value={salaryRange}
                                            onChange={(e) => setSalaryRange(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Job Type</label>
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="w-full border border-slate-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                >
                                    <option value="">Select Job Type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>

                            <button
                                onClick={handlePostJob}
                                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all flex justify-center items-center gap-2 mt-4"
                            >
                                <Send className="w-4 h-4" />
                                Publish Job Post
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
