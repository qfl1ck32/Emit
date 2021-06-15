import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

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

  emits: {
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

  emits: Emit[];
}

export interface Emit {
  byUserId: ObjectId;
  invited: ObjectId[];
  attendants: ObjectId[];
  message: string;
}

export const UserModel = model<IUser>("User", UserSchema);
