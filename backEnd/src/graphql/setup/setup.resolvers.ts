import { HobbyModel, IUser, UserModel } from "../../models";
import { SomethingWrongHappened } from "../register/errors";
import { ObjectId } from "mongodb";

import {
  seReq,
  makeAddNewUserReq,
  makeChUserReq,
  makeFindByNameReq,
  makeSimUserByattrReq,
  makeSimUserReq,
} from "../../searchEngine/helpers";
import { UserNotExists } from "../login/errors";

interface ISetup {
  input: {
    name: string;
    hobbies: string[];
    image: null | string;
  };
}

export default {
  Mutation: {
    setup: async (_: any, data: ISetup, context: { user: IUser }) => {
      const {
        input: { name, hobbies, image },
      } = data;

      const { user } = context;

      if (!user) {
        throw new SomethingWrongHappened();
      }

      const { _id } = user;

      await UserModel.findOneAndUpdate(
        {
          _id,
        },
        {
          hobbies: hobbies.map((_id) => new ObjectId(_id)),
          name,
          isSetUp: true,
          image,
        }
      );

      return true;
    },
  },
};
