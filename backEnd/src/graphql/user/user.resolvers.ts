import { HobbyModel, IUser, UserModel } from "../../models";
import { NotAuthenticated } from "../hobbies/errors";
import { ObjectId } from "mongodb";

export default {
  Query: {
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

    getUser: async (_: any, data: { id: string }, context: { user: IUser }) => {
      const { user } = context;
      const { id } = data;

      if (!user) {
        throw new NotAuthenticated();
      }

      const dbUser = await UserModel.findById(id);

      return dbUser || null;
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

    removeFromWhitelist: async (
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
        whitelist: whitelist.filter((id) => id !== id),
      });

      return true;
    },

    addToBlacklist: async (
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

      const { blacklist } = await UserModel.findById({
        _id: new ObjectId(currentUserId),
      });

      await UserModel.findByIdAndUpdate(currentUserId, {
        blacklist: blacklist.concat(new ObjectId(id)),
      });

      return true;
    },

    removeFromBlacklist: async (
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

      const { blacklist } = await UserModel.findById({
        _id: new ObjectId(currentUserId),
      });

      await UserModel.findByIdAndUpdate(currentUserId, {
        blacklist: blacklist.filter((id) => id !== id),
      });

      return true;
    },
  },

  User: {
    hobbies: async (root: IUser, _: any, _2: any) => {
      const { hobbies } = root;

      const dbHobbies = await HobbyModel.find();

      return dbHobbies.filter((hobby) =>
        hobbies.includes(new ObjectId(hobby._id))
      );
    },
  },
};
