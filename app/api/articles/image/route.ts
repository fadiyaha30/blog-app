import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await db.article.findUnique({
      where: { id: params.id },
      select: { imageUrl: true },
    });

    if (article?.imageUrl) {
      const filePath = path.join(process.cwd(), 'public', article.imageUrl.slice(1));
      fs.unlinkSync(filePath);
    }

    await db.article.update({
      where: { id: params.id },
      data: { imageUrl: null },
    });

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}