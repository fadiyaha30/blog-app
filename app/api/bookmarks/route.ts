import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { articleId } = await req.json()
    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: articleId,
        },
      },
    })

    if (existingBookmark) {
      // If bookmark exists, remove it
      await db.bookmark.delete({
        where: { id: existingBookmark.id },
      })
      return NextResponse.json({ message: 'Bookmark removed' })
    } else {
      // If bookmark doesn't exist, create it
      await db.bookmark.create({
        data: {
          userId: session.user.id,
          articleId: articleId,
        },
      })
      return NextResponse.json({ message: 'Bookmark added' })
    }
  } catch (error) {
    console.error('Error in bookmark API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}