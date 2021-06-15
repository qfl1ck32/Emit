import { UserModel, IUser } from "../../models/User";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../helpers/auth";

import { UserNotExists, WrongPassword, EmailNotConfirmed } from "./errors";
import { EmitModel } from "../../models";
import { ObjectId } from "mongodb";

export default {
  Mutation: {
    login: async (
      _: any,
      data: { username: string; password: string },
      _2: any
    ) => {
      const { username, password } = data;

      const user = (await UserModel.findOne({ username })) as IUser;

      if (!user) {
        throw new UserNotExists();
      }

      const passwordsAreSame = await compare(password, user.password);

      if (!passwordsAreSame) {
        throw new WrongPassword();
      }

      if (user.emailConfirmationURL) {
        throw new (EmailNotConfirmed(user.email))();
      }

      const userId = new ObjectId(user._id);

      const emits = await EmitModel.find();
      const usefulEmits = emits.filter(
        (emit) =>
          emit.byUserId.equals(userId) ||
          emit.invited.includes(userId) ||
          emit.attendants.includes(userId)
      );

      const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        isSetUp: user.isSetUp,
        whitelist: user.whitelist,
        blacklist: user.blacklist,
        emits: usefulEmits,
      };

      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);

      return {
        tokens: {
          accessToken,
          refreshToken,
        },
        user: userData,
      };
    },
  },
};
