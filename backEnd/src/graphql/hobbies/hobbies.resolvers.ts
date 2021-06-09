import { HobbyCategoryModel, HobbyModel } from '../../models'
import { IContext } from '../interfaces'
import { NotAuthenticated } from './errors'

//FIXME is there a better way to query from MongoDB?
export default {
    Query: {
        hobbiesFind: async (_: any, _2: any, ctx: IContext) => {
            if (!ctx.user) {
                throw new NotAuthenticated()
            }

            return await HobbyCategoryModel.find()
        }
    },
    
    Hobby: {
        hobbies: async ({ _id }, _: any, _2: IContext) => {
            return await HobbyModel.find({ categoryId: _id })
        }
    }
}
