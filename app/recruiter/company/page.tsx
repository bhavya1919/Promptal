"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import { toast } from "react-hot-toast";
import { Building2, MapPin, Globe, FileText, Loader2, Save } from "lucide-react";

export default function CompanyProfilePage() {
    return (
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <CompanyProfileContent />
        </ProtectedRoute>
    );
}

function CompanyProfileContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: company } = await supabase
                .from("companies")
                .select("*")
                .eq("recruiter_id", user.id)
                .single();

            if (company) {
                setCompanyId(company.id);
                setCompanyName(company.company_name || "");
                setDescription(company.description || "");
                setLocation(company.location || "");
                setWebsite(company.website || "");
            }
        } catch (err) {
            console.error("Error fetching company profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!companyName.trim()) {
            toast.error("Company Name is required");
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            if (companyId) {
                // Update existing
                const { error } = await supabase
                    .from("companies")
                    .update({
                        company_name: companyName,
                        description,
                        location,
                        website
                    })
                    .eq("id", companyId);

                if (error) throw error;
                toast.success("Company profile updated successfully!");
            } else {
                // Create new
                const { data, error } = await supabase
                    .from("companies")
                    .insert([{
                        recruiter_id: user.id,
                        company_name: companyName,
                        description,
                        location,
                        website
                    }])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setCompanyId(data.id);
                toast.success("Company profile created successfully!");
            }
        } catch (err: any) {
            console.error("Error saving company profile:", err);
            toast.error(err.message || "Failed to save company profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <PageHeader 
                    title="Company Profile"
                    subtitle="Manage your organization's details to attract top talent"
                />

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <SectionCard title="Organization Details" subtitle="This information will be visible to candidates">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Name */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label htmlFor="companyName" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                        <input
                                            id="companyName"
                                            type="text"
                                            required
                                            placeholder="e.g., Tech Innovators Inc."
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5">
                                    <label htmlFor="location" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                        Headquarters Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                        <input
                                            id="location"
                                            type="text"
                                            placeholder="e.g., San Francisco, CA"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="space-y-1.5">
                                    <label htmlFor="website" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                        Website URL
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                        <input
                                            id="website"
                                            type="url"
                                            placeholder="e.g., https://example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label htmlFor="description" className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                                        Company Description
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-4 text-slate-400 dark:text-slate-400 h-5 w-5" />
                                        <textarea
                                            id="description"
                                            rows={5}
                                            placeholder="Tell candidates about your company's mission, culture, and values..."
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-blue-400 outline-none transition-all"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-emerald-600 dark:bg-green-700 dark:text-slate-50 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] hover:shadow-lg shadow-emerald-600/10 focus:ring-4 focus:ring-emerald-500/20 flex items-center gap-2 disabled:opacity-75 text-sm cursor-pointer"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </SectionCard>
                )}
            </div>
        </DashboardLayout>
    );
}
