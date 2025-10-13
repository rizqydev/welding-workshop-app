// models/Setting.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface ISetting extends Document {
  registrationEnabled: boolean
}

const SettingSchema = new Schema<ISetting>({
  registrationEnabled: { type: Boolean, default: true },
})

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)
