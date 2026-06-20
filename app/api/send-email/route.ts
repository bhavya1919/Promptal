import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, candidateName, status } = await req.json();

        let subject = "Application Status Update";
        let message = `We wanted to update you on your recent application.`;

        if (status === "Shortlisted") {
            subject = "🎉 Congratulations! You Have Been Shortlisted";
            message = `We are pleased to inform you that you have been <strong>shortlisted</strong> for the next stage of the recruitment process. Our recruitment team will contact you shortly regarding interview scheduling and further steps.`;
        } else if (status === "Rejected") {
            subject = "Application Update";
            message = `Thank you for taking the time to apply. Unfortunately, we will not be moving forward with your application at this time. We will keep your resume on file for future opportunities.`;
        } else if (status === "On Hold") {
            subject = "Application Status: On Hold";
            message = `Your application is currently <strong>on hold</strong>. We are still reviewing candidates and will get back to you with a final decision soon.`;
        } else {
            subject = `Application Status Updated: ${status}`;
            message = `Your application status has been updated to: <strong>${status}</strong>.`;
        }

        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [email],
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color:#333;">
                        Hello ${candidateName || "Candidate"},
                    </h2>

                    <p>
                        ${message}
                    </p>

                    <br/>

                    <p>
                        Best Regards,<br/>
                        <strong>Promtal Jobs Recruitment Team</strong>
                    </p>
                </div>
            `,
        });

        return Response.json(data);
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}