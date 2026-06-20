"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { generateOfferLetter } from "@/lib/generateofferletter";
import { generateExperienceLetter } from "@/lib/generateExperienceLetter";
import { generatePayslip } from "@/lib/generatePayslip";
import { 
    Briefcase, 
    Users, 
    UserCheck, 
    CalendarDays, 
    FileBadge,
    PlusCircle,
    FileText,
    TrendingUp,
    Activity,
    ChevronRight,
    ArrowUpRight,
    XCircle
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/StatusBadge";
import { SkeletonCard, SkeletonTable } from "@/components/ui/SkeletonCard";

interface ApplicationData {
    id: string;
    candidate_name: string;
    candidate_email: string;
    skills: string;
    job_title: string;
    requirements: string;
    recruiter_status: string;
    ai_score: number;
    created_at?: string;
}

interface JobData {
    id: string;
    title: string;
    location: string;
    status: string;
    created_at: string;
}

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecruiterDashboard() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboardContent />
        </ProtectedRoute>
    );
}

function RecruiterDashboardContent() {
    // Existing State
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState("corporate");
    
    // New Dashboard State
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        jobsPosted: 0,
        applicationsReceived: 0,
        shortlisted: 0,
        interviewsScheduled: 0,
        offersGenerated: 0
    });
    const [recentJobs, setRecentJobs] = useState<JobData[]>([]);
    const [kpis, setKpis] = useState({
        hiringSuccess: 0,
        interviewConversion: 0,
        offerConversion: 0
    });
    const [analytics, setAnalytics] = useState({
        shortlistRate: 0,
        interviewRate: 0,
        offerRate: 0,
        rejectionRate: 0
    });

    useEffect(() => {
        fetchDashboardData();
        // The existing fetchApplications is integrated into fetchDashboardData
    }, []);

    const calculateScore = (
        requirements: string,
        skills: string
    ) => {
        const reqSkills = requirements
            .toLowerCase()
            .split(/[,\s]+/)
            .filter(Boolean);

        const candidateSkills = skills
            .toLowerCase()
            .split(/[,\s]+/)
            .filter(Boolean);

        const matched = reqSkills.filter((skill) =>
            candidateSkills.includes(skill)
        );

        return reqSkills.length === 0
            ? 0
            : Math.round(
                (matched.length / reqSkills.length) * 100
            );
    };

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            // Fetch stats counts
            const { count: jobsCount } = await supabase.from("jobs").select("*", { count: "exact", head: true });
            const { count: appsCount } = await supabase.from("applications").select("*", { count: "exact", head: true });
            const { count: shortlistCount } = await supabase.from("applications").select("*", { count: "exact", head: true }).in("recruiter_status", ["Shortlisted", "Interview Scheduled", "Selected"]);
            const { count: interviewCount } = await supabase.from("interviews").select("*", { count: "exact", head: true });
            const { count: offersCount } = await supabase.from("offer_letters").select("*", { count: "exact", head: true });

            setStats({
                jobsPosted: jobsCount || 0,
                applicationsReceived: appsCount || 0,
                shortlisted: shortlistCount || 0,
                interviewsScheduled: interviewCount || 0,
                offersGenerated: offersCount || 0
            });

            // Calculate KPIs
            const intConv = appsCount ? Math.round(((interviewCount || 0) / appsCount) * 100) : 0;
            const offConv = interviewCount ? Math.round(((offersCount || 0) / interviewCount) * 100) : 0;
            const hireSuccess = appsCount ? Math.round(((offersCount || 0) / appsCount) * 100) : 0;
            
            setKpis({
                interviewConversion: intConv,
                offerConversion: offConv,
                hiringSuccess: hireSuccess
            });

            // Fetch Recent Jobs
            const { data: jobsData } = await supabase
                .from("jobs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);
            
            if (jobsData) {
                setRecentJobs(jobsData.map(j => ({
                    id: j.id,
                    title: j.title || "Unknown Job",
                    location: j.location || "Remote",
                    status: j.status || "Active",
                    created_at: j.created_at
                })));
            }

            // Existing logic to fetch applications
            const { data: applicationsData, error } = await supabase
                .from("applications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            const results: ApplicationData[] = [];

            for (const app of applicationsData || []) {
                const { data: candidate } = await supabase
                    .from("candidates")
                    .select("*")
                    .eq("id", app.candidate_id)
                    .single();

                const { data: userData } = await supabase
                    .from("users")
                    .select("email")
                    .eq("id", candidate?.user_id)
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

                // Update the score silently (existing functionality)
                await supabase
                    .from("applications")
                    .update({
                        ai_score: score,
                    })
                    .eq("id", app.id);

                results.push({
                    id: app.id,
                    candidate_name: candidate?.candidate_name || "Unknown",
                    candidate_email: userData?.email || "",
                    skills: candidate?.skills || "",
                    job_title: job?.title || "",
                    requirements: job?.requirements || "",
                    recruiter_status: app.recruiter_status || "Applied",
                    ai_score: score,
                    created_at: app.created_at
                });
            }

            setApplications(results);

            const totalApps = results.length;
            const shortlistedCount = results.filter(a => a.recruiter_status === "Shortlisted").length;
            const rejectedCount = results.filter(a => a.recruiter_status === "Rejected").length;
            const scheduledCount = results.filter(a => a.recruiter_status === "Interview Scheduled").length;

            setAnalytics({
                shortlistRate: totalApps ? Math.round((shortlistedCount / totalApps) * 100) : 0,
                interviewRate: totalApps ? Math.round((scheduledCount / totalApps) * 100) : 0,
                offerRate: totalApps ? Math.round(((offersCount || 0) / totalApps) * 100) : 0,
                rejectionRate: totalApps ? Math.round((rejectedCount / totalApps) * 100) : 0
            });

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        }

        setLoading(false);
    };

    const shortlistCandidate = async (
        applicationId: string,
        candidateName: string,
        candidateEmail: string
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

        await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: candidateEmail,
                candidateName,
            }),
        });

        toast.success("Candidate Shortlisted & Notification Sent");

        fetchDashboardData();
    };

    const handleGenerateOffer = (
        candidateName: string,
        jobTitle: string,
        companyName: string,
        template: string = "corporate"
    ) => {
        generateOfferLetter(
            candidateName,
            jobTitle,
            companyName,
            template
        );
    };

    const handleGenerateExperienceLetter = (
        candidateName: string,
        jobTitle: string,
        companyName: string
    ) => {
        generateExperienceLetter(
            candidateName,
            jobTitle,
            companyName
        );
    };

    const handleGeneratePayslip = (
        employeeName: string,
        designation: string
    ) => {
        generatePayslip(
            employeeName,
            designation
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="h-[360px] bg-slate-200 rounded-2xl animate-pulse"></div>
                        <div className="lg:col-span-2 space-y-6">
                            <SkeletonTable />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                
                {/* 1. Dashboard Header */}
                <PageHeader
                    title="Recruiter Dashboard"
                    subtitle="Manage hiring, applications, interviews and offers"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Link href="/recruiter/jobs/new" className="flex items-center gap-1.5 bg-emerald-600 dark:bg-green-700 dark:text-slate-50 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-600/10 cursor-pointer">
                                <PlusCircle className="w-4 h-4" /> Post Job
                            </Link>
                            <Link href="/recruiter/applications" className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer">
                                <FileText className="w-4 h-4 text-emerald-600 dark:text-green-400" /> View Applications
                            </Link>
                            <Link href="/recruiter/interviews" className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer">
                                <CalendarDays className="w-4 h-4 text-orange-500" /> Schedule Interviews
                            </Link>
                            <Link href="/recruiter/offers" className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer">
                                <FileBadge className="w-4 h-4 text-purple-500" /> Generate Offers
                            </Link>
                        </div>
                    }
                />

                {/* Welcome message badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-200/50 shadow-sm">
                    Welcome Back Recruiter 👋
                </div>

                {/* 2. Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard title="Jobs Posted" value={stats.jobsPosted} icon={Briefcase} color="blue" />
                    <StatCard title="Apps Received" value={stats.applicationsReceived} icon={Users} color="emerald" />
                    <StatCard title="Shortlisted" value={stats.shortlisted} icon={UserCheck} color="indigo" />
                    <StatCard title="Interviews" value={stats.interviewsScheduled} icon={CalendarDays} color="orange" />
                    <StatCard title="Offers" value={stats.offersGenerated} icon={FileBadge} color="purple" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Shortlist Rate" value={`${analytics.shortlistRate}%`} icon={UserCheck} color="emerald" />
                    <StatCard title="Interview Rate" value={`${analytics.interviewRate}%`} icon={CalendarDays} color="indigo" />
                    <StatCard title="Offer Rate" value={`${analytics.offerRate}%`} icon={FileBadge} color="purple" />
                    <StatCard title="Rejection Rate" value={`${analytics.rejectionRate}%`} icon={XCircle} color="rose" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 3. Hiring Funnel & KPIs */}
                    <div className="space-y-6">
                        <SectionCard title="Hiring Funnel" subtitle="Current status of applicants" className="h-full">
                            {/* Funnel Layout with Arrows */}
                            <div className="space-y-2">
                                {/* Application step */}
                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Applications</span>
                                    </div>
                                    <span className="font-extrabold text-blue-700 dark:text-blue-400 text-base">{stats.applicationsReceived}</span>
                                </div>
                                <div className="flex justify-center text-slate-300">↓</div>
                                {/* Shortlist step */}
                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">2</div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Shortlisted</span>
                                    </div>
                                    <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-base">{stats.shortlisted}</span>
                                </div>
                                <div className="flex justify-center text-slate-300">↓</div>
                                {/* Interview step */}
                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">3</div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Interviewed</span>
                                    </div>
                                    <span className="font-extrabold text-orange-700 dark:text-orange-400 text-base">{stats.interviewsScheduled}</span>
                                </div>
                                <div className="flex justify-center text-slate-300">↓</div>
                                {/* Offer step */}
                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">4</div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Offers</span>
                                    </div>
                                    <span className="font-extrabold text-purple-700 dark:text-purple-400 text-base">{stats.offersGenerated}</span>
                                </div>
                                <div className="flex justify-center text-slate-300">↓</div>
                                {/* Joined step */}
                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:text-green-400 flex items-center justify-center font-bold">5</div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Joined</span>
                                    </div>
                                    <span className="font-extrabold text-emerald-700 dark:text-green-400 text-base">{Math.max(0, stats.offersGenerated - 1)}</span>
                                </div>
                            </div>
                        </SectionCard>

                        {/* KPI Block */}
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-md dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] p-6 text-white relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500 rounded-full opacity-50 blur-xl"></div>
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                <TrendingUp className="w-5 h-5 text-emerald-200" /> Dashboard KPIs
                            </h2>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center border-b border-emerald-500/30 pb-3">
                                    <span className="text-emerald-50 font-medium">Interview Conversion</span>
                                    <span className="text-xl font-bold">{kpis.interviewConversion}%</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-500/30 pb-3">
                                    <span className="text-emerald-50 font-medium">Offer Conversion</span>
                                    <span className="text-xl font-bold">{kpis.offerConversion}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-50 font-medium">Overall Hiring Success</span>
                                    <span className="text-xl font-bold text-emerald-100">{kpis.hiringSuccess}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle & Right Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Activity */}
                        <SectionCard title="Recent Activity" subtitle="Updates from applicants">
                            {applications.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 italic text-center py-4">No recent activity.</p>
                            ) : (
                                <div className="space-y-5">
                                    {applications.slice(0, 4).map((app, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full mt-2 ${
                                                    app.recruiter_status === 'Applied' ? 'bg-blue-500' :
                                                    app.recruiter_status === 'Shortlisted' ? 'bg-indigo-500' :
                                                    app.recruiter_status === 'Interview Scheduled' ? 'bg-orange-500' :
                                                    'bg-emerald-500'
                                                }`}></div>
                                                {idx !== Math.min(applications.length, 4) - 1 && (
                                                    <div className="w-px h-full bg-slate-200 mt-2"></div>
                                                )}
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex-1 border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-100/50 transition-colors">
                                                <p className="text-sm text-slate-800 dark:text-slate-50">
                                                    <span className="font-bold text-slate-900 dark:text-slate-50">{app.candidate_name}</span> has been set to <span className="font-semibold text-emerald-600 dark:text-green-400">{app.recruiter_status}</span> for <span className="font-bold text-slate-900 dark:text-slate-50">{app.job_title}</span>
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-400 mt-1.5 font-medium">
                                                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* Recent Jobs */}
                        <SectionCard
                            title="Recent Jobs"
                            subtitle="Overview of open roles"
                            actions={
                                <Link href="/jobs" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 flex items-center gap-0.5">
                                    View All <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            }
                            noPadding
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50/75 dark:bg-slate-800/75 border-b border-slate-100 dark:border-slate-700">
                                        <tr>
                                            <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Title</th>
                                            <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                                            <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentJobs.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-slate-500 dark:text-slate-400">No jobs posted yet.</td>
                                            </tr>
                                        ) : (
                                            recentJobs.map((job) => (
                                                <tr key={job.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-50">{job.title}</td>
                                                    <td className="p-4 text-slate-600 dark:text-slate-300">{job.location}</td>
                                                    <td className="p-4">
                                                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 dark:text-green-400 text-xs font-bold rounded-full border border-emerald-200/50">
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>

                        {/* Recruitment Analytics Panel */}
                        <SectionCard title="Recruitment Analytics" subtitle="Hiring conversion metrics">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="font-semibold text-slate-700 dark:text-slate-50 text-sm">Applications Received</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-50">{stats.applicationsReceived}</span>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-50">Shortlist Rate</span>
                                        <span className="font-bold text-emerald-600 dark:text-green-400">{analytics.shortlistRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics.shortlistRate}%` }} />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-50">Interview Rate</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{analytics.interviewRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics.interviewRate}%` }} />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-50">Offer Rate</span>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">{analytics.offerRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics.offerRate}%` }} />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-50">Rejection Rate</span>
                                        <span className="font-bold text-red-600 dark:text-red-400">{analytics.rejectionRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics.rejectionRate}%` }} />
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Applications management */}
                        <SectionCard title="All Applications" subtitle="Track candidate AI matching scores and progress" noPadding>
                            {applications.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 italic text-center p-8">No applications yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50/75 dark:bg-slate-800/75 border-b border-slate-100 dark:border-slate-700">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Score</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {applications.map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="p-4 font-bold text-slate-900 dark:text-slate-50">{app.candidate_name}</td>
                                                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={app.skills}>{app.skills}</td>
                                                    <td className="p-4 text-slate-700 dark:text-slate-50 font-medium">{app.job_title}</td>
                                                    <td className="p-4">
                                                        <span className={`font-extrabold text-sm ${app.ai_score >= 80 ? "text-emerald-600" : app.ai_score >= 50 ? "text-amber-500" : "text-slate-400"}`}>
                                                            {app.ai_score}%
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <StatusBadge status={app.recruiter_status} />
                                                    </td>
                                                    <td className="p-4">
                                                        {app.recruiter_status === "Shortlisted" ? (
                                                            <span className="text-emerald-600 dark:text-green-400 font-semibold text-xs flex items-center gap-1">
                                                                <UserCheck className="w-3.5 h-3.5" /> Shortlisted
                                                            </span>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => shortlistCandidate(app.id, app.candidate_name, app.candidate_email)}
                                                                    className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-xl transition-all shadow-sm hover:shadow shadow-emerald-600/10 cursor-pointer h-fit"
                                                                >
                                                                    Shortlist
                                                                </button>
                                                                
                                                                <div className="flex flex-col gap-1">
                                                                    <select
                                                                        value={selectedTemplate}
                                                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                                                        className="text-xs border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-600 dark:text-slate-300 outline-none focus:border-purple-400 bg-white dark:bg-slate-800"
                                                                    >
                                                                        <option value="corporate">Corporate</option>
                                                                        <option value="modern">Modern</option>
                                                                        <option value="minimal">Minimal</option>
                                                                    </select>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleGenerateOffer(
                                                                                app.candidate_name,
                                                                                app.job_title,
                                                                                "Promtal Jobs",
                                                                                selectedTemplate
                                                                            )
                                                                        }
                                                                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-xl transition-all shadow-sm hover:shadow shadow-purple-600/10 cursor-pointer"
                                                                    >
                                                                        Generate Offer
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleGenerateExperienceLetter(
                                                                            app.candidate_name,
                                                                            app.job_title,
                                                                            "Promtal Jobs"
                                                                        )
                                                                    }
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-xl transition-all shadow-sm hover:shadow shadow-blue-600/10 cursor-pointer"
                                                                >
                                                                    Experience Letter
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleGeneratePayslip(
                                                                            app.candidate_name,
                                                                            app.job_title
                                                                        )
                                                                    }
                                                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded-xl transition-all shadow-sm hover:shadow shadow-orange-600/10 cursor-pointer"
                                                                >
                                                                    Payslip
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}