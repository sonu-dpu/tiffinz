import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define enum for role
enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
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

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "5d" }
  );
};

const User = models?.User || model<IUser>("User", userSchema);

export type { IUser, UserRole };
export default User;
