import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import { generate } from "randomstring";

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  emailConfirmationURL: {
    type: String,
  },

  passwordResetURL: {
    type: String,
  },

  hobbies: {
    type: Array,
  },

  image: {
    type: String,
  },

  isSetUp: {
    type: Boolean,
  },

  whitelist: {
    type: Array,
  },

  blacklist: {
    type: Array,
  },
});

export interface IUser {
  _id: ObjectId;

  username: string;
  email: string;
  password: string;

  name: string;

  emailConfirmationURL: string;
  passwordResetURL: string;

  hobbies: ObjectId[];

  image: string;

  isSetUp: boolean;

  whitelist: ObjectId[];
  blacklist: ObjectId[];
}

export const UserModel = model<IUser>("User", UserSchema);

export const addMock = async () => {
  const image =
    "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";

  for (let i = 0; i < 50; ++i) {
    const username = generate({
      length: Math.floor(Math.random() * 10),
      readable: false,
    });

    const email = generate({
      length: Math.floor(Math.random() * 10),
      readable: false,
    });

    const password = generate({
      length: Math.floor(8 + Math.random() * 10),
      readable: false,
    });

    await UserModel.create({
      username,
      email,
      password,
      isSetUp: true,
      image,
    });
  }
};
