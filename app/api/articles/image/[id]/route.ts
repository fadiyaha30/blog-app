import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = await db.article.findUnique({
    where: { id: params.id },
    select: { imageData: true, imageMimeType: true },
  });

  if (!article || !article.imageData) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(article.imageData, {
    headers: {
      'Content-Type': article.imageMimeType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
