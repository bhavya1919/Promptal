"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { Users, Building2, Briefcase, UserCheck, FileText, CalendarDays, FileBadge } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}

function AdminDashboardContent() {
    const [selectedView, setSelectedView] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [users, setUsers] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);

    const [stats, setStats] = useState({
        users: 0,
        companies: 0,
        jobs: 0,
        candidates: 0,
        applications: 0,
        interviews: 0,
        offers: 0,
    });

    useEffect(() => {
        fetchStats();
        loadAdminData();
    }, []);

    const openPanel = (view: string) => {
        setSelectedView(view);
        setSearchTerm(""); // Reset search term on panel open
        setDrawerOpen(true);
    };

    const fetchStats = async () => {
        const { count: users } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true });

        const { count: companies } = await supabase
            .from("companies")
            .select("*", { count: "exact", head: true });

        const { count: jobs } = await supabase
            .from("jobs")
            .select("*", { count: "exact", head: true });

        const { count: candidates } = await supabase
            .from("candidates")
            .select("*", { count: "exact", head: true });

        const { count: applications } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true });

        const { count: interviews } = await supabase
            .from("interviews")
            .select("*", { count: "exact", head: true });

        const { count: offers } = await supabase
            .from("offer_letters")
            .select("*", { count: "exact", head: true });

        setStats({
            users: users || 0,
            companies: companies || 0,
            jobs: jobs || 0,
            candidates: candidates || 0,
            applications: applications || 0,
            interviews: interviews || 0,
            offers: offers || 0,
        });

    };

    const loadAdminData = async () => {
        const { data: usersData } = await supabase.from("users").select("*");
        const { data: companiesData } = await supabase.from("companies").select("*");
        const { data: jobsData } = await supabase.from("jobs").select("*");
        const { data: applicationsData } = await supabase.from("applications").select("*");
        const { data: interviewsData } = await supabase.from("interviews").select("*");
        const { data: offersData } = await supabase.from("offer_letters").select("*");

        setUsers(usersData || []);
        setCompanies(companiesData || []);
        setJobs(jobsData || []);
        setApplications(applicationsData || []);
        setInterviews(interviewsData || []);
        setOffers(offersData || []);
    };

    const filteredCompanies = companies.filter(c => c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredJobs = jobs.filter(j => j.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredApplications = applications.filter(a => a.recruiter_status?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredInterviews = interviews.filter(i => i.status?.toLowerCase().includes(searchTerm.toLowerCase()) || i.interview_date?.includes(searchTerm));
    const filteredOffers = offers.filter(o => o.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) || o.job_title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Admin Dashboard"
                    subtitle="Overview of system-wide metrics and resource registration counts"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => openPanel("users")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Total Users" value={stats.users} icon={Users} color="emerald" />
                    </div>
                    <div onClick={() => openPanel("companies")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Companies Registered" value={stats.companies} icon={Building2} color="blue" />
                    </div>
                    <div onClick={() => openPanel("jobs")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Jobs Posted" value={stats.jobs} icon={Briefcase} color="indigo" />
                    </div>
                    <div onClick={() => openPanel("candidates")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Candidates Registered" value={stats.candidates} icon={UserCheck} color="rose" />
                    </div>
                    <div onClick={() => openPanel("applications")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Applications Received" value={stats.applications} icon={FileText} color="purple" />
                    </div>
                    <div onClick={() => openPanel("interviews")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Interviews Scheduled" value={stats.interviews} icon={CalendarDays} color="orange" />
                    </div>
                    <div onClick={() => openPanel("offers")} className="cursor-pointer hover:scale-105 transition-all duration-300">
                        <StatCard title="Offer Letters Generated" value={stats.offers} icon={FileBadge} color="indigo" />
                    </div>
                </div>
            </div>

            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 transition-opacity"
                    onClick={() => setDrawerOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-[500px] bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {selectedView.toUpperCase()}
                        </h2>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-lg p-3 mt-4 mb-6"
                        />

                        {selectedView === "companies" && (
                            filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
                                <div key={company.id} className="border rounded-lg p-4 mb-3">
                                    <h3 className="font-bold">{company.company_name}</h3>
                                    <p>{company.location}</p>
                                    <p>{company.website}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No companies found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "users" && (
                            filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <div key={user.id} className="border rounded-lg p-4 mb-3">
                                    <h3 className="font-bold">{user.name}</h3>
                                    <p>{user.email}</p>
                                    <p>{user.role}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No users found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "jobs" && (
                            filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <div key={job.id} className="border rounded-lg p-4 mb-3">
                                    <h3 className="font-bold">{job.title}</h3>
                                    <p>{job.location}</p>
                                    <p>{job.job_type}</p>
                                    <p>{job.salary_range}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No jobs found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "applications" && (
                            filteredApplications.length > 0 ? filteredApplications.map((app) => (
                                <div key={app.id} className="border rounded-lg p-4 mb-3">
                                    <p>Status: {app.recruiter_status}</p>
                                    <p>AI Score: {app.ai_score}%</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No applications found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "interviews" && (
                            filteredInterviews.length > 0 ? filteredInterviews.map((interview) => (
                                <div key={interview.id} className="border rounded-lg p-4 mb-3">
                                    <p>{interview.interview_date}</p>
                                    <p>{interview.interview_time}</p>
                                    {interview.meeting_link && (
                                        <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                            Join Meeting
                                        </a>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No interviews found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "offers" && (
                            filteredOffers.length > 0 ? filteredOffers.map((offer) => (
                                <div key={offer.id} className="border rounded-lg p-4 mb-3">
                                    <h3 className="font-bold">{offer.candidate_name}</h3>
                                    <p>{offer.job_title}</p>
                                    <p>{offer.company_name}</p>
                                    <p>{offer.status}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                                    <p className="text-slate-500 font-medium">No offer letters found.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
