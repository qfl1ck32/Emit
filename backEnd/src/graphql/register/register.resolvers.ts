import { RequestHandler } from "express";
import { UserModel, IUser } from "../../models/User";

import { hash } from "bcrypt";

import randomstring from "randomstring";

import { checkUsernameExists, checkEmailExists } from "../../services";

import { EmailHandler } from "../../EmailHandler";

import { SomethingWrongHappened } from "./errors";
import { IContext } from "../interfaces";

const saltRounds = 10;

export default {
  Mutation: {
    register: async (
      _: any,
      data: { input: { username: string; email: string; password: string } },
      _2: any
    ) => {
      const { username, email, password } = data.input;

      if (
        (await checkUsernameExists(username)) ||
        (await checkEmailExists(email))
      ) {
        throw new SomethingWrongHappened();
      }

      const hashedPassword = await hash(password, saltRounds);

      const emailConfirmationURL = randomstring.generate({
        length: 128,
        charset: "alphabetic",
      });

      await EmailHandler.getInstance().sendConfirmationEmail(
        email,
        emailConfirmationURL
      );
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        emailConfirmationURL,
        isSetUp: false,
        whitelist: [],
        blacklist: [],
      });

      return "You have successfully registered!";
    },
  },

  Query: {
    checkUsernameExists: async (
      _: any,
      data: { username: string },
      _2: any
    ) => {
      const { username } = data;
      return await checkUsernameExists(username);
    },

    checkEmailExists: async (_: any, data: { email: string }, _2: any) => {
      const { email } = data;
      return await checkEmailExists(email);
    },
  },
};
