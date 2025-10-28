// types/next-auth.d.ts (or similar file)
import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string // Example of a custom field
      // role: "admin" | "user"; // Another custom field
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string // Example of a custom field
    //   role: "admin" | "user"; // Another custom field
    role: string
  }

  interface JWT extends DefaultJWT {
    id: string // Example of a custom field
    //   role: "admin" | "user"; // Another custom field
    role: string
  }
}
