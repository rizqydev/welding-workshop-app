import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import {
  registerByGoogleAuth,
  verifyCredentials,
  verifyUserByEmail,
} from "@/lib/services/authService"
import User from "@/models/User"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await verifyCredentials(credentials.username, credentials.password)
        if (!user) return null

        return {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          role: user.userRole,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub as string,
          role: token.role as string,
        }
      }

      return session
    },
    async jwt({ token, user, account }) {
      if (user) token.role = (user as any).role || "technician"

      if (account?.provider === "google" && token.email) {
        const dbUser = await User.findOne({ email: token.email }).lean()
        if (dbUser) {
          token.role = dbUser.userRole || "technician"
        }
      }
      return token
    },
    async signIn({ profile, account }) {
      try {
        if (account?.type !== "credentials") {
          const user = await verifyUserByEmail(profile?.email)

          if (!user) {
            const newUser = await registerByGoogleAuth(profile?.email, profile?.name)

            if (newUser) return true

            return "/login?error_code=403"
          }
        }

        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
