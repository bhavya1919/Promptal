import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, candidateName } = await req.json();

        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [email],
            subject: "🎉 Congratulations! You Have Been Shortlisted",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color:#10b981;">
                        Congratulations ${candidateName}!
                    </h2>

                    <p>
                        We are pleased to inform you that you have been
                        <strong>shortlisted</strong> for the next stage of the recruitment process.
                    </p>

                    <p>
                        Our recruitment team will contact you shortly regarding
                        interview scheduling and further steps.
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