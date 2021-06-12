import { IUser, UserModel } from "../../models";
import { NotAuthenticated } from "../hobbies/errors";
import { ObjectId } from "mongodb";

export default {
  Query: {
    getUserImage: (_: any, _2: any, _3: any) => {
      return [];
    },

    getMyImage: async (_: any, _2: any, context: { user: IUser }) => {
      const { user } = context;

      if (!user) {
        throw new NotAuthenticated();
      }

      const { _id } = user;

      const { image } = await UserModel.findById(_id);

      return image;
    },

    getAllUsers: async (_: any, _2: any, context: { user: IUser }) => {
      const { user: currentUser } = context;

      if (!currentUser) {
        throw new NotAuthenticated();
      }

      const users = (await UserModel.find()).filter(
        (user) => user._id != currentUser._id
      );

      return users;
    },
  },

  Mutation: {
    addToWhitelist: async (
      _: any,
      data: { id: string },
      context: { user: IUser }
    ) => {
      const { user } = context;

      if (!user) {
        throw new NotAuthenticated();
      }

      const { _id: currentUserId } = user;

      const { id } = data;

      const { whitelist } = await UserModel.findById({
        _id: new ObjectId(currentUserId),
      });

      await UserModel.findByIdAndUpdate(currentUserId, {
        whitelist: whitelist.concat(new ObjectId(id)),
      });

      return true;
    },
  },
};
