import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "instructor";
  phone?: string; // telefon raqam
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "instructor"], required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

const User = models.User<IUser> || model<IUser>("User", UserSchema);

export default User;
