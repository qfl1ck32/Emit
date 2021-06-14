import { IUser } from "../../models";
import { NotAuthenticated } from "../hobbies/errors";

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

      console.log(users);
      console.log(message);
      console.log(user);
      return true;
    },
  },
};
