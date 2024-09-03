// app/api/admin/categories/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;

  try {
    // Start a transaction to ensure data integrity
    await db.$transaction(async (prisma) => {
      // Find all articles in this category
      const articles = await prisma.article.findMany({
        where: { categoryId },
        select: { id: true }
      });

      const articleIds = articles.map(article => article.id);

      // Delete all bookmarks associated with these articles
      await prisma.bookmark.deleteMany({
        where: {
          articleId: {
            in: articleIds
          }
        }
      });

      // Delete all comments associated with these articles
      await prisma.comment.deleteMany({
        where: {
          articleId: {
            in: articleIds
          }
        }
      });

      // Delete all articles in this category
      await prisma.article.deleteMany({
        where: { categoryId }
      });

      // Finally, delete the category
      await prisma.category.delete({
        where: { id: categoryId }
      });
    });

    return NextResponse.json({ message: "Category and associated content deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category and its contents" }, { status: 500 });
  }
}