import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole } from "@/constants/enum";
import { SignJWT } from "jose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  avatar: string;
  role: UserRole;
  isVerified:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username is already taken"],
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required:false,
      sparse:true,
      unique: [true, "Email already registered"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number already registered"],
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.user,
    },
    avatar: {
      type: String,
      required: true,
    },
    isVerified:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}


// Generate JWT access token

userSchema.methods.generateAccessToken = async function (): Promise<string> {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  const token = await new SignJWT({
    _id: this._id.toString(),  // ensure it's a string
    username: this.username,
    role: this.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5d')
    .sign(secret);

  return token;
};


userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

  const token = await new SignJWT({
    _id: this._id.toString(), // always stringify ObjectId
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15d")
    .sign(secret);

  return token;
};

const User = models?.User || model<IUser>("User", userSchema);

export type { IUser};
export default User;
