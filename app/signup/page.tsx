"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, Loader2, Mail, Lock, UserRound, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
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

            alert("Signup Successful! Please check your email or login.");
            router.push("/login");

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
            {/* Left Side - Branding */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-900 flex-col justify-center items-center text-white p-12">
                <div className="max-w-md w-full space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-4xl font-bold tracking-tight">Promtal</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight">
                            Join our thriving network.
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            Sign up today and unlock endless opportunities for your career or company.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Create an Account</h2>
                        <p className="text-slate-500 mt-2">Get started by choosing your role</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("candidate")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                    role === "candidate" 
                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                                    : "border-slate-200 hover:border-emerald-200 text-slate-600"
                                }`}
                            >
                                <UserRound className={`w-8 h-8 mb-2 ${role === "candidate" ? "text-emerald-600" : "text-slate-400"}`} />
                                <span className="font-semibold">Candidate</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("recruiter")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                    role === "recruiter" 
                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                                    : "border-slate-200 hover:border-emerald-200 text-slate-600"
                                }`}
                            >
                                <Briefcase className={`w-8 h-8 mb-2 ${role === "recruiter" ? "text-emerald-600" : "text-slate-400"}`} />
                                <span className="font-semibold">Recruiter</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}