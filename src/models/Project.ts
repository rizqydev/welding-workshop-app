// models/Project.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IProject extends Document {
  _id: string | undefined
  projectName: string
  customerName: string
  address: string
  startDate: Date
  endDate: Date
  typeOfWork: string
  volume: number
  volumeUnit: string
  isComplete: boolean
}

const ProjectSchema = new Schema<IProject>(
  {
    projectName: { type: String, required: false, unique: true },
    customerName: { type: String, required: false },
    address: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    typeOfWork: { type: String, required: false },
    volume: { type: Number, required: false },
    volumeUnit: { type: String, required: false },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
