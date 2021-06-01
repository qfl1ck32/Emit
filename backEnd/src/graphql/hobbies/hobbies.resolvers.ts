import { HobbyModel } from '../../models'
import { IContext } from '../interfaces'

export default {
    Query: {
        Hobbies: async (_: any, _2: any, ctx: IContext) => {

            // if (!ctx.user) {
            //     throw new Error("You are not authenticated.")
            // }

            const ans = await HobbyModel.find()

            console.log(ans)

            return ans
        }
    }
}
