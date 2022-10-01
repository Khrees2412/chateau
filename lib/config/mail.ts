import Mailjet from "node-mailjet";
import logger from "../logger";

const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_KEY,
    apiSecret: process.env.MAILJET_SECRET,
    options: {
        timeout: 100,
    },
});

interface IMailData {
    email: string;
    name: string;
    subject: string;
    text: string;
    html?: string;
    userId: string;
}

const ComputeRandomId = (userId: string): string => {
    if (!userId) throw new Error("User ID must be passed");
    return "chateau" + userId + Date.now();
};

const SendMail = async (data: IMailData) => {
    try {
        const result = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAIL,
                        Name: "Chateau ChatApp",
                    },
                    To: [
                        {
                            Email: data.email,
                            Name: data.name,
                        },
                    ],
                    Subject: data.subject,
                    TextPart: data.text,
                    HTMLPart: data.html ? data.html : "",
                    CustomID: ComputeRandomId(data.userId),
                },
            ],
        });
        logger.info(result.body);
    } catch (error) {
        logger.error(error);
    }
};

export default SendMail;
