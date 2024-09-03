import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { commentId } = params;
  const { content } = await request.json();

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.name !== session.user.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { commentId } = params;

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // if (comment.author.name !== session.user.name && session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (comment.author.name !== session.user.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}