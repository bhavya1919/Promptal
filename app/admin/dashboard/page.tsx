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
    const [candidates, setCandidates] = useState<any[]>([]);

    const [educationStats, setEducationStats] = useState<Record<string, number>>({});
    const [experienceStats, setExperienceStats] = useState<Record<string, number>>({});

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
        const { data: candidatesData } = await supabase.from("candidates").select("*");

        setUsers(usersData || []);
        setCompanies(companiesData || []);
        setJobs(jobsData || []);
        setApplications(applicationsData || []);
        setInterviews(interviewsData || []);
        setOffers(offersData || []);
        setCandidates(candidatesData || []);

        const educationCount: Record<string, number> = {};
        (candidatesData || []).forEach((candidate: any) => {
            const education = candidate.education || "Unknown";
            educationCount[education] = (educationCount[education] || 0) + 1;
        });
        setEducationStats(educationCount);

        const experienceCount: Record<string, number> = {};
        (candidatesData || []).forEach((candidate: any) => {
            const experience = candidate.experience || "Unknown";
            experienceCount[experience] = (experienceCount[experience] || 0) + 1;
        });
        setExperienceStats(experienceCount);

        setExperienceStats(experienceCount);
    };

    const filteredCompanies = companies.filter(c => c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredJobs = jobs.filter(j => j.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredApplications = applications.filter(a => {
        const candidate = candidates.find(c => c.id === a.candidate_id);
        const job = jobs.find(j => j.id === a.job_id);
        const search = searchTerm.toLowerCase();
        return (
            a.recruiter_status?.toLowerCase().includes(search) || 
            candidate?.candidate_name?.toLowerCase().includes(search) || 
            job?.title?.toLowerCase().includes(search)
        );
    });
    const filteredInterviews = interviews.filter(i => {
        const app = applications.find(a => a.id === i.application_id);
        const candidate = candidates.find(c => c.id === app?.candidate_id);
        const search = searchTerm.toLowerCase();
        return (
            i.status?.toLowerCase().includes(search) || 
            i.interview_date?.includes(search) ||
            candidate?.candidate_name?.toLowerCase().includes(search)
        );
    });
    const filteredOffers = offers.filter(o => o.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) || o.job_title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredCandidates = candidates.filter(c => c.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills?.toLowerCase().includes(searchTerm.toLowerCase()));

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

                <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-50">
                        Diversity Reporting
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-slate-50 dark:bg-slate-900">
                            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-50 uppercase tracking-wider text-sm">
                                Education Distribution
                            </h3>

                            {Object.entries(educationStats).map(([education, count]) => (
                                <div key={education} className="mb-4">
                                    <div className="flex justify-between text-sm mb-1.5 font-medium text-slate-600 dark:text-slate-300">
                                        <span>{education}</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-50">{count}</span>
                                    </div>

                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(count / (candidates.length || 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-slate-50 dark:bg-slate-900">
                            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-50 uppercase tracking-wider text-sm">
                                Experience Distribution
                            </h3>

                            {Object.entries(experienceStats).map(([experience, count]) => (
                                <div key={experience} className="mb-4">
                                    <div className="flex justify-between text-sm mb-1.5 font-medium text-slate-600 dark:text-slate-300">
                                        <span>{experience}</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-50">{count}</span>
                                    </div>

                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(count / (candidates.length || 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 transition-opacity"
                    onClick={() => setDrawerOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-[500px] bg-white dark:bg-slate-800 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                            {selectedView.toUpperCase()}
                        </h2>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-lg p-3 mt-4 mb-6 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />

                        {selectedView === "companies" && (
                            filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
                                <div key={company.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{company.company_name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Location:</span> {company.location || 'Not specified'}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Website:</span> {company.website || 'Not specified'}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No companies found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "users" && (
                            filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <div key={user.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{user.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Email:</span> {user.email}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Role:</span> {user.role}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No users found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "jobs" && (
                            filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <div key={job.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{job.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Location:</span> {job.location}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Type:</span> {job.job_type}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Salary:</span> {job.salary_range}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No jobs found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "applications" && (
                            filteredApplications.length > 0 ? filteredApplications.map((app) => {
                                const candidate = candidates.find(c => c.id === app.candidate_id);
                                const job = jobs.find(j => j.id === app.job_id);
                                return (
                                <div key={app.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{candidate?.candidate_name || 'Unknown Candidate'}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Job Role:</span> {job?.title || 'Unknown Job'}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Status:</span> <span className={`font-semibold ${app.recruiter_status === 'Selected' ? 'text-emerald-500' : app.recruiter_status === 'Rejected' ? 'text-red-500' : 'text-blue-500'}`}>{app.recruiter_status}</span></p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">AI Score:</span> {app.ai_score}%</p>
                                </div>
                                );
                            }) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No applications found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "interviews" && (
                            filteredInterviews.length > 0 ? filteredInterviews.map((interview) => {
                                const app = applications.find(a => a.id === interview.application_id);
                                const candidate = candidates.find(c => c.id === app?.candidate_id);
                                return (
                                <div key={interview.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{candidate?.candidate_name || 'Unknown Candidate'}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Date:</span> {interview.interview_date}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Time:</span> {interview.interview_time}</p>
                                    {interview.meeting_link && (
                                        <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block font-medium">
                                            Join Meeting
                                        </a>
                                    )}
                                </div>
                                );
                            }) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No interviews found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "candidates" && (
                            filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => (
                                <div key={candidate.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{candidate.candidate_name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Skills:</span> {candidate.skills || 'Not specified'}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Education:</span> {candidate.education || 'Not specified'}</p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No candidates found.</p>
                                </div>
                            )
                        )}

                        {selectedView === "offers" && (
                            filteredOffers.length > 0 ? filteredOffers.map((offer) => (
                                <div key={offer.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 bg-white dark:bg-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50">{offer.candidate_name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-medium text-slate-500">Job Role:</span> {offer.job_title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Company:</span> {offer.company_name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-500">Status:</span> <span className={`font-semibold ${offer.status === 'Accepted' ? 'text-emerald-500' : 'text-blue-500'}`}>{offer.status}</span></p>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No offer letters found.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
