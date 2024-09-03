import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;

  if (!categoryId) {
    return new NextResponse("Category ID is required", { status: 400 });
  }

  try {
    const articles = await db.article.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        id: true,
        title: true,
        categoryId: true,
      },
    });

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json({ articles, category });
  } catch (error) {
    console.error('Error fetching articles and category:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}