import { Schema, model, ObjectId } from 'mongoose'

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    emailConfirmationURL: {
        type: String
    },

    passwordResetURL: {
        type: String
    },

    hobbies: {
        type: Array
    },

    isSetUp: {
        type: Boolean
    }
})

export interface IUser {
    _id: ObjectId,

    username: string
    email: string
    password: string,

    emailConfirmationURL: string,
    passwordResetURL: string,

    hobbies: number[],

    isSetUp: boolean
}

export const UserModel = model <IUser> ('User', UserSchema)
