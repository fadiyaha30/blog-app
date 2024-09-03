import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save the file
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        ...(imageUrl && { imageUrl }),
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.comment.deleteMany({
      where: { articleId: params.id },
    });
    const article = await db.article.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
