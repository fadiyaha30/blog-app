import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  protectedRoutes,
  adminRoutes
} from "@/routes"
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) 
    || nextUrl.pathname.startsWith('/articles/') 
    || nextUrl.pathname.startsWith('/categories/')
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname)
  const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route))

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl))
    }
    
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}