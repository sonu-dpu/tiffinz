import mongoose, { model, models, Schema } from "mongoose";

interface ISession {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  refreshToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionScehma = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

sessionScehma.index({ user: 1, refreshToken: 1 });
const Session = models?.Session || model<ISession>("Session", sessionScehma);

export type { ISession };
export default Session;
