import { UserModel } from '../../models/User'
import { IContext } from '../interfaces'

export default {
    Query: {
        Users: async (_: any, _2: any, ctx: IContext) => {

            if (!ctx.user) {
                throw new Error("You are not authenticated.")
            }

            const ans = await UserModel.find()

            return ans
        }
    }
}
