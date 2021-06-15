import { Schema, model, ObjectId } from "mongoose";
import { Types } from "mongoose";
import { ObjectID } from "mongodb";
import { Emit } from "../User";

export const EmitSchema = new Schema({
  byUserId: {
    type: ObjectID,
    required: true,
  },
  invited: {
    type: Array,
  },
  attendants: {
    type: Array,
  },
  message: {
    type: String,
  },
});

export const EmitModel = model<Emit>("Emit", EmitSchema);
