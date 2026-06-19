export const sendEmailNotification = async (
    email: string,
    message: string
) => {
    console.log("EMAIL SENT");
    console.log(email);
    console.log(message);

    return true;
};

export const sendTelegramNotification = async (
    user: string,
    message: string
) => {
    console.log("TELEGRAM SENT");
    console.log(user);
    console.log(message);

    return true;
};