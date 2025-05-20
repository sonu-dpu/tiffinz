import mongoose, { model, models, Schema } from "mongoose";
interface IAccount{
    _id?:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    balance:number;

    createdAt?:Date;
    updatedAt?:Date;
}


const accountSchema = new Schema<IAccount>({
    balance:{
        type:Number,
        default:0,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},
 { timestamps: true }
);


const Account= models?.Account || model<IAccount>("Account", accountSchema);

export type { IAccount };
export default Account;