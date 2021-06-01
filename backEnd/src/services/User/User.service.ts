import { UserModel, IUser } from '../../models'
import { FilterQuery } from 'mongodb'

export const count = async (filters: FilterQuery <IUser>) => {
    return await UserModel.countDocuments(filters)
}

export const checkEmailExists = async (email: string) => {
    return (await count({ email })) === 1
}

export const checkUsernameExists = async (username: string) => {
    return (await count({ username })) === 1
}
