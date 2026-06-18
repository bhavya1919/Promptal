"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

    return (<div className="min-h-screen bg-slate-100 p-8"> <div className="max-w-4xl mx-auto space-y-8">

        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6">
                Recruiter Dashboard
            </h1>

            <h2 className="text-xl font-semibold mb-4">
                Create Company Profile
            </h2>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border p-3 rounded"
                />

                <textarea
                    placeholder="Company Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-3 rounded"
                />

                <input
                    type="url"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="border p-3 rounded"
                />

                <button
                    onClick={handleSaveCompany}
                    className="bg-emerald-600 text-white p-3 rounded hover:bg-emerald-700"
                >
                    Save Company
                </button>
            </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
                Post a Job
            </h2>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-3 rounded"
                />

                <textarea
                    placeholder="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="border p-3 rounded"
                />

                <textarea
                    placeholder="Requirements (Python, SQL, Power BI)"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    placeholder="Salary Range"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="border p-3 rounded"
                />

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="border p-3 rounded"
                >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                </select>

                <button
                    onClick={handlePostJob}
                    className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                    Post Job
                </button>
            </div>
        </div>

    </div>
    </div>

);
}
