import { Schema, model, ObjectId } from 'mongoose'

export const HobbySchema = new Schema({
    title: {
        type: String,
        required: true
    },

    activities: {
        type: Array,
        required: true
    }
})

export interface IHobby {
    _id: ObjectId,

    title: string,
    activities: string[]
}

export const HobbyModel = model <IHobby> ('Hobby', HobbySchema)
