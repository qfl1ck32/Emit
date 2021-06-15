import { ObjectId } from "mongodb";

export interface User {
  _id: any;
  username: string;
  email: string;
  isSetUp: boolean;
  image: string | null;
  whitelist: string[];
  blacklist: string[];
  hobbies: { title: string }[];
  emits: Emit[];
}

export interface Emit {
  _id: ObjectId;
  byUserId: ObjectId;
  invited: ObjectId[];
  attendants: ObjectId[];
  message: string;
}
