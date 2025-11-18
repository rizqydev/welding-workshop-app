// models/User.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  _id: string | undefined
  username: string
  passwordHash: string
  name: string
  email: string
  phoneNumber: string
  userRole: "admin" | "manager" | "technician" | "warehouse" | "finishing" | "helper"
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    userRole: {
      type: String,
      enum: ["admin", "manager", "warehouse", "technician", "helper", "finishing"],
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
