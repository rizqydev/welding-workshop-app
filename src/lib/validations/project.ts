// lib/validationProject.ts
import { z } from "zod"

export const projectSchema = z.object({
  projectName: z.string().min(3, "Project Name is required"),
  customerName: z.string().min(2, "Customer Name must be at least 2 characters"),
  address: z.string().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  typeOfWork: z.string().optional(),
  volume: z.number().optional(),
  volumeUnit: z.string().optional(),
})

// export const projectUpdateSchema = z.object({
//   projectname: z.string().optional(),
//   password: z.string().optional(),
//   email: z.string().min(6).optional(),
//   name: z.string().optional(),
//   phoneNumber: z.string().optional(),
//   projectRole: z
//     .enum(["admin", "manager", "technician", "warehouse", "helper", "finishing"])
//     .optional(),

//   status: z.enum(["true", "false"]).optional(),
// })

export type ProjectInput = z.infer<typeof projectSchema>
// export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
