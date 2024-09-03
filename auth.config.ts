import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "./data/user"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaClient, UserRole } from "@prisma/client"

type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean; 
};
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),
    Credentials({
      async authorize(credentials: Partial<Record<string, unknown>>, request: Request): Promise<User | null> {
        const validatedFields = LoginSchema.safeParse(credentials)
        
        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          const user = await getUserByEmail(email)
          if (!user || !user.password) return null
          
          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          )
          
          if (passwordsMatch) {
            return {
              ...user,
              isOAuth: false, 
            }
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.isOAuth = user.isOAuth
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        // (session.user as any).isOAuth = token.isOAuth
      }
      return session
    },
  },
}