import { HobbyModel } from '../../models'
import { IContext } from '../interfaces'
import { NotAuthenticated } from './errors'

export default {
    Query: {
        Hobbies: async (_: any, _2: any, ctx: IContext) => {
            if (!ctx.user) {
                throw new NotAuthenticated()
            }

            return await HobbyModel.find()
        }
    }
}
