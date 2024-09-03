import { db } from '@/lib/db';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

type Author = {
  name: string;
};

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    role: UserRole;
    isTwoFactorEnabled: boolean;
  };
  category: {
    id: string;
    name: string;
  };
};

async function getArticles(): Promise<Article[]> {
  console.log('DB object:', db);
  console.log('DB article object:', db?.article);
  
  if (!db || !db.article) {
    throw new Error('Database or article model is not properly initialized');
  }

  try {
    const articles = await db.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        category: true,
      },
    });
    console.log('Fetched articles:', articles);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error(`Failed to fetch articles: ${(error as Error).message}`);
  }
}

export default async function BlogsPage() {
  let articles: Article[] = [];
  let error: Error | null = null;

  try {
    articles = await getArticles();
  } catch (e) {
    error = e as Error;
    console.error('Error in BlogsPage:', e);
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className='max-w-4xl mx-auto py-8'>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Admin Dashboard
      </Link>
      <h1 className='text-3xl font-bold mb-4'>All Articles</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}`}
            className='bg-white p-4 rounded-md shadow-md'
          >
            <h2 className='text-xl font-bold break-words' dangerouslySetInnerHTML={{ __html: article.title }} />
            <p className='text-m font-bold text-gray-600'>Category: {article.category.name}</p>
            <p className='text-sm'>Written by: {article.author.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}