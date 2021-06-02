import { createError } from 'apollo-errors'

export const UserNotExists = createError('UserNotExists', {
    message: 'There is no such user.'
})


export const WrongPassword = createError('WrongPassword', {
    message: 'Wrong password.'
})

export const EmailNotConfirmed = (email: string) => createError('EmailNotConfirmed', {
        message: `You haven\'t confirmed your e-mail. Please check your address at ${email}.`
})
