/*import { UserRole } from "@prisma/client";
import NextAuth, {type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}*/

// import { UserRole } from "@prisma/client"
// import NextAuth from "next-auth"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       role: UserRole
//     } & DefaultSession["user"]
//   }

//   interface User {
//     role: UserRole
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role?: UserRole
//   }
// }


import { UserRole } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    isTwoFactorEnabled?: boolean
    isOAuth?: boolean
  }
}