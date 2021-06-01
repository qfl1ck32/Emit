import { RequestHandler } from 'express'
import { UserModel, IUser } from '../../models/User'

import { hash } from 'bcrypt'

import randomstring from 'randomstring'

import { checkUsernameExists, checkEmailExists } from '../../services/User'

import { EmailHandler } from '../../EmailHandler'

const saltRounds = 10

export const signup: RequestHandler = async (req, res) => {
    console.log('Intru.')
    const { username, email, password } = req.body as IUser

    console.log(username, email, password)

    if (!(username && email && password) || await checkUsernameExists(username) || await checkEmailExists(email)) {
        return res.send({
            error: true,
            message: 'Invalid request.'
        })
    }

    const hashedPassword = await hash(password, saltRounds)

    const emailConfirmationURL = randomstring.generate({
        length: 128,
        charset: 'alphabetic'
    })

    await EmailHandler.getInstance().sendConfirmationEmail(email, emailConfirmationURL)

    await UserModel.create({ username, email, password: hashedPassword, emailConfirmationURL, isSetUp: false })

    return res.sendStatus(200)
}

export const checkUsernameTaken: RequestHandler = async (req, res) => {
    const { username } = (req.body as { username: string })

    return res.send(await checkUsernameExists(username))
}

export const checkEmailTaken: RequestHandler = async (req, res) => {
    const { email } = (req.body as { email: string })

    return res.send(await checkEmailExists(email))
}
