"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

interface ApplicationData {
    id: string;
    candidate_name: string;
    candidate_email: string;
    skills: string;
    education: string;
    experience: string;
    job_title: string;
    requirements: string;
    recruiter_status: string;
    ai_score: number;
    resume_url: string;
    created_at: string;
    offer_status?: string;
}

import { X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";
import StatusBadge from "@/components/StatusBadge";
import { generateOfferLetter } from "@/lib/generateofferletter";
import { generateExperienceLetter } from "@/lib/generateExperienceLetter";

export default function ApplicationsPage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <ApplicationsPageContent />
        </ProtectedRoute>
    );
}

function ApplicationsPageContent() {
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState("corporate");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);

    const [referenceName, setReferenceName] = useState("");
    const [referenceCompany, setReferenceCompany] = useState("");
    const [referenceEmail, setReferenceEmail] = useState("");
    const [referencePhone, setReferencePhone] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const calculateScore = (
        requirements: string,
        skills: string
    ) => {
        const reqSkills = requirements
            .toLowerCase()
            .split(",")
            .map((s) => s.trim());
        const candidateSkills = skills
            .toLowerCase()
            .split(",")
            .map((s) => s.trim());

        const matched = reqSkills.filter((skill) =>
            candidateSkills.includes(skill)
        );

        return Math.round(
            (matched.length / reqSkills.length) * 100
        );

    };

    const fetchApplications = async () => {
        const { data: applicationsData, error } =
            await supabase.from("applications").select("*");

        if (error) {
            console.error(error);
            return;
        }

        const appIds = applicationsData?.map(a => a.id) || [];
        const { data: offersData } = await supabase
            .from("offer_letters")
            .select("application_id, status")
            .in("application_id", appIds);

        const offerStatusMap = new Map();
        offersData?.forEach(offer => {
            offerStatusMap.set(offer.application_id, offer.status);
        });

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

            await supabase
                .from("applications")
                .update({
                    ai_score: score,
                })
                .eq("id", app.id);

            results.push({
                id: app.id,
                candidate_name:
                    candidate?.candidate_name || "Unknown",
                candidate_email: userData?.email || "",
                skills: candidate?.skills || "",
                education: candidate?.education || "",
                experience: candidate?.experience || "",
                job_title: job?.title || "",
                requirements: job?.requirements || "",
                recruiter_status:
                    app.recruiter_status || "Applied",
                ai_score: score,
                resume_url: candidate?.resume_url || "",
                created_at: app.created_at || new Date().toISOString(),
                offer_status: offerStatusMap.get(app.id) || "None",
            });
        }

        setApplications(results);
        setLoading(false);

    };

    const updateStatus = async (
        applicationId: string,
        candidateName: string,
        candidateEmail: string,
        status: string
    ) => {
        const { error } = await supabase
            .from("applications")
            .update({
                recruiter_status: status,
            })
            .eq("id", applicationId);

        if (error) {
            toast.error(error.message);
            return;
        }

        if (status === "Shortlisted" || status === "Rejected" || status === "On Hold") {
            await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: candidateEmail,
                    candidateName,
                    status
                }),
            });

            await fetch("/api/send-telegram", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `Application Status Updated: ${status}`
                }),
            });
        }

        toast.success(`Candidate ${status}`);

        fetchApplications();

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

    const exportToCSV = () => {
        const headers = ["Candidate", "Email", "Job", "Status", "AI Score", "Applied Date"];
        const csvRows = applications.map(app => [
            `"${app.candidate_name}"`,
            `"${app.candidate_email}"`,
            `"${app.job_title}"`,
            `"${app.recruiter_status}"`,
            app.ai_score,
            `"${new Date(app.created_at).toLocaleDateString()}"`
        ]);

        const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "applications_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseCSV = () => {
        if (!csvFile) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target?.result as string;
            const rows = text.split("\n");
            const headers = rows[0].split(",").map((h) => h.trim());

            const data = rows
                .slice(1)
                .filter((row) => row.trim())
                .map((row) => {
                    const values = row.split(",");
                    return headers.reduce((obj: any, header, index) => {
                        obj[header] = values[index]?.trim() || "";
                        return obj;
                    }, {});
                });

            setCsvData(data);
        };

        reader.readAsText(csvFile);
    };

    const importCSV = async () => {
        if (csvData.length === 0) {
            toast.error("Preview CSV first");
            return;
        }

        const candidatesToInsert = csvData.map((candidate) => ({
            name: candidate.name,
            email: candidate.email,
            skills: candidate.skills,
            education: candidate.education,
            experience: candidate.experience,
        }));

        const { error } = await supabase
            .from("bulk_candidates")
            .insert(candidatesToInsert);

        if (error) {
            console.error(error);
            toast.error(error.message);
            return;
        }

        toast.success(`${candidatesToInsert.length} candidates imported successfully`);

        setCsvData([]);
        setCsvFile(null);
    };

    const addReferenceCheck = async (applicationId: string) => {
        const { error } = await supabase
            .from("reference_checks")
            .insert({
                application_id: applicationId,
                reference_name: referenceName,
                company: referenceCompany,
                email: referenceEmail,
                phone: referencePhone,
            });

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Reference added");

        setReferenceName("");
        setReferenceCompany("");
        setReferenceEmail("");
        setReferencePhone("");
    };

    return (<DashboardLayout><div className="p-8"> <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
                Applications Management
            </h1>
            <div className="flex flex-col items-end">
                <div className="flex gap-3">
                    <label className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors cursor-pointer flex items-center justify-center">
                        Import CSV
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setCsvFile(e.target.files[0]);
                                }
                            }}
                        />
                    </label>
                    <button 
                        onClick={exportToCSV}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors"
                    >
                        Export CSV
                    </button>
                </div>
                {csvFile && (
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-emerald-600 dark:text-green-400 mt-2 font-medium">
                            Selected: {csvFile.name}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={parseCSV}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2 text-sm font-semibold shadow transition-colors"
                            >
                                Preview CSV
                            </button>
                            <button
                                onClick={importCSV}
                                className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg mt-2 text-sm font-semibold shadow transition-colors"
                            >
                                Import Candidates
                            </button>
                        </div>
                    </div>
                )}
                {csvData.length > 0 && (
                    <div className="mt-4 text-left w-full max-w-sm">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-50 mb-2">
                            CSV Preview
                        </h3>
                        <pre className="bg-slate-100 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-50 overflow-x-auto border border-slate-200 dark:border-slate-700">
                            {JSON.stringify(csvData.slice(0, 5), null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>

        {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">
                <div className="p-4 border-b bg-slate-50 dark:bg-slate-900 flex gap-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-4 border-b flex gap-4 animate-pulse items-center">
                        <div className="h-10 bg-slate-100 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-8 bg-slate-100 rounded w-1/6"></div>
                    </div>
                ))}
            </div>
        ) : applications.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-12 text-center border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-full mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-50 mb-2">No Applications Found</h3>
                <p className="text-slate-500 dark:text-slate-400">There are currently no applications submitted by candidates.</p>
            </div>
        ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100 dark:bg-slate-800/75 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="text-left p-4">
                                Candidate
                            </th>
                            <th className="text-left p-4">
                                Skills
                            </th>
                            <th className="text-left p-4">
                                Job
                            </th>
                            <th className="text-left p-4">
                                AI Score
                            </th>
                            <th className="text-left p-4">
                                Status
                            </th>
                            <th className="text-left p-4">
                                Offer Status
                            </th>
                            <th className="text-left p-4">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app) => (
                            <tr
                                key={app.id}
                                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800 dark:text-slate-50">
                                        {app.candidate_name}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="inline-block bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 text-slate-700 dark:text-slate-50 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                                        >
                                            View Details
                                        </button>
                                        {app.resume_url && (
                                            <a
                                                href={app.resume_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all"
                                            >
                                                Resume
                                            </a>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4">
                                    {app.skills}
                                </td>

                                <td className="p-4">
                                    {app.job_title}
                                </td>

                                <td className="p-4">
                                    <span className="font-bold text-emerald-600 dark:text-green-400">
                                        {app.ai_score}%
                                    </span>
                                </td>

                                <td className="p-4">
                                    <StatusBadge status={app.recruiter_status} />
                                </td>

                                <td className="p-4">
                                    {app.offer_status && app.offer_status !== "None" ? (
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            app.offer_status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            app.offer_status === 'Declined' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {app.offer_status}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-400 italic text-xs">No Offer</span>
                                    )}
                                </td>

                                <td className="p-4">
                                    {app.recruiter_status !== "Applied" ? (
                                        <span className={`font-semibold text-sm ${
                                            app.recruiter_status === "Shortlisted" ? "text-emerald-600" :
                                            app.recruiter_status === "Rejected" ? "text-red-600" :
                                            app.recruiter_status === "On Hold" ? "text-yellow-600" : "text-gray-600"
                                        }`}>
                                            {app.recruiter_status}
                                        </span>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            app.id,
                                                            app.candidate_name,
                                                            app.candidate_email,
                                                            "Shortlisted"
                                                        )
                                                    }
                                                    className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                                >
                                                    Shortlist
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            app.id,
                                                            app.candidate_name,
                                                            app.candidate_email,
                                                            "Rejected"
                                                        )
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            app.id,
                                                            app.candidate_name,
                                                            app.candidate_email,
                                                            "On Hold"
                                                        )
                                                    }
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                                >
                                                    On Hold
                                                </button>
                                            </div>
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
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleGenerateOffer(
                                                                app.candidate_name,
                                                                app.job_title,
                                                                "Promtal Jobs",
                                                                selectedTemplate
                                                            )
                                                        }
                                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                                    >
                                                        Generate Offer
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleGenerateExperienceLetter(
                                                                app.candidate_name,
                                                                app.job_title,
                                                                "Promtal Jobs"
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer animate-duration-200"
                                                    >
                                                        Experience Letter
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        )}

    </div>
    </div>

    {/* Application Details Modal */}
    {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">Candidate Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Full application details</p>
                    </div>
                    <button 
                        onClick={() => setSelectedApp(null)}
                        className="text-slate-400 dark:text-slate-400 hover:text-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Name</p>
                            <p className="font-medium text-slate-800 dark:text-slate-50">{selectedApp.candidate_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</p>
                            <p className="font-medium text-slate-800 dark:text-slate-50">{selectedApp.candidate_email}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Applied Date</p>
                        <p className="font-medium text-slate-800 dark:text-slate-50">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">AI Match Score</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-green-400">{selectedApp.ai_score}%</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Application Status</p>
                            <div className="mt-1">
                                <StatusBadge status={selectedApp.recruiter_status} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedApp.skills ? selectedApp.skills.split(',').map((skill, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
                                    {skill.trim()}
                                </span>
                            )) : <p className="text-slate-400 dark:text-slate-400 italic text-sm">No skills specified</p>}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Education</p>
                        <p className="text-sm text-slate-700 dark:text-slate-50 whitespace-pre-wrap">{selectedApp.education || <span className="text-slate-400 dark:text-slate-400 italic">Not specified</span>}</p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                        <p className="text-sm text-slate-700 dark:text-slate-50 whitespace-pre-wrap">{selectedApp.experience || <span className="text-slate-400 dark:text-slate-400 italic">Not specified</span>}</p>
                    </div>
                </div>

                <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 mb-4">Reference Check</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-blue-400 outline-none text-sm transition-all dark:bg-slate-900"
                            placeholder="Reference Name"
                            value={referenceName}
                            onChange={(e) => setReferenceName(e.target.value)}
                        />
                        <input
                            className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-blue-400 outline-none text-sm transition-all dark:bg-slate-900"
                            placeholder="Company"
                            value={referenceCompany}
                            onChange={(e) => setReferenceCompany(e.target.value)}
                        />
                        <input
                            className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-blue-400 outline-none text-sm transition-all dark:bg-slate-900"
                            placeholder="Email"
                            value={referenceEmail}
                            onChange={(e) => setReferenceEmail(e.target.value)}
                        />
                        <input
                            className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-blue-400 outline-none text-sm transition-all dark:bg-slate-900"
                            placeholder="Phone"
                            value={referencePhone}
                            onChange={(e) => setReferencePhone(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => addReferenceCheck(selectedApp.id)}
                        className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition-all w-full md:w-auto"
                    >
                        Add Reference
                    </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 p-6 flex justify-between items-center shrink-0">
                    {selectedApp.resume_url ? (
                        <a 
                            href={selectedApp.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors flex items-center gap-2"
                        >
                            View Resume
                        </a>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic">No resume provided</p>
                    )}
                    <button 
                        onClick={() => setSelectedApp(null)}
                        className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )}
    </DashboardLayout>
    );
}
