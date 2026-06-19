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
    }, []);

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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Admin Dashboard"
                    subtitle="Overview of system-wide metrics and resource registration counts"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Users" value={stats.users} icon={Users} color="emerald" />
                    <StatCard title="Companies Registered" value={stats.companies} icon={Building2} color="blue" />
                    <StatCard title="Jobs Posted" value={stats.jobs} icon={Briefcase} color="indigo" />
                    <StatCard title="Candidates Registered" value={stats.candidates} icon={UserCheck} color="rose" />
                    <StatCard title="Applications Received" value={stats.applications} icon={FileText} color="purple" />
                    <StatCard title="Interviews Scheduled" value={stats.interviews} icon={CalendarDays} color="orange" />
                    <StatCard title="Offer Letters Generated" value={stats.offers} icon={FileBadge} color="indigo" />
                </div>
            </div>
        </DashboardLayout>
    );
}
