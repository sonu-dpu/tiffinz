import mongoose, { model, models, Schema } from "mongoose";

interface ISession {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  verifyEmailToken?: string;
  verifyEmailTokenExpiry?: Date;
  forgetPasswordToken?:string;
  forgetPasswordTokenExpiry?:Date;
  createdAt?:Date;
  updatedAt?:Date;
}

const sessionScehma = new Schema<ISession>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    refreshToken:{
        type:String,
    },
    verifyEmailToken:{
        type:String
    },
    verifyEmailTokenExpiry:{
        type:Date,
    },
      forgetPasswordToken:{
        type:String
    },
    forgetPasswordTokenExpiry:{
        type:Date,
    },

},
{timestamps:true}
);


const Session = models?.Session || model<ISession>("Session", sessionScehma);

export type { ISession};
export default Session
