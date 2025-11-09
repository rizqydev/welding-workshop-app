// lib/validationUser.ts
import { z } from "zod"

export const userSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.email().min(1, "Name is required"),
  userRole: z.enum(["admin", "user", "technician"]),
})

export const userUpdateSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().min(6).optional(),
  name: z.string().optional(),
  userRole: z.enum(["admin", "user", "technician"]).optional(),
})

export const userRegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z.email(),
  userRole: z.enum(["user", "admin"]).default("user"),
})

export type UserInput = z.infer<typeof userSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type UserRegisterInput = z.infer<typeof userRegisterSchema>
