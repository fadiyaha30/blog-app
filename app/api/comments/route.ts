import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
  
    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }
  
    try {
      const comments = await db.comment.findMany({
        where: { articleId },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });
  
      return NextResponse.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
  }

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, articleId } = await req.json();

    const comment = await db.comment.create({
      data: {
        content,
        author: { connect: { id: session.user.id } },
        article: { connect: { id: articleId } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}