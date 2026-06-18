"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!userData) {
            alert("User not found");
            return;
        }

        if (userData.role === "candidate") {
            router.push("/candidate/dashboard");
        } else if (userData.role === "recruiter") {
            router.push("/recruiter/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Promtal Login
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-3 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-3 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="bg-blue-600 text-white p-3 rounded"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}