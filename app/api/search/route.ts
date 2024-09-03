// app/api/search/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const articles = await db.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 10, // Limit results to 10
    });

    // Ensure that the response matches the expected structure
    const formattedArticles = articles.map(article => ({
      ...article,
      author: article.author || null,
      category: article.category || null,
    }));

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}