import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Article = {
  id: string;
  title: string;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  if (!db || !db.article) {
    throw new Error('Database or article model is not properly initialized');
  }

  try {
    const articles = await db.article.findMany({
      where: {
        categoryId: categoryId,
      },
    });
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error(`Failed to fetch articles: ${(error as Error).message}`);
  }
}

async function getCategory(categoryId: string): Promise<Category | null> {
  if (!db || !db.category) {
    throw new Error('Database or category model is not properly initialized');
  }

  try {
    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error(`Failed to fetch category: ${(error as Error).message}`);
  }
}

export default async function CategoryArticlesPage({ params }: { params: { id: string } }) {
  let articles: Article[] = [];
  let category: Category | null = null;
  let error: Error | null = null;

  try {
    [articles, category] = await Promise.all([
      getArticlesByCategory(params.id),
      getCategory(params.id)
    ]);
  } catch (e) {
    error = e as Error;
    console.error('Error in CategoryArticlesPage:', e);
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!category) {
    notFound();
  }

  return (
    <div className='max-w-4xl mx-auto py-8'>
        <Link href="/categories" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Categories
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-3xl font-bold'>Articles in {category.name}</h1>
        
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className='bg-white p-4 rounded-md shadow-md text-black'
          >
            <h2 className='text-xl font-bold'>{article.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}