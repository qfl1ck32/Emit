import { Emit, EmitModel, IUser, UserModel } from "../../models";
import { NotAuthenticated } from "../hobbies/errors";
import { ObjectId } from "mongodb";

export default {
  Mutation: {
    emit: async (
      _: any,
      data: { users: string[]; message: string },
      context: { user: IUser }
    ) => {
      const { user } = context;

      if (!user) {
        throw new NotAuthenticated();
      }

      const { users, message } = data;

      const usersToEmitIDs = users.map((id) => new ObjectId(id));

      const dbUsers = await UserModel.find({
        _id: {
          $in: usersToEmitIDs,
        },
      });

      let invited = [];

      for (const dbUser of dbUsers) {
        if (dbUser.whitelist.includes(user._id)) {
          invited.push(dbUser._id);
        }
      }

      await EmitModel.create({
        byUserId: new ObjectId(user._id),
        attendants: [],
        invited,
        message,
      });

      return true;
    },
  },
};
