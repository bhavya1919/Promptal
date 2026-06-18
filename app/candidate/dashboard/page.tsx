"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CandidateDashboard() {
    const [skills, setSkills] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

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

    return (<div className="min-h-screen bg-slate-100 p-8"> <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-6">
        Candidate Dashboard </h1>
        <h2 className="text-xl font-semibold mb-4">
            Create Your Profile
        </h2>

        <div className="flex flex-col gap-4">
            <textarea
                placeholder="Skills (Example: Python, SQL, Power BI)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="border p-3 rounded"
            />

            <textarea
                placeholder="Education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="border p-3 rounded"
            />

            <textarea
                placeholder="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border p-3 rounded"
            />

            <input
                type="text"
                placeholder="Resume URL"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="border p-3 rounded"
            />

            <button
                onClick={handleSaveProfile}
                className="bg-emerald-600 text-white p-3 rounded hover:bg-emerald-700"
            >
                Save Profile
            </button>
        </div>
    </div>
    </div>


    );
}
