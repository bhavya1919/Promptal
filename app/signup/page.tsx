"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role,
                    },
                },
            });

            if (error) {
                alert(error.message);
                return;
            }

            const userId = data.user?.id;

            if (userId) {
                const { error: insertError } = await supabase
                    .from("users")
                    .insert([
                        {
                            id: userId,
                            name: email.split("@")[0],
                            email,
                            role,
                        },
                    ]);

                if (insertError) {
                    alert(insertError.message);
                    return;
                }
            }

            alert("Signup Successful!");

            setEmail("");
            setPassword("");
            setRole("candidate");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Promtal Signup
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-3 rounded-md"
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-3 rounded-md"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border p-3 rounded-md"
                    >
                        <option value="candidate">Candidate</option>
                        <option value="recruiter">Recruiter</option>
                    </select>

                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}