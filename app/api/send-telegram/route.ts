export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        // Check if telegram bot token and chat id are set
        if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
            console.log("Telegram credentials not found. Message would be:", message);
            return Response.json({ success: true, warning: "Telegram credentials missing, message logged" });
        }

        const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.description || "Failed to send Telegram message");
        }

        return Response.json({ success: true, data });
    } catch (error) {
        console.error("Telegram API Error:", error);
        
        return Response.json(
            { error: "Failed to send telegram message" },
            { status: 500 }
        );
    }
}
