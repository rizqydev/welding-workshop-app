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
  isComplete: z.boolean().default(false),
})

export const projectUpdateSchema = z.object({
  projectName: z.string().min(3, "Project Name is required"),
  customerName: z.string().min(2, "Customer Name must be at least 2 characters"),
  address: z.string().optional(),
  startDate: z
    .string()
    .nullable()
    .optional()
    .transform((str) => {
      if (typeof str === "string") {
        return new Date(str)
      }

      return str
    }),
  endDate: z.string().nullable().optional(),
  typeOfWork: z.string().optional(),
  volume: z.number().optional(),
  volumeUnit: z.string().optional(),
  isComplete: z.boolean().optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
