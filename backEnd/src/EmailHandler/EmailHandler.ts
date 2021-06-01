import nodemailer from 'nodemailer'
import Mail, { Attachment } from 'nodemailer/lib/mailer'

import { compile } from 'handlebars'
import { readFileSync } from 'fs'

export class EmailHandler {
    private transporter: Mail

    private URL: string

    public static instance: EmailHandler

    public static getInstance(): EmailHandler {
        if (EmailHandler.instance == null)
            EmailHandler.instance = new EmailHandler()

        return EmailHandler.instance
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

        this.URL = `${process.env.SERVER_IP}/verifyEmail`
    }

    public sendConfirmationEmail = async (to: string, URL: string) => {

        let templateFile = readFileSync('./src/assets/emails/emailConfirmationTemplate.html', { encoding: 'utf-8'})

        const template = compile(templateFile)

        const HTML = template({
            URL: `${this.URL}?URL=${URL}`
        })

        await this.sendMail(to, 'Emit - Confirm your account', HTML, [{
            filename: 'logo.png',
            path: './src/assets/images/emitMailLogo.png',
            cid: 'logo'
        }])
    }

    private sendMail = async (to: string, subject: string, html: string, attachments: Attachment[] = []) => {
        try {
            const ans = await this.transporter.sendMail({
                to,
                subject,
                html,
                attachments
            })
        }

        catch (err) {
            throw new Error('Couldn\'t send e-mail: ' + err)
        }
    }
}
