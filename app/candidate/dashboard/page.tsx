"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserCircle, GraduationCap, Briefcase, Link as LinkIcon, BadgeCheck, Save } from "lucide-react";

export default function CandidateDashboard() {
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [completion, setCompletion] = useState(0);

    // Calculate profile completion
    useEffect(() => {
        let score = 0;
        if (skills.trim()) score += 25;
        if (education.trim()) score += 25;
        if (experience.trim()) score += 25;
        if (resumeUrl.trim()) score += 25;
        setCompletion(score);
    }, [skills, education, experience, resumeUrl]);

    const handleSaveProfile = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        
        if (!user) {
            alert("Please login first");
            return;
        }

        const { error } = await supabase.from("candidates").insert([
            {
                user_id: user.id,
                skills,
                education,
                experience,
                resume_url: resumeUrl,
            },
        ]);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        alert("Profile Saved Successfully!");
        setSkills("");
        setEducation("");
        setExperience("");
        setResumeUrl("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Candidate Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your professional profile and resume</p>
                    </div>
                    
                    {/* Completion Badge */}
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1 w-32">
                                <span className="text-xs font-medium text-slate-700">Completion</span>
                                <span className="text-xs font-bold text-emerald-600">{completion}%</span>
                            </div>
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                        </div>
                        {completion === 100 && (
                            <BadgeCheck className="w-6 h-6 text-emerald-500" />
                        )}
                    </div>
                </div>

                {/* Profile Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <UserCircle className="w-5 h-5 text-emerald-600" />
                            Profile Details
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                Professional Skills
                            </label>
                            <textarea
                                placeholder="e.g. Python, SQL, React, Data Analysis"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-slate-400" />
                                Education History
                            </label>
                            <textarea
                                placeholder="University, Degree, Graduation Year"
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                Work Experience
                            </label>
                            <textarea
                                placeholder="Previous roles, companies, and achievements"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-slate-400" />
                                Resume URL
                            </label>
                            <input
                                type="url"
                                placeholder="Link to your portfolio or Google Drive resume"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={handleSaveProfile}
                                className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
