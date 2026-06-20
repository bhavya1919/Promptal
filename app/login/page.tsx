"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single();

            if (!userData) {
                toast.error("User not found");
                return;
            }

            toast.success("Welcome back!");

            if (userData.role === "candidate") {
                router.push("/candidate/dashboard");
            } else if (userData.role === "recruiter") {
                router.push("/recruiter/dashboard");
            } else if (userData.role === "admin") {
                router.push("/admin/dashboard");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
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
                            Welcome back to your hiring journey.
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            Connect with top talent or find your next dream job. All in one place.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Please sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="Enter your email address"
                                        aria-label="Email address"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Enter your password"
                                        aria-label="Password"
                                        className="w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-green-400 focus:ring-emerald-500 dark:focus:ring-blue-400" />
                                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                            </label>
                            <Link href="#" className="text-sm font-medium text-emerald-600 dark:text-green-400 hover:text-emerald-500">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 dark:bg-green-700 dark:text-slate-50 text-white py-3 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-emerald-600 dark:text-green-400 hover:text-emerald-500">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}