import mongoose, { model, models, Schema } from "mongoose";
interface IAccount{
    _id?:mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    balance:number;
    createdAt?:Date;
    updatedAt?:Date;
}

const accountSchema = new Schema<IAccount>({
    balance:{
        type:Number,
        default:0,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
    { timestamps: true }
);


const Account= models?.Account || model<IAccount>("Account", accountSchema);

export type { IAccount };
export default Account;