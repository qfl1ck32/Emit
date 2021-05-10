import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';

export default class EmailHandler {
    private transporter: Mail;

    public static instance: EmailHandler;

    public static getInstance(): EmailHandler {
        if (EmailHandler.instance == null)
            EmailHandler.instance = new EmailHandler();

        return EmailHandler.instance;
    }

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,

            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPass
            }
        })
    }

    public sendMail = async (to: string, subject: string, html: string) => {
        try {
            const ans = await this.transporter.sendMail({
                to,
                subject,
                html
            })

            console.log(ans)

            return true
        }

        catch (err) {
            return false;
        }
    }
}