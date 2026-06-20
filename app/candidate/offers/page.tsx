"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, FileText, Clock } from "lucide-react";

interface OfferData {
    id: string;
    application_id: string;
    candidate_name: string;
    job_title: string;
    company_name: string;
    offer_date: string;
    status: string;
}

export default function CandidateOffersPage() {
    return (
        <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateOffersContent />
        </ProtectedRoute>
    );
}

function CandidateOffersContent() {
    const [offers, setOffers] = useState<OfferData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: candidate } = await supabase
                .from("candidates")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!candidate) {
                setLoading(false);
                return;
            }

            const { data: applications } = await supabase
                .from("applications")
                .select("id")
                .eq("candidate_id", candidate.id);

            if (!applications || applications.length === 0) {
                setOffers([]);
                setLoading(false);
                return;
            }

            const appIds = applications.map(a => a.id);

            const { data: offerData, error } = await supabase
                .from("offer_letters")
                .select("*")
                .in("application_id", appIds)
                .order("offer_date", { ascending: false });

            if (error) {
                console.error("Error fetching offers:", error);
            } else {
                setOffers(offerData || []);
            }
        } catch (error) {
            console.error("Failed to load offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOfferStatus = async (offerId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("offer_letters")
                .update({ status: newStatus })
                .eq("id", offerId);

            if (error) throw error;

            toast.success(`Offer ${newStatus}!`);
            fetchOffers();
        } catch (error: any) {
            toast.error(error.message || `Failed to update offer to ${newStatus}`);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="My Offers" 
                    subtitle="Review and respond to your generated job offers" 
                />

                {offers.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-12 text-center border border-slate-100 flex flex-col items-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Offers Yet</h3>
                        <p className="text-slate-500">When recruiters generate an offer for you, it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {offers.map((offer) => (
                            <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{offer.job_title}</h3>
                                        <p className="text-slate-500 font-medium mt-1">{offer.company_name}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                        offer.status === 'Accepted' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : offer.status === 'Declined'
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                        {offer.status === 'Accepted' && <CheckCircle className="w-3.5 h-3.5" />}
                                        {offer.status === 'Declined' && <XCircle className="w-3.5 h-3.5" />}
                                        {(!offer.status || offer.status === 'Generated') && <Clock className="w-3.5 h-3.5" />}
                                        {offer.status || 'Generated'}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-6 flex gap-8">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                                            <p className="font-medium text-slate-800">{new Date(offer.offer_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Candidate</p>
                                            <p className="font-medium text-slate-800">{offer.candidate_name}</p>
                                        </div>
                                    </div>

                                    {(!offer.status || offer.status === "Generated" || offer.status === "Pending") ? (
                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={() => updateOfferStatus(offer.id, "Accepted")}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Accept Offer
                                            </button>
                                            <button
                                                onClick={() => updateOfferStatus(offer.id, "Declined")}
                                                className="flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 font-semibold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" /> Decline Offer
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                                            offer.status === 'Accepted' 
                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                                : 'bg-rose-50 text-rose-800 border border-rose-100'
                                        }`}>
                                            {offer.status === 'Accepted' ? (
                                                <>You have accepted this offer <CheckCircle className="w-4 h-4" /></>
                                            ) : (
                                                <>You have declined this offer <XCircle className="w-4 h-4" /></>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
