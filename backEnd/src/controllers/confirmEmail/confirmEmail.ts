import { RequestHandler } from 'express'
import { UserModel, IUser } from '../../models/User'
import { readFileSync } from 'fs'

export const confirmEmail: RequestHandler = async (req, res) => {
    const emailConfirmationURL = (req.query as { URL: string }).URL

    const user = await UserModel.findOne({ emailConfirmationURL })

    if (!user) {
        const templateFile = readFileSync('./src/assets/emails/emailConfirmationNotFound.html', { encoding: 'utf-8' })

        return res.send(templateFile)
    }

    await UserModel.updateOne({ _id: user._id }, {
        $unset: {
            emailConfirmationURL: 1
        }
    })

    const templateFile = readFileSync('./src/assets/emails/emailConfirmationSuccess.html', { encoding: 'utf-8' })

    return res.send(templateFile)
}
