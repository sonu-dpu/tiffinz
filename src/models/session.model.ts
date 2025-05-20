import mongoose, { model, models, Schema } from "mongoose";

interface ISession {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  verifyToken: string;
  verifyTokenExpiry: Date;
}

const sessionScehma = new Schema<ISession>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    accessToken:{
        type:String,
    },
    refreshToken:{
        type:String,
    },
    verifyToken:{
        type:String
    },
    verifyTokenExpiry:{
        type:Date,
    }
});


const Seesion = models?.Session || model<ISession>("Session", sessionScehma);

export type { ISession};
export default Seesion
