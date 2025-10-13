// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import dbConnect from '@/lib/mongoose'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        if (!credentials?.username || !credentials?.password) return null
        const user = await User.findOne({ username: credentials.username })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null
        return { id: user._id.toString(), name: user.name, role: user.userRole }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.role = token.role as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
// export default handler, {handler as GET, handler as POST}
