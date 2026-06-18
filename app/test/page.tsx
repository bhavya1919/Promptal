"use client";

import { supabase } from "@/lib/supabase";

export default function TestPage() {
    const checkDatabase = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*");

        console.log("DATA:", data);
        console.log("ERROR:", error);
    };

    return (
        <div className="p-10">
            <button
                onClick={checkDatabase}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Check Database
            </button>
        </div>
    );
}