"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Briefcase, 
    CalendarDays, 
    FileBadge, 
    TrendingUp, 
    User, 
    Pencil, 
    X,
    ExternalLink,
    FileText
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function CandidateDashboard() {
    return (
        <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateDashboardContent />
        </ProtectedRoute>
    );
}

function CandidateDashboardContent() {
    // Existing states
    const [candidateName, setCandidateName] = useState("");
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // New states
    const [loading, setLoading] = useState(true);
    const [candidateProfile, setCandidateProfile] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [parsing, setParsing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            setLoading(false);
            return;
        }

        // Fetch candidate profile
        const { data: candidate } = await supabase
            .from("candidates")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (candidate) {
            setCandidateProfile(candidate);
            setCandidateName(candidate.candidate_name || "");
            setSkills(candidate.skills || "");
            setEducation(candidate.education || "");
            setExperience(candidate.experience || "");
            setResumeUrl(candidate.resume_url || "");

            // Fetch applications
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
                // Map to flatten structure and avoid typescript errors when accessing joined tables
                const mappedApps = apps.map((app: any) => ({
                    ...app,
                    job_title: app.jobs?.title || "Unknown Job"
                }));
                setApplications(mappedApps);

                const appIds = mappedApps.map(a => a.id);

                if (appIds.length > 0) {
                    // Fetch interviews
                    const { data: inters } = await supabase
                        .from("interviews")
                        .select("*")
                        .in("application_id", appIds);
                    
                    if (inters) setInterviews(inters);

                    // Fetch offers
                    const { data: offs } = await supabase
                        .from("offer_letters")
                        .select("*")
                        .in("application_id", appIds);
                    
                    if (offs) setOffers(offs);
                }
            }
        }
        
        setLoading(false);
    };

    const uploadResume = async () => {
        if (!resumeFile) return null;

        const fileName = `${Date.now()}-${resumeFile.name}`;

        const { error } = await supabase.storage
            .from("resumes")
            .upload(fileName, resumeFile);

        if (error) {
            console.error("Storage upload error:", error);
            throw error;
        }

        const {
            data: { publicUrl },
        } = supabase.storage
            .from("resumes")
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const parseResume = async () => {
        if (!resumeFile) {
            toast.error("Upload a PDF first");
            return;
        }

        try {
            setParsing(true);

            const pdfjsLib = await import("pdfjs-dist");
            await import("pdfjs-dist/build/pdf.worker.min.mjs");

            const fileBuffer = await resumeFile.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({
                data: fileBuffer,
            }).promise;

            let text = "";

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();

                text += content.items
                    .map((item: any) => item.str)
                    .join(" ");
            }

            console.log("Resume Text:", text);

            const skillsMatch = text.match(/skills[:\-](.*?)(education|experience|$)/i);
            const educationMatch = text.match(/education[:\-](.*?)(experience|skills|$)/i);
            const experienceMatch = text.match(/experience[:\-](.*?)(education|skills|$)/i);

            if (skillsMatch) {
                setSkills(skillsMatch[1].trim());
            }

            if (educationMatch) {
                setEducation(educationMatch[1].trim());
            }

            if (experienceMatch) {
                setExperience(experienceMatch[1].trim());
            }

            toast.success("Resume parsed successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to parse resume");
        } finally {
            setParsing(false);
        }
    };

    const handleSaveProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Please login first");
            return;
        }

        let uploadedResumeUrl = null;
        try {
            uploadedResumeUrl = await uploadResume();
        } catch (uploadErr: any) {
            toast.error(uploadErr.message || "Failed to upload resume to Storage.");
            return;
        }
        
        const finalResumeUrl = uploadedResumeUrl || resumeUrl;

        let error;
        if (candidateProfile) {
            // Update if exists
            const { error: updateError } = await supabase
                .from("candidates")
                .update({
                    candidate_name: candidateName,
                    skills,
                    education,
                    experience,
                    resume_url: finalResumeUrl,
                })
                .eq("id", candidateProfile.id);
            error = updateError;
        } else {
            // Insert if new (existing functionality)
            const { error: insertError } = await supabase
                .from("candidates")
                .insert([
                    {
                        user_id: user.id,
                        candidate_name: candidateName,
                        skills,
                        education,
                        experience,
                        resume_url: finalResumeUrl,
                    },
                ]);
            error = insertError;
        }

        if (error) {
            console.error(error);
            toast.error(error.message);
            return;
        }

        toast.success("Profile Saved Successfully!");
        setIsEditing(false);
        fetchDashboardData();
    };

    const calculateCompletion = () => {
        let score = 0;
        if (candidateName) score += 20;
        if (skills) score += 20;
        if (education) score += 20;
        if (experience) score += 20;
        if (resumeUrl) score += 20;
        return score;
    };

    const completionPercentage = calculateCompletion();

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
        switch (status) {
            case "Applied":
                return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>{status}</span>;
            case "Shortlisted":
                return <span className={`${baseClasses} bg-emerald-100 text-emerald-700`}>{status}</span>;
            case "Interview Scheduled":
                return <span className={`${baseClasses} bg-orange-100 text-orange-700`}>{status}</span>;
            case "Selected":
                return <span className={`${baseClasses} bg-green-100 text-green-700`}>{status}</span>;
            case "Rejected":
                return <span className={`${baseClasses} bg-red-100 text-red-700`}>{status}</span>;
            default:
                return <span className={`${baseClasses} bg-slate-100 text-slate-700`}>{status || "Applied"}</span>;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-10"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
                    </div>
                    <div className="h-64 bg-slate-200 rounded-xl mb-10"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="max-w-7xl mx-auto space-y-10">
                    
                    {/* Header Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Candidate Dashboard</h1>
                        <p className="text-slate-500">Manage your profile, applications, interviews and offers</p>
                        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-emerald-800">
                                Welcome back, {candidateProfile?.candidate_name || "Candidate"}!
                            </h2>
                            <p className="text-emerald-600 mt-1">Here is a summary of your recruitment journey.</p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-3xl font-bold text-slate-800">{applications.length}</span>
                            </div>
                            <h3 className="text-slate-500 font-medium">Applications Applied</h3>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <CalendarDays className="w-6 h-6 text-orange-600" />
                                </div>
                                <span className="text-3xl font-bold text-slate-800">{interviews.length}</span>
                            </div>
                            <h3 className="text-slate-500 font-medium">Interviews Scheduled</h3>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <FileBadge className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-3xl font-bold text-slate-800">{offers.length}</span>
                            </div>
                            <h3 className="text-slate-500 font-medium">Offers Received</h3>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-3xl font-bold text-slate-800">{completionPercentage}%</span>
                            </div>
                            <h3 className="text-slate-500 font-medium">Profile Completion</h3>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Profile Overview */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2 rounded-lg text-white shadow-md shadow-emerald-200">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Profile Overview</h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>

                        <div className="p-6">
                            {isEditing ? (
                                <div className="grid grid-cols-1 gap-6 max-w-3xl">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Candidate Name</label>
                                        <input
                                            type="text"
                                            value={candidateName}
                                            onChange={(e) => setCandidateName(e.target.value)}
                                            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                                        <textarea
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-24"
                                            placeholder="React, TypeScript, Node.js"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                                        <textarea
                                            value={education}
                                            onChange={(e) => setEducation(e.target.value)}
                                            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-24"
                                            placeholder="B.Sc. in Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                                        <textarea
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-24"
                                            placeholder="3 years at TechCorp"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) =>
                                                setResumeFile(e.target.files?.[0] || null)
                                            }
                                            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                        {resumeFile && (
                                            <p className="text-sm text-emerald-600 mt-2 font-medium">
                                                Selected: {resumeFile.name}
                                            </p>
                                        )}
                                        {resumeUrl && !resumeFile && (
                                            <p className="text-sm text-slate-500 mt-2">
                                                Current resume on file
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={parseResume}
                                            disabled={parsing || !resumeFile}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-3 text-sm font-semibold shadow hover:bg-purple-700 disabled:opacity-50 transition-all"
                                        >
                                            {parsing ? "Parsing..." : "Parse Resume"}
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                                        >
                                            Save Profile Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</h3>
                                        <p className="text-lg font-semibold text-slate-800">{candidateProfile?.candidate_name || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Resume Link</h3>
                                        {candidateProfile?.resume_url ? (
                                            <a href={candidateProfile.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
                                                <ExternalLink className="w-4 h-4" />
                                                View Resume
                                            </a>
                                        ) : (
                                            <p className="text-slate-400 italic">Not specified</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Skills</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {candidateProfile?.skills ? candidateProfile.skills.split(',').map((skill: string, idx: number) => (
                                                <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {skill.trim()}
                                                </span>
                                            )) : <p className="text-slate-400 italic">Not specified</p>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Experience</h3>
                                        <p className="text-slate-700 whitespace-pre-wrap">{candidateProfile?.experience || <span className="text-slate-400 italic">Not specified</span>}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Education</h3>
                                        <p className="text-slate-700 whitespace-pre-wrap">{candidateProfile?.education || <span className="text-slate-400 italic">Not specified</span>}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Applications Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-emerald-600" />
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
                                                <th className="text-left p-4 text-sm font-semibold text-slate-600">AI Match Score</th>
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
                                                        <span className={`font-bold ${app.ai_score >= 80 ? "text-emerald-600" : app.ai_score >= 50 ? "text-orange-500" : "text-slate-500"}`}>
                                                            {app.ai_score ? `${app.ai_score}%` : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {getStatusBadge(app.recruiter_status || "Applied")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interviews Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <CalendarDays className="w-6 h-6 text-emerald-600" />
                            Scheduled Interviews
                        </h2>
                        {interviews.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-12 text-center border border-slate-100 flex flex-col items-center">
                                <div className="bg-slate-50 p-4 rounded-full mb-4">
                                    <CalendarDays className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No Interviews Scheduled</h3>
                                <p className="text-slate-500">When recruiters schedule an interview, it will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {interviews.map((interview) => (
                                    <div key={interview.id} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-orange-50 p-2 rounded-lg">
                                                <CalendarDays className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                {interview.status || "Scheduled"}
                                            </span>
                                        </div>
                                        <div className="space-y-3 flex-grow">
                                            <div>
                                                <p className="text-sm text-slate-500">Date & Time</p>
                                                <p className="font-semibold text-slate-800">
                                                    {interview.interview_date} at {interview.interview_time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-100">
                                            {interview.meeting_link ? (
                                                <a 
                                                    href={interview.meeting_link} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Join Interview
                                                </a>
                                            ) : (
                                                <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                                                    Link Not Available
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Offer Letters Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FileBadge className="w-6 h-6 text-emerald-600" />
                            Offer Letters
                        </h2>
                        {offers.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-12 text-center border border-slate-100 flex flex-col items-center">
                                <div className="bg-slate-50 p-4 rounded-full mb-4">
                                    <FileBadge className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No Offers Available</h3>
                                <p className="text-slate-500">Your future offer letters will be displayed securely right here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offers.map((offer) => (
                                    <div key={offer.id} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-full -z-10"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-purple-100 p-3 rounded-xl">
                                                <FileBadge className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                {offer.status || "Generated"}
                                            </span>
                                        </div>
                                        <div className="space-y-1 flex-grow mb-6">
                                            <h3 className="text-lg font-bold text-slate-800">{offer.job_title}</h3>
                                            <p className="text-slate-600 font-medium">{offer.company_name}</p>
                                            <p className="text-sm text-slate-500 pt-2">Offer Date: {offer.offer_date}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedOffer(offer)}
                                            className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md shadow-slate-200"
                                        >
                                            View Offer Letter
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Offer Modal */}
            {selectedOffer && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                    <FileBadge className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Official Offer Letter</h3>
                                    <p className="text-sm text-slate-500">{selectedOffer.company_name}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedOffer(null)}
                                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 font-serif leading-relaxed text-slate-800 space-y-6">
                            <p>Dear {selectedOffer.candidate_name},</p>
                            
                            <p>We are pleased to offer you the position of <strong>{selectedOffer.job_title}</strong> at <strong>{selectedOffer.company_name}</strong>.</p>
                            
                            <p>Congratulations and welcome aboard. We are excited about the prospect of you joining our team and look forward to a mutually rewarding relationship.</p>
                            
                            <div className="pt-8">
                                <p className="mb-1">Sincerely,</p>
                                <p className="font-bold text-emerald-700">HR Team</p>
                                <p className="text-sm text-slate-500">{selectedOffer.company_name}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedOffer(null)}
                                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                                Accept Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
