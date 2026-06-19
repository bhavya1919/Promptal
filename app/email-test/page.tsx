"use client";

export default function EmailTest() {
    const sendEmail = async () => {
        const res = await fetch("/api/send-email", {
            method: "POST",
        });

        const data = await res.json();

        console.log(data);

        alert("Email request sent");
    };

    return (
        <div className="p-10">
            <button
                onClick={sendEmail}
                className="bg-green-600 text-white px-6 py-3 rounded"
            >
                Send Test Email
            </button>
        </div>
    );
}