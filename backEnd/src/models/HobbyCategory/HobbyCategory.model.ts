import { Schema, model, ObjectId } from 'mongoose'

export const HobbyCategorySchema = new Schema({
    category: {
        type: String,
        required: true
    }
})

export interface IHobbyCategory {
    _id: ObjectId,

    category: string
}

export const HobbyCategoryModel = model <IHobbyCategory> ('HobbyCategory', HobbyCategorySchema)
