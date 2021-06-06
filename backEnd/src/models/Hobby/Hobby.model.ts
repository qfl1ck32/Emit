import { Schema, model, ObjectId } from 'mongoose'
import { Types } from 'mongoose'

export const HobbySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: Types.ObjectId,
        required: true
    }
})

export interface IHobby {
    _id: ObjectId,

    title: string,
    categoryId: ObjectId
}

export const HobbyModel = model <IHobby> ('Hobby', HobbySchema)
